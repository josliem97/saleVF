from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
import crud
import calculator
from database import engine, get_db
from sqlalchemy import text # Import text for repair logic

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
# QUẢN LÝ NGƯỜI BÁN (SELLERS)
# ================================
@app.post("/sellers/", response_model=schemas.SellerResponse, tags=["Sellers"])
def create_seller(seller: schemas.SellerCreate, db: Session = Depends(get_db)):
    db_seller = crud.get_seller_by_username(db, username=seller.username)
    if db_seller:
        raise HTTPException(status_code=400, detail="Username đã tồn tại.")
    return crud.create_seller(db=db, seller=seller)

@app.get("/sellers/", response_model=List[schemas.SellerResponse], tags=["Sellers"])
def read_sellers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_sellers(db, skip=skip, limit=limit)

@app.put("/sellers/{seller_id}", response_model=schemas.SellerResponse, tags=["Sellers"])
def update_seller(seller_id: int, seller: schemas.SellerUpdate, db: Session = Depends(get_db)):
    db_seller = crud.update_seller(db, seller_id=seller_id, seller=seller)
    if db_seller is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy người bán.")
    return db_seller

@app.delete("/sellers/{seller_id}", response_model=schemas.SellerResponse, tags=["Sellers"])
def delete_seller(seller_id: int, db: Session = Depends(get_db)):
    db_seller = crud.delete_seller(db, seller_id=seller_id)
    if db_seller is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy người bán.")
    return db_seller

@app.post("/sellers/login", tags=["Sellers"])
def seller_login(data: dict, db: Session = Depends(get_db)):
    username = data.get("username")
    password = data.get("password")
    db_seller = crud.get_seller_by_username(db, username=username)
    if db_seller and db_seller.password == password:
        return db_seller
    raise HTTPException(status_code=401, detail="Sai thông tin đăng nhập.")

@app.get("/sellers/by-domain/{domain}", response_model=schemas.SellerResponse, tags=["Sellers"])
def read_seller_by_domain(domain: str, db: Session = Depends(get_db)):
    # Bỏ tiền tố http/https và www nếu có
    clean_domain = domain.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0]
    db_seller = crud.get_seller_by_domain(db, domain=clean_domain)
    if db_seller is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy người bán cho tên miền này.")
    return db_seller

@app.post("/sellers/{seller_id}/init-data", tags=["Sellers"])
def init_seller_data(seller_id: int, template_id: int = 1, db: Session = Depends(get_db)):
    success = crud.init_seller_cars(db, seller_id=seller_id, template_seller_id=template_id)
    if not success:
        raise HTTPException(status_code=500, detail="Lỗi khởi tạo dữ liệu.")
    return {"message": "Đã khởi tạo dữ liệu mặc định thành công."}

# ================================
# QUẢN LÝ XE (CARS)
# ================================
@app.post("/cars/", response_model=schemas.CarResponse, tags=["Cars"])
def create_car(car: schemas.CarCreate, db: Session = Depends(get_db)):
    return crud.create_car(db=db, car=car)

@app.get("/cars/", response_model=List[schemas.CarResponse], tags=["Cars"])
def read_cars(seller_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cars = crud.get_cars(db, seller_id=seller_id, skip=skip, limit=limit)
    return cars

@app.get("/cars/{car_id}", response_model=schemas.CarResponse, tags=["Cars"])
def read_car(car_id: int, db: Session = Depends(get_db)):
    db_car = crud.get_car(db, car_id=car_id)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin xe.")
    return db_car

@app.get("/cars/slug/{slug}", response_model=schemas.CarResponse, tags=["Cars"])
def read_car_by_slug(slug: str, seller_id: Optional[int] = None, db: Session = Depends(get_db)):
    db_car = crud.get_car_by_slug(db, slug=slug, seller_id=seller_id)
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
def read_policies(seller_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    policies = crud.get_policies(db, seller_id=seller_id, skip=skip, limit=limit)
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
def read_leads(seller_id: Optional[int] = None, skip: int = 0, limit: int = 200, db: Session = Depends(get_db)):
    return crud.get_leads(db, seller_id=seller_id, skip=skip, limit=limit)

@app.put("/leads/{lead_id}/status", response_model=schemas.LeadResponse, tags=["Leads"])
def update_lead_status(lead_id: int, status: schemas.LeadUpdate, db: Session = Depends(get_db)):
    db_lead = crud.update_lead_status(db, lead_id=lead_id, status=status.status)
    if db_lead is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy Khách hàng.")
    return db_lead

# ================================
# DEBUG & REPAIR (ONE-TIME)
# ================================
@app.get("/debug/repair-db", tags=["Debug"])
def debug_repair_db(db: Session = Depends(get_db)):
    # 1. Thêm cột seller_id nếu chưa có
    with engine.connect() as conn:
        for table in ["cars", "policies", "leads"]:
            try:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN seller_id INTEGER REFERENCES sellers(id)"))
                conn.commit()
            except Exception: pass
            
    # 2. Tạo Seller mặc định nếu chưa có
    default_username = "liemvinfast"
    db_seller = crud.get_seller_by_username(db, username=default_username)
    if not db_seller:
        db_seller = models.Seller(
            username=default_username,
            password="123",
            domain="sale-vf.vercel.app", # Cập nhật domain chính ở đây
            name="Phạm Đức Liêm",
            phone="0981 242 068",
            showroom="Vinfast Thọ Huyền Duy Tiên",
            is_active=True
        )
        db.add(db_seller)
        db.commit()
        db.refresh(db_seller)
        # Khởi tạo dữ liệu
        crud.init_seller_cars(db, seller_id=db_seller.id)
    else:
        # Cập nhật domain cho seller hiện tại nếu cần
        db_seller.domain = "sale-vf.vercel.app"
        db.commit()

    # 3. Gán seller_id cho dữ liệu mồ côi
    for model in [models.Car, models.Policy, models.Lead]:
        try:
            db.query(model).filter(model.seller_id == None).update({model.seller_id: db_seller.id})
        except Exception: pass
    db.commit()
    
    return {"status": "success", "message": "Database repaired and domain sale-vf.vercel.app registered."}
