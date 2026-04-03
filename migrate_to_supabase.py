import sqlite3
import os
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models # Make sure models are imported to create tables

# Usage: 
# 1. Update .env with your Supabase DATABASE_URL
# 2. Run: python migrate_to_supabase.py

from dotenv import load_dotenv
load_dotenv()

SQLITE_URL = "sqlite:///./vinfast.db"
POSTGRES_URL = os.getenv("DATABASE_URL")

if not POSTGRES_URL or "sqlite" in POSTGRES_URL:
    print("❌ Lỗi: Bạn chưa cấu hình DATABASE_URL (PostgreSQL) trong file .env")
    exit(1)

# Connect to both
engine_sqlite = create_engine(SQLITE_URL)
engine_pg = create_engine(POSTGRES_URL)

SessionSqlite = sessionmaker(bind=engine_sqlite)
SessionPg = sessionmaker(bind=engine_pg)

import json

def migrate():
    print("--- Bat dau qua trinh chuyen doi du lieu sang Supabase ---")
    
    # Create tables if not exist on PG
    from database import Base
    Base.metadata.create_all(bind=engine_pg)
    print("OK: Da khoi tao cau truc bang tren Supabase.")

    db_lite = SessionSqlite()
    db_pg = SessionPg()

    try:
        # Clear existing data on Supabase to ensure clean migration
        from models import Car, Policy, Lead
        print("INFO: Dang lam sach du lieu cu tren Supabase...")
        db_pg.query(Policy).delete()
        db_pg.query(Car).delete()
        db_pg.commit()

        cars = db_lite.execute(sqlalchemy.text("SELECT * FROM cars")).fetchall()
        print(f"INFO: Tim thay {len(cars)} xe. Dang sao chep...")
        for c in cars:
            # Note: We use raw sql or ORM. Since we have models, let's use ORM for safety
            from models import Car
            
            # SQLite might return JSON as string, we need to convert to Python objects for PG JSON column
            try:
                versions_obj = json.loads(c.versions) if isinstance(c.versions, str) else c.versions
            except:
                versions_obj = c.versions

            try:
                specs_obj = json.loads(c.specs) if isinstance(c.specs, str) else c.specs
            except:
                specs_obj = c.specs

            new_car = Car(
                id=c.id, 
                name=c.name, 
                model=c.model, 
                slug=getattr(c, 'slug', f"car-{c.id}"), 
                segment=c.segment, 
                image_url=c.image_url,
                versions=versions_obj,
                specs=specs_obj
            )
            db_pg.add(new_car)
        
        db_pg.commit()
        print("OK: Da sao chep xong danh muc Xe.")

        # Migrate Policies
        pols = db_lite.execute(sqlalchemy.text("SELECT * FROM policies")).fetchall()
        print(f"INFO: Tim thay {len(pols)} chinh sach. Dang sao chep...")
        
        # Get all car IDs from PG to check FK
        from models import Car, Policy
        valid_car_ids = [c.id for c in db_pg.query(Car.id).all()]
        
        for p in pols:
            exists = db_pg.query(Policy).filter(Policy.id == p.id).first()
            if not exists:
                target_car_id = getattr(p, 'car_id', None)
                if target_car_id not in valid_car_ids:
                    target_car_id = None # FK safety
                
                new_pol = Policy(
                    id=p.id,
                    car_id=target_car_id,
                    name=p.name,
                    discount_amount=p.discount_amount,
                    voucher_value=p.voucher_value,
                    start_date=getattr(p, 'start_date', None),
                    end_date=getattr(p, 'end_date', None)
                )
                db_pg.add(new_pol)
        
        db_pg.commit()
        print("OK: Da sao chep xong chinh sach uu dai.")

        # Migrate Leads
        leads = db_lite.execute(sqlalchemy.text("SELECT * FROM leads")).fetchall()
        print(f"INFO: Tim thay {len(leads)} leads. Dang sao chep...")
        for l in leads:
            from models import Lead
            exists = db_pg.query(Lead).filter(Lead.id == l.id).first()
            if not exists:
                new_lead = Lead(
                    id=l.id,
                    name=l.name,
                    phone=l.phone,
                    address=l.address,
                    interested_car_id=l.interested_car_id,
                    status=l.status
                )
                db_pg.add(new_lead)
        
        db_pg.commit()
        print("OK: Da sao chep xong danh sach Leads.")

        print("\n--- TAT CA DU LIEU DA DUOC CHUYEN LEN SUPABASE THANH CONG! ---")
        print("Bay gio ban co the deploy backend len Render/Railway va tro DATABASE_URL vao day.")

    except Exception as e:
        print(f"ERROR: Loi trong qua trinh migration: {e}")
        db_pg.rollback()
    finally:
        db_lite.close()
        db_pg.close()

if __name__ == "__main__":
    migrate()
