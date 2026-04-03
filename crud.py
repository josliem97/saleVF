from sqlalchemy.orm import Session
from typing import Optional
import models
import schemas

# --- Các thao tác cho Seller (Bản thân người bán) ---
def get_seller(db: Session, seller_id: int):
    return db.query(models.Seller).filter(models.Seller.id == seller_id).first()

def get_seller_by_username(db: Session, username: str):
    return db.query(models.Seller).filter(models.Seller.username == username).first()

def get_seller_by_domain(db: Session, domain: str):
    return db.query(models.Seller).filter(models.Seller.domain == domain).first()

def create_seller(db: Session, seller: schemas.SellerCreate):
    db_seller = models.Seller(**seller.model_dump())
    db.add(db_seller)
    db.commit()
    db.refresh(db_seller)
    return db_seller

def get_sellers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Seller).offset(skip).limit(limit).all()

def update_seller(db: Session, seller_id: int, seller: schemas.SellerUpdate):
    db_seller = get_seller(db, seller_id)
    if db_seller:
        update_data = seller.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_seller, key, value)
        db.commit()
        db.refresh(db_seller)
    return db_seller

def delete_seller(db: Session, seller_id: int):
    db_seller = get_seller(db, seller_id)
    if db_seller:
        db.delete(db_seller)
        db.commit()
    return db_seller

def init_seller_cars(db: Session, seller_id: int, template_seller_id: int = 1):
    """Sao chép danh mục xe từ một seller mẫu sang seller mới"""
    template_cars = db.query(models.Car).filter(models.Car.seller_id == template_seller_id).all()
    for t_car in template_cars:
        new_car = models.Car(
            seller_id=seller_id,
            name=t_car.name,
            model=t_car.model,
            slug=t_car.slug,
            segment=t_car.segment,
            image_url=t_car.image_url,
            versions=t_car.versions,
            specs=t_car.specs
        )
        db.add(new_car)
    db.commit()
    return True

# --- Các thao tác cho Car ---
def get_car(db: Session, car_id: int, seller_id: Optional[int] = None):
    query = db.query(models.Car).filter(models.Car.id == car_id)
    if seller_id:
        query = query.filter(models.Car.seller_id == seller_id)
    return query.first()

def get_cars(db: Session, seller_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Car)
    if seller_id:
        query = query.filter(models.Car.seller_id == seller_id)
    return query.offset(skip).limit(limit).all()

def get_car_by_slug(db: Session, slug: str, seller_id: Optional[int] = None):
    query = db.query(models.Car).filter(models.Car.slug == slug)
    if seller_id:
        query = query.filter(models.Car.seller_id == seller_id)
    return query.first()

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
def get_policy(db: Session, policy_id: int, seller_id: Optional[int] = None):
    query = db.query(models.Policy).filter(models.Policy.id == policy_id)
    if seller_id:
        query = query.filter(models.Policy.seller_id == seller_id)
    return query.first()

def get_policies(db: Session, seller_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Policy)
    if seller_id:
        query = query.filter(models.Policy.seller_id == seller_id)
    return query.offset(skip).limit(limit).all()

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
def get_leads(db: Session, seller_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Lead)
    if seller_id:
        query = query.filter(models.Lead.seller_id == seller_id)
    return query.order_by(models.Lead.id.desc()).offset(skip).limit(limit).all()

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
