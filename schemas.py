from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import date

# --- Schema cho Người bán (Seller/Agent) ---
class SellerBase(BaseModel):
    username: str
    domain: str
    name: str
    phone: str
    showroom: str
    google_ads_id: Optional[str] = None
    is_active: bool = True

class SellerCreate(SellerBase):
    password: str

class SellerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    showroom: Optional[str] = None
    google_ads_id: Optional[str] = None
    is_active: Optional[bool] = None

class SellerResponse(SellerBase):
    id: int

    class Config:
        from_attributes = True

# --- Schema cho Xe (Car) ---
class CarBase(BaseModel):
    seller_id: int
    name: str
    model: str
    slug: Optional[str] = None
    segment: str
    image_url: str
    versions: List[Dict[str, Any]] # [{"name": "Eco", "price": 1200000000}, ...]
    specs: Optional[Dict[str, Any]] = None

class CarCreate(CarBase):
    pass

class CarUpdate(CarBase):
    pass

class CarResponse(CarBase):
    id: int

    class Config:
        from_attributes = True

# --- Schema cho Ưu đãi (Policy) ---
class PolicyBase(BaseModel):
    seller_id: int
    car_id: Optional[int] = None
    name: str
    discount_amount: float = 0.0
    voucher_value: float = 0.0
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(PolicyBase):
    pass

class PolicyResponse(PolicyBase):
    id: int

    class Config:
        from_attributes = True

# --- Schema cho Tính toán (Calculation) ---
class LanBanhRequest(BaseModel):
    gia_xe: float
    khu_vuc: str
    loai_xe: str = "Điện"

class LanBanhResponse(BaseModel):
    gia_xe: float
    thue_truoc_ba: float
    phi_bien_so: float
    phi_dang_kiem: float
    phi_duong_bo: float
    bao_hiem_tnds: float
    tong_chi_phi: float

class TraGopRequest(BaseModel):
    tong_gia_tri: float
    phan_tram_vay: float
    ky_han_thang: int
    lai_co_dinh_3_nam: float
    lai_tha_noi: float

class TraGopChiTiet(BaseModel):
    thang: int
    du_no_dau_ky: int
    tien_goc: int
    tien_lai: int
    tong_tra: int
    du_no_cuoi_ky: int

class TraGopResponse(BaseModel):
    tong_gia_tri: float
    tai_tro_ngan_hang: float
    khach_tra_truoc: float
    chi_tiet_lich_tra_no: List[TraGopChiTiet]

# --- Schema cho CRM Khách hàng (Lead) ---
class LeadBase(BaseModel):
    seller_id: int
    name: str
    phone: str
    address: str
    interested_car_id: str
    status: str = "Mới"

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    status: str

class LeadResponse(LeadBase):
    id: int

    class Config:
        from_attributes = True
