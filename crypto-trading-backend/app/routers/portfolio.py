from fastapi import APIRouter, Depends, Query, Response
from .auth import get_current_user
from .. import schemas, models
from sqlalchemy.orm import Session
from ..db import get_db
from datetime import date, timedelta

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

MOCK_HOLDINGS = [
    {
        "id": "btc",
        "symbol": "BTC",
        "price": 67890.12,
        "sparkline": [1, 2, 3],
    }
]


@router.get("/", response_model=list[schemas.HoldingOut])
def get_portfolio(
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    holdings = (
        db.query(models.Holdings)
        .filter(models.Holdings.user_id == current_user.id)
        .all()
    )

    return holdings


@router.post("/", response_model=schemas.HoldingOut, status_code=201)
def create_holding(
    payload: schemas.HoldingCreate,
    db: Session = Depends(get_db),
    current_user: models.Users = Depends(get_current_user),
):
    holding = models.Holdings(
        user_id=current_user.id,
        symbol=payload.symbol,
        name=payload.name,
        logo=payload.logo,
        price=payload.price,
        quantity=payload.quantity,
        change24hPct=payload.change24hPct,
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)

    return holding


@router.post("/performance/snapshot", status_code=204)
def save_net_worth_snapshot(
    payload: schemas.NetWorthSnapshotIn,
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    today = date.today()

    row = (
        db.query(models.NetWorthSnapshot)
        .filter(
            models.NetWorthSnapshot.user_id == current_user.id,
            models.NetWorthSnapshot.date == today,
        )
        .first()
    )

    if row:
        row.net_worth_usd = payload.net_worth_usd
    else:
        row = models.NetWorthSnapshot(
            user_id=current_user.id,
            date=today,
            net_worth_usd=payload.net_worth_usd,
        )
        db.add(row)

    db.commit()
    return Response(status_code=204)


@router.get("/performance", response_model=list[schemas.NetWorthSnapshotOut])
def get_net_worth_history(
    days: int = Query(90, ge=1, le=365),
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    today = date.today()
    cutoff = today - timedelta(days=days - 1)

    q = (
        db.query(models.NetWorthSnapshot)
        .filter(
            models.NetWorthSnapshot.user_id == current_user.id,
            models.NetWorthSnapshot.date >= cutoff,
        )
        .order_by(models.NetWorthSnapshot.date.asc())
    )

    return q.all()
