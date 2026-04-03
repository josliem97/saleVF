from sqlalchemy import text
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import crud
import schemas

def repair():
    # 0. Tạo bảng mới nếu chưa có
    models.Base.metadata.create_all(bind=engine)
    
    # 0b. Schema migration cho các bảng cũ (Thêm seller_id nếu chưa có)
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE cars ADD COLUMN seller_id INTEGER REFERENCES sellers(id)"))
            conn.commit()
            print("INFO: Added seller_id to cars table")
        except Exception: pass # Column likely exists or other DB error
        
        try:
            conn.execute(text("ALTER TABLE policies ADD COLUMN seller_id INTEGER REFERENCES sellers(id)"))
            conn.commit()
            print("INFO: Added seller_id to policies table")
        except Exception: pass
        
        try:
            conn.execute(text("ALTER TABLE leads ADD COLUMN seller_id INTEGER REFERENCES sellers(id)"))
            conn.commit()
            print("INFO: Added seller_id to leads table")
        except Exception: pass

    db = SessionLocal()
    # 1. Tạo Seller mặc định nếu chưa có
    default_username = "liemvinfast"
    db_seller = db.query(models.Seller).filter(models.Seller.username == default_username).first()
    if not db_seller:
        print("INFO: Creating default Seller: Pham Duc Liem...")
        db_seller = models.Seller(
            username=default_username,
            password="123", # Mật khẩu tạm
            domain="liemvinfast.onrender.com", # Domain hiện tại
            name="Phạm Đức Liêm",
            phone="0981 242 068",
            showroom="Vinfast Thọ Huyền Duy Tiên",
            is_active=True
        )
        db.add(db_seller)
        db.commit()
        db.refresh(db_seller)
        print(f"OK: Created Seller ID: {db_seller.id}")
    else:
        print(f"INFO: Default Seller already exists (ID: {db_seller.id})")

    # 2. Cập nhật seller_id cho toàn bộ Xe
    cars = db.query(models.Car).filter(models.Car.seller_id == None).all()
    if cars:
        print(f"INFO: Mapping {len(cars)} cars to default seller...")
        for car in cars:
            car.seller_id = db_seller.id
        db.commit()
        print("OK: Updated Cars.")

    # 3. Cập nhật seller_id cho toàn bộ Chính sách
    pols = db.query(models.Policy).filter(models.Policy.seller_id == None).all()
    if pols:
        print(f"INFO: Mapping {len(pols)} policies to default seller...")
        for pol in pols:
            pol.seller_id = db_seller.id
        db.commit()
        print("OK: Updated Policies.")

    # 4. Cập nhật seller_id cho toàn bộ Leads
    leads = db.query(models.Lead).filter(models.Lead.seller_id == None).all()
    if leads:
        print(f"INFO: Mapping {len(leads)} leads to default seller...")
        for lead in leads:
            lead.seller_id = db_seller.id
        db.commit()
        print("OK: Updated Leads.")

    db.close()
    print("\n--- COMPLETED MULTI-TENANT MIGRATION ---")

if __name__ == "__main__":
    repair()
