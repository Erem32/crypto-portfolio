# Crypto Portfolio Simulator

A full-stack web application for **simulated cryptocurrency trading**.
Users can browse live market data, execute buy and sell operations using virtual funds, track portfolio holdings, and analyze performance over time.

**Live demo:** [https://peaceful-cascaron-37d88b.netlify.app/](https://peaceful-cascaron-37d88b.netlify.app/)

> **Note:** The backend may enter sleep mode on free hosting.
> If data does not load immediately, wait a moment and refresh the page.

---

## Features

* **Authentication (JWT)**
  User registration, login, password and email updates

* **Market Data (CoinGecko)**
  Fixed list of supported cryptocurrencies with live prices and short-term trends
  Server-side caching (30 seconds)

* **Trading Simulation**
  Buy and sell cryptocurrencies using virtual funds
  Balance validation and immutable transaction history

* **Portfolio Management**
  Persistent user holdings stored in the database

* **Performance Tracking**
  Daily net-worth snapshots
  Interactive performance chart in the dashboard (Recharts)

---

## Tech Stack

### Frontend

* React
* Recharts (performance visualization)

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* JWT authentication (HS256)
* Password hashing (pbkdf2_sha256)

---

## Project Structure

```text
.
├── crypto-trading-backend/   # FastAPI backend
└── crypto-trading/           # React frontend
```

---

## API Overview

### Health

* `GET /health`
  Returns API status

### Authentication

* `POST /auth/register`
* `POST /auth/login`
* `GET /auth/me`
* `POST /auth/change-password`
* `POST /auth/change-email`

### Market

* `GET /market`
  Returns supported cryptocurrencies with prices and metadata

### Trading

* `POST /orders/buy`
* `POST /orders/sell`
* `GET /orders/history?limit=20`

### Portfolio & Performance

* `GET /portfolio`
* `POST /portfolio`
* `POST /portfolio/performance/snapshot`
* `GET /portfolio/performance?days=90`

---

## Environment Variables

Create a `.env` file in `crypto-trading-backend/`:

```bash
DATABASE_URL=postgresql+psycopg2://user:password@host:5432/dbname
JWT_SECRET=your_random_secret
```

---

## Running Locally

### Backend (FastAPI)

```bash
cd crypto-trading-backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API enables CORS for `http://localhost:5173`.

### Frontend (React)

```bash
cd crypto-trading
npm install
npm run dev
```

Ensure the frontend is configured to use the correct backend base URL.

---

## Application Notes

* Each new user starts with **$10,000** in virtual funds
* Market data is cached for **30 seconds** to limit external API calls
* Net-worth history is stored as **one snapshot per user per day**

---

## Roadmap

* Docker Compose support (frontend + backend + database)
* Automated tests and CI pipeline
* Pagination and filtering for market and transaction views
* Improved form validation and UI feedback


