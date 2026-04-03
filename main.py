from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import crud
import calculator
from database import engine, get_db

# Khởi tạo toàn bộ các bảng vào Database (Lưu ý: trên production thường dùng Alembic cho migration)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VinFast Sale System API",
    description="Hệ thống quản lý dữ liệu cho Sale VinFast (Back-end Core)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Thay bằng ["http://localhost:3000"] trên production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to VinFast Sale System API. Use /docs to view Swagger UI."}

# ================================
# QUẢN LÝ XE (CARS)
# ================================
@app.post("/cars/", response_model=schemas.CarResponse, tags=["Cars"])
def create_car(car: schemas.CarCreate, db: Session = Depends(get_db)):
    return crud.create_car(db=db, car=car)

@app.get("/cars/", response_model=List[schemas.CarResponse], tags=["Cars"])
def read_cars(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cars = crud.get_cars(db, skip=skip, limit=limit)
    return cars

@app.get("/cars/{car_id}", response_model=schemas.CarResponse, tags=["Cars"])
def read_car(car_id: int, db: Session = Depends(get_db)):
    db_car = crud.get_car(db, car_id=car_id)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin xe.")
    return db_car

@app.get("/cars/slug/{slug}", response_model=schemas.CarResponse, tags=["Cars"])
def read_car_by_slug(slug: str, db: Session = Depends(get_db)):
    db_car = crud.get_car_by_slug(db, slug=slug)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin xe qua slug.")
    return db_car

@app.put("/cars/{car_id}", response_model=schemas.CarResponse, tags=["Cars"])
def update_car(car_id: int, car: schemas.CarUpdate, db: Session = Depends(get_db)):
    db_car = crud.update_car(db, car_id=car_id, car=car)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin xe.")
    return db_car

@app.delete("/cars/{car_id}", response_model=schemas.CarResponse, tags=["Cars"])
def delete_car(car_id: int, db: Session = Depends(get_db)):
    db_car = crud.delete_car(db, car_id=car_id)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin xe.")
    return db_car

# ================================
# QUẢN LÝ CHÍNH SÁCH/ƯU ĐÃI (POLICIES)
# ================================
@app.post("/policies/", response_model=schemas.PolicyResponse, tags=["Policies"])
def create_policy(policy: schemas.PolicyCreate, db: Session = Depends(get_db)):
    return crud.create_policy(db=db, policy=policy)

@app.get("/policies/", response_model=List[schemas.PolicyResponse], tags=["Policies"])
def read_policies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    policies = crud.get_policies(db, skip=skip, limit=limit)
    return policies

@app.get("/policies/{policy_id}", response_model=schemas.PolicyResponse, tags=["Policies"])
def read_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = crud.get_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy chính sách ưu đãi.")
    return db_policy

@app.put("/policies/{policy_id}", response_model=schemas.PolicyResponse, tags=["Policies"])
def update_policy(policy_id: int, policy: schemas.PolicyUpdate, db: Session = Depends(get_db)):
    db_policy = crud.update_policy(db, policy_id=policy_id, policy=policy)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy chính sách ưu đãi.")
    return db_policy

@app.delete("/policies/{policy_id}", response_model=schemas.PolicyResponse, tags=["Policies"])
def delete_policy(policy_id: int, db: Session = Depends(get_db)):
    db_policy = crud.delete_policy(db, policy_id=policy_id)
    if db_policy is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy chính sách ưu đãi.")
    return db_policy

# ================================
# TÍNH TOÁN TÀI CHÍNH (CALCULATIONS)
# ================================
@app.post("/calculate/lan-banh", response_model=schemas.LanBanhResponse, tags=["Calculations"])
def calculate_lan_banh(req: schemas.LanBanhRequest):
    result = calculator.tinh_lan_banh(
        gia_xe=req.gia_xe,
        khu_vuc=req.khu_vuc,
        loai_xe=req.loai_xe
    )
    return result

@app.post("/calculate/tra-gop", response_model=schemas.TraGopResponse, tags=["Calculations"])
def calculate_tra_gop(req: schemas.TraGopRequest):
    result = calculator.tinh_tra_gop(
        tong_gia_tri=req.tong_gia_tri,
        phan_tram_vay=req.phan_tram_vay,
        ky_han_thang=req.ky_han_thang,
        lai_co_dinh_3_nam=req.lai_co_dinh_3_nam,
        lai_tha_noi=req.lai_tha_noi
    )
    return result

# ================================
# QUẢN LÝ KHÁCH HÀNG (CRM LEADS)
# ================================
@app.post("/leads/", response_model=schemas.LeadResponse, tags=["Leads"])
def create_lead(lead: schemas.LeadCreate, db: Session = Depends(get_db)):
    return crud.create_lead(db=db, lead=lead)

@app.get("/leads/", response_model=List[schemas.LeadResponse], tags=["Leads"])
def read_leads(skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    return crud.get_leads(db, skip=skip, limit=limit)

@app.put("/leads/{lead_id}/status", response_model=schemas.LeadResponse, tags=["Leads"])
def update_lead_status(lead_id: int, status: schemas.LeadUpdate, db: Session = Depends(get_db)):
    db_lead = crud.update_lead_status(db, lead_id=lead_id, status=status.status)
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy Khách hàng.")
    return db_lead
