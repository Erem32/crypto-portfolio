from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    DateTime,
    func,
    Float,
    Date,
)
from .db import Base


class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    password_hash = Column(String(255), nullable=False)
    cash_usd = Column(Float, nullable=False, default=10_000.0)


class Holdings(Base):
    __tablename__ = "holdings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    symbol = Column(String(50), nullable=False)
    name = Column(String(255), nullable=False)
    logo = Column(String(255))
    price = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    change24hPct = Column(Float, nullable=False)


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symbol = Column(String(50), nullable=False)
    side = Column(String(50), nullable=False)
    quantity = Column(Float, nullable=False)
    price_usd = Column(Float, nullable=False)
    total_value_usd = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class NetWorthSnapshot(Base):
    __tablename__ = "net_worth_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    net_worth_usd = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
