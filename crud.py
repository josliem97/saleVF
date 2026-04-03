from sqlalchemy.orm import Session
import models
import schemas

# --- Các thao tác cho Car ---
def get_car(db: Session, car_id: int):
    return db.query(models.Car).filter(models.Car.id == car_id).first()

def get_cars(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Car).offset(skip).limit(limit).all()

def get_car_by_slug(db: Session, slug: str):
    return db.query(models.Car).filter(models.Car.slug == slug).first()

def create_car(db: Session, car: schemas.CarCreate):
    db_car = models.Car(**car.model_dump())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

def update_car(db: Session, car_id: int, car: schemas.CarUpdate):
    db_car = get_car(db, car_id)
    if db_car:
        update_data = car.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_car, key, value)
        db.commit()
        db.refresh(db_car)
    return db_car

def delete_car(db: Session, car_id: int):
    db_car = get_car(db, car_id)
    if db_car:
        db.delete(db_car)
        db.commit()
    return db_car

# --- Các thao tác cho Policy ---
def get_policy(db: Session, policy_id: int):
    return db.query(models.Policy).filter(models.Policy.id == policy_id).first()

def get_policies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Policy).offset(skip).limit(limit).all()

def create_policy(db: Session, policy: schemas.PolicyCreate):
    db_policy = models.Policy(**policy.model_dump())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

def update_policy(db: Session, policy_id: int, policy: schemas.PolicyUpdate):
    db_policy = get_policy(db, policy_id)
    if db_policy:
        update_data = policy.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_policy, key, value)
        db.commit()
        db.refresh(db_policy)
    return db_policy

def delete_policy(db: Session, policy_id: int):
    db_policy = get_policy(db, policy_id)
    if db_policy:
        db.delete(db_policy)
        db.commit()
    return db_policy

# --- Các thao tác cho Lead (Khách Hàng Mục Tiêu) ---
def get_leads(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Lead).order_by(models.Lead.id.desc()).offset(skip).limit(limit).all()

def create_lead(db: Session, lead: schemas.LeadCreate):
    db_lead = models.Lead(**lead.model_dump())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

def update_lead_status(db: Session, lead_id: int, status: str):
    db_lead = db.query(models.Lead).filter(models.Lead.id == lead_id).first()
    if db_lead:
        db_lead.status = status
        db.commit()
        db.refresh(db_lead)
    return db_lead
