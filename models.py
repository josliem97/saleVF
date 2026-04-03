from sqlalchemy import Column, Integer, String, Float, JSON, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Seller(Base):
    __tablename__ = "sellers"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String) # Simple for now
    domain = Column(String, unique=True, index=True) # VD: liemvinfast.vn
    name = Column(String)
    phone = Column(String)
    showroom = Column(String)
    google_ads_id = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    cars = relationship("Car", back_populates="seller")
    policies = relationship("Policy", back_populates="seller")
    leads = relationship("Lead", back_populates="seller")

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sellers.id"), index=True)
    name = Column(String, index=True)         # VD: VinFast VF 8
    model = Column(String, index=True)        # VD: VF8
    slug = Column(String, index=True)         # Removed unique=True for multi-tenant safety or keep global? For now remove unique to allow same slug for different sellers
    segment = Column(String)                  # VD: SUV, Sedan
    image_url = Column(String)                # Link ảnh xe
    versions = Column(JSON)                   # Danh sách các phiên bản: [{"name": "Eco", "price": 1000}, ...]
    specs = Column(JSON)                      # Lưu thông số kỹ thuật dạng JSON linh hoạt

    # Relationship
    seller = relationship("Seller", back_populates="cars")

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sellers.id"), index=True)
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=True)
    name = Column(String)                     # VD: Khuyến mãi tháng 10
    discount_amount = Column(Float, default=0.0) # Trừ thẳng tiền mặt
    voucher_value = Column(Float, default=0.0)   # Tặng voucher
    start_date = Column(Date)
    end_date = Column(Date)

    # Relationship
    seller = relationship("Seller", back_populates="policies")

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sellers.id"), index=True)
    name = Column(String)
    phone = Column(String)
    address = Column(String)
    interested_car_id = Column(String)
    status = Column(String, default="Mới") # Ví dụ: Mới, Đang tư vấn, Đã chốt, Hủy

    # Relationship
    seller = relationship("Seller", back_populates="leads")
    
# Sau này sẽ thêm các bảng: Registration_Fees, Customers, Loans
