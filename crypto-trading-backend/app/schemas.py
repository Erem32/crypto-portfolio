from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Literal
from datetime import datetime, date


class UserCreate(BaseModel):
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="Raw password (>= 8 chars)")


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    cash_usd: float


class HoldingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    symbol: str
    name: str
    logo: str | None = None
    price: float
    quantity: float
    change24hPct: float
    sparkline: list[float] | None = None


class HoldingCreate(BaseModel):
    symbol: str
    name: str
    logo: str | None = None
    price: float
    quantity: float
    change24hPct: float


class MarketCoin(BaseModel):
    symbol: str
    name: str
    priceUSD: float
    change24hPct: float
    sparkline: list[float] | None = None
    logoUrl: str | None = None


class TransactionCreate(BaseModel):
    symbol: str
    quantity: float


class TransactionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    symbol: str
    side: Literal["BUY", "SELL"]
    quantity: float
    price_usd: float
    total_value_usd: float
    created_at: datetime


class PasswordChange(BaseModel):
    current_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)


class EmailChange(BaseModel):
    email: EmailStr


class NetWorthSnapshotIn(BaseModel):
    net_worth_usd: float


class NetWorthSnapshotOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    date: date
    net_worth_usd: float
