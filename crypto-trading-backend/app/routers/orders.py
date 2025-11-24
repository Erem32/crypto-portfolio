from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models
from .auth import get_current_user
from .market import get_market_data
from ..db import get_db
from fastapi import Query

router = APIRouter(prefix="/orders", tags=["orders"])


def get_cached_coin_per_symbol(symbol: str):
    """
    Look up a single coin from the cached market data by its symbol
    (case-insensitive). Returns None if not found.
    """
    coins = get_market_data()
    symbol_upper = symbol.upper()

    for coin in coins:
        if coin.symbol.upper() == symbol_upper:
            return coin
    return None


@router.post("/buy", response_model=schemas.TransactionOut)
def buy(
    payload: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user: models.Users = Depends(get_current_user),
):
    # 1) Basic validation
    if payload.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be more than 0")

    # 2) Get coin from cached market data
    coin = get_cached_coin_per_symbol(payload.symbol)
    if coin is None:
        raise HTTPException(
            status_code=404,
            detail="Symbol not found in current market data",
        )

    # 3) Resolve price field (supports priceUSD or price)
    unit_price = getattr(coin, "priceUSD", None)
    if unit_price is None:
        unit_price = getattr(coin, "price", None)

    if unit_price is None:
        raise HTTPException(
            status_code=500,
            detail="Market data for this symbol has no price field",
        )

    total_value = payload.quantity * unit_price
    symbol_upper = coin.symbol.upper()

    # 4) 💰 Check cash and deduct
    if current_user.cash_usd < total_value:
        raise HTTPException(
            status_code=400,
            detail="Insufficient cash balance to complete this purchase",
        )

    # deduct from user cash
    current_user.cash_usd -= total_value

    # 5) Create immutable transaction record
    tx = models.Transaction(
        user_id=current_user.id,
        symbol=symbol_upper,
        side="BUY",
        quantity=payload.quantity,
        price_usd=unit_price,
        total_value_usd=total_value,
    )

    # 6) Find existing holding for this user + symbol
    holding = (
        db.query(models.Holdings)
        .filter(
            models.Holdings.user_id == current_user.id,
            models.Holdings.symbol == symbol_upper,
        )
        .first()
    )

    logo_value = getattr(coin, "logoUrl", None) or getattr(coin, "logo", None) or ""

    if holding is None:
        holding = models.Holdings(
            user_id=current_user.id,
            symbol=symbol_upper,
            name=getattr(coin, "name", symbol_upper),
            logo=logo_value,
            price=unit_price,
            quantity=payload.quantity,
            change24hPct=getattr(coin, "change24hPct", 0.0),
        )
        db.add(holding)
    else:
        holding.quantity += payload.quantity
        holding.price = unit_price
        if hasattr(holding, "change24hPct"):
            holding.change24hPct = getattr(coin, "change24hPct", holding.change24hPct)
        if logo_value:
            holding.logo = logo_value

    db.add(tx)
    db.commit()
    db.refresh(tx)

    return tx


@router.post("/sell", response_model=schemas.TransactionOut)
def sell(
    payload: schemas.TransactionCreate,
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.quantity <= 0:
        raise HTTPException(400, detail="Quantity must be a postitive value")

    coin = get_cached_coin_per_symbol(payload.symbol)
    if coin is None:
        raise HTTPException(404, detail="Symbol not found in current market data")

    unit_price = getattr(coin, "priceUSD", None) or getattr(coin, "price", None)
    if unit_price is None:

        raise HTTPException(
            500, detail="Market data for this symbol has no price field"
        )
    symbol_upper = payload.symbol.upper()

    holding = (
        db.query(models.Holdings)
        .filter(
            models.Holdings.user_id == current_user.id,
            models.Holdings.symbol == symbol_upper,
        )
        .first()
    )

    if holding is None:
        raise HTTPException(404, detail="You do not own this asset")

    if holding.quantity < payload.quantity:
        raise HTTPException(400, detail="Insufficient quantity to sell")

    total_value = payload.quantity * unit_price

    holding.quantity -= payload.quantity

    if holding.quantity <= 0:
        db.delete(holding)

    current_user.cash_usd += total_value

    tx = models.Transaction(
        user_id=current_user.id,
        symbol=symbol_upper,
        side="SELL",
        quantity=payload.quantity,
        price_usd=unit_price,
        total_value_usd=total_value,
    )

    db.add(tx)
    db.commit()
    db.refresh(tx)

    return tx


@router.get("/history", response_model=list[schemas.TransactionOut])
def list_transactions(
    db: Session = Depends(get_db),
    current_user: models.Users = Depends(get_current_user),
    limit: int = Query(20, ge=1, le=100),
):
    """
    Return latest transactions for the current user (most recent first).
    """
    q = (
        db.query(models.Transaction)
        .filter(models.Transaction.user_id == current_user.id)
        .order_by(models.Transaction.created_at.desc())
        .limit(limit)
    )
    return q.all()
