# app/main.py
from fastapi import FastAPI
from .db import Base, engine
from .routers import auth, portfolio, market, orders
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Crypto Portfolio Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://peaceful-cascaron-37d88b.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


app.include_router(auth.router)
app.include_router(portfolio.router)
app.include_router(market.router)
app.include_router(orders.router)


@app.get("/health")
def health():
    return {"status": "ok"}
