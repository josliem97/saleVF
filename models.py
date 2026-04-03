from sqlalchemy import Column, Integer, String, Float, JSON, Date, ForeignKey
from database import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)         # VD: VinFast VF 8
    model = Column(String, index=True)        # VD: VF8
    slug = Column(String, index=True, unique=True) # VD: vf-8-eco
    segment = Column(String)                  # VD: SUV, Sedan
    image_url = Column(String)                # Link ảnh xe
    versions = Column(JSON)                   # Danh sách các phiên bản: [{"name": "Eco", "price": 1000}, ...]
    specs = Column(JSON)                      # Lưu thông số kỹ thuật dạng JSON linh hoạt

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.id"))
    name = Column(String)                     # VD: Khuyến mãi tháng 10
    discount_amount = Column(Float, default=0.0) # Trừ thẳng tiền mặt
    voucher_value = Column(Float, default=0.0)   # Tặng voucher
    start_date = Column(Date)
    end_date = Column(Date)

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    address = Column(String)
    interested_car_id = Column(String)
    status = Column(String, default="Mới") # Ví dụ: Mới, Đang tư vấn, Đã chốt, Hủy
    
# Sau này sẽ thêm các bảng: Registration_Fees, Customers, Loans
