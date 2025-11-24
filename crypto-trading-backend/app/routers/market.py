from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from .. import schemas
import requests
import time

router = APIRouter(prefix="/market", tags=["market"])

CACHE_TTL_SECONDS = 30
_cached_data: list[schemas.MarketCoin] | None = None
_cached_at: float | None = None


SUPPORTED_COINS = [
    {"id": "bitcoin", "symbol": "BTC", "name": "Bitcoin"},
    {"id": "ethereum", "symbol": "ETH", "name": "Ethereum"},
    {"id": "tether", "symbol": "USDT", "name": "Tether"},
    {"id": "binancecoin", "symbol": "BNB", "name": "BNB"},
    {"id": "solana", "symbol": "SOL", "name": "Solana"},
    {"id": "ripple", "symbol": "XRP", "name": "XRP"},
    {"id": "cardano", "symbol": "ADA", "name": "Cardano"},
    {"id": "dogecoin", "symbol": "DOGE", "name": "Dogecoin"},
    {"id": "tron", "symbol": "TRX", "name": "TRON"},
    {"id": "polkadot", "symbol": "DOT", "name": "Polkadot"},
    {"id": "avalanche-2", "symbol": "AVAX", "name": "Avalanche"},
    {"id": "chainlink", "symbol": "LINK", "name": "Chainlink"},
    {"id": "polygon", "symbol": "MATIC", "name": "Polygon"},
    {"id": "litecoin", "symbol": "LTC", "name": "Litecoin"},
    {"id": "uniswap", "symbol": "UNI", "name": "Uniswap"},
]


def fetch_from_coingecko() -> list[schemas.MarketCoin]:

    BASE_URL = "https://api.coingecko.com/api/v3/coins/markets"

    ids = ",".join(c["id"] for c in SUPPORTED_COINS)
    meta_by_id = {c["id"]: c for c in SUPPORTED_COINS}

    try:
        resp = requests.get(
            BASE_URL,
            params={
                "vs_currency": "usd",
                "ids": ids,
                "sparkline": "true",
                "price_change_percentage": "24h",
            },
            timeout=10,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:

        raise HTTPException(
            status_code=502, detail="Failed to fetch market data"
        ) from exc

    raw = resp.json()
    coins: list[schemas.MarketCoin] = []

    for item in raw:
        coin_id = item.get("id")
        if coin_id not in meta_by_id:

            continue

        meta = meta_by_id[coin_id]

        symbol = (meta.get("symbol") or item.get("symbol") or "").upper()
        name = meta.get("name") or item.get("name") or symbol

        price = item.get("current_price")
        if price is None:

            price = 0.0

        change_24h = item.get("price_change_percentage_24h")
        if change_24h is None:
            change_24h = 0.0

        sparkline_data = None
        sparkline_obj = item.get("sparkline_in_7d")
        if isinstance(sparkline_obj, dict):
            sparkline_data = sparkline_obj.get("price")

        logo_url = item.get("image")

        coins.append(
            schemas.MarketCoin(
                symbol=symbol,
                name=name,
                priceUSD=float(price),
                change24hPct=float(change_24h),
                sparkline=sparkline_data,
                logoUrl=logo_url,
            )
        )

    coins.sort(
        key=lambda c: next(
            (i for i, meta in enumerate(SUPPORTED_COINS) if meta["symbol"] == c.symbol),
            999,
        )
    )

    return coins


def get_market_data() -> list[schemas.MarketCoin]:
    """
    Cached accessor used by both the /market endpoint and other routers
    (e.g. orders) to get consistent market data.
    """
    global _cached_data, _cached_at

    now = time.time()

    if _cached_data is not None and _cached_at is not None:
        if now - _cached_at < CACHE_TTL_SECONDS:
            return _cached_data

    try:
        data = fetch_from_coingecko()
    except HTTPException:

        if _cached_data is not None:
            return _cached_data

        raise

    _cached_data = data
    _cached_at = now
    return _cached_data


@router.get("/", response_model=list[schemas.MarketCoin])
def get_market_coins(db: Session = Depends(get_db)):
    """
    Public API endpoint used by the frontend.

    Returns the fixed universe of coins with live prices, always the same
    symbols, so every holding in the portfolio has a matching market entry.
    """
    return get_market_data()
