from fastapi import APIRouter, Depends, HTTPException, status, Header, Response
from sqlalchemy.orm import Session
from .. import schemas, models
from ..db import get_db
from ..security import hash_password, decode_access_token
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..security import hash_password, verify_password, create_access_token

security = HTTPBearer()
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED
)
def register_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_pw = hash_password(payload.password)
    user = models.Users(email=payload.email, password_hash=hashed_pw, cash_usd=10_000.0)

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )


@router.post("/login")
def login(payload: schemas.UserCreate, db: Session = Depends(get_db)):

    stmt = select(models.Users).where(models.Users.email == payload.email)
    user = db.execute(stmt).scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "cash_usd": user.cash_usd},
    }


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> models.Users:

    token = credentials.credentials

    user_id_str = decode_access_token(token)
    if user_id_str is None:
        raise HTTPException(401, "Invalid token")

    user_id = int(user_id_str)
    user = db.get(models.Users, user_id)
    if user is None:
        raise HTTPException(401, "User not found")

    return user


@router.get("/me", response_model=schemas.UserOut)
def read_me(current_user: models.Users = Depends(get_current_user)):
    return current_user


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    payload: schemas.PasswordChange,
    db: Session = Depends(get_db),
    current_user: models.Users = Depends(get_current_user),
):

    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    current_user.password_hash = hash_password(payload.new_password)
    db.add(current_user)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/change-email", response_model=schemas.UserOut)
def change_email(
    payload: schemas.EmailChange,
    db: Session = Depends(get_db),
    current_user: models.Users = Depends(get_current_user),
):

    current_user.email = payload.email

    try:
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already in use",
        )

    return current_user
