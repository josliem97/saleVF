def tinh_lan_banh(gia_xe: float, khu_vuc: str, loai_xe: str = "Điện"):
    """
    Tính chi phí lăn bánh cho xe ô tô.
    
    :param gia_xe: Giá bán xe (sau khi áp dụng ưu đãi nếu có)
    :param khu_vuc: 'I' (HN, HCM) hoặc 'II' (Các tỉnh thành khác) hoặc 'III'
    :param loai_xe: 'Điện' hoặc 'Xăng'
    :return: Tổng chi phí và chi tiết các loại thuế phí
    """
    # 1. Thuế trước bạ
    # Khách hàng mua xe Điện (VinFast chủ yếu xe điện) được miễn 100% trước bạ trong 3 năm đầu (theo quy định nhà nước)
    if loai_xe.lower() == "điện":
        thue_truoc_ba = 0
    else:
        # Xe xăng: Khu vực I là 12%, khu vực khác thường là 10%
        tyle_truoc_ba = 0.12 if khu_vuc.upper() == "I" else 0.10
        thue_truoc_ba = gia_xe * tyle_truoc_ba

    # 2. Phí cấp biển số
    # Khu vực I (HN, TP.HCM) = 20,000,000 VNĐ.
    # Khu vực II = 1,000,000 VNĐ.
    # Khu vực III (Huyện, Xã) = 200,000 VNĐ. (Ta mặc định khu vực II nếu không phải I)
    phi_bien_so = 20000000 if khu_vuc.upper() == "I" else 1000000

    # 3. Phí đăng kiểm: chung cho cả nước
    phi_dang_kiem = 340000

    # 4. Phí bảo trì đường bộ (Cá nhân, 1 năm)
    phi_duong_bo = 1560000

    # 5. Bảo hiểm TNDS (Trách nhiệm dân sự - Mức tiêu chuẩn 480k cho xe dưới 6 chỗ)
    bao_hiem_tnds = 480700

    # Tổng chi phí lăn bánh
    tong_chi_phi = gia_xe + thue_truoc_ba + phi_bien_so + phi_dang_kiem + phi_duong_bo + bao_hiem_tnds

    return {
        "gia_xe": gia_xe,
        "thue_truoc_ba": thue_truoc_ba,
        "phi_bien_so": phi_bien_so,
        "phi_dang_kiem": phi_dang_kiem,
        "phi_duong_bo": phi_duong_bo,
        "bao_hiem_tnds": bao_hiem_tnds,
        "tong_chi_phi": tong_chi_phi
    }

def tinh_tra_gop(tong_gia_tri: float, phan_tram_vay: float, ky_han_thang: int, lai_co_dinh_3_nam: float, lai_tha_noi: float):
    """
    Tính lịch trả nợ vay mua xe hàng tháng (Dự nợ giảm dần).
    
    :param tong_gia_tri: Giá trị xe khách cần trả (có thể là giá xe hoặc giá lăn bánh tùy thỏa thuận)
    :param phan_tram_vay: Tỷ lệ khách vay (0 -> 100)
    :param ky_han_thang: Số tháng vay (ví dụ 36, 60, 84 tháng)
    :param lai_co_dinh_3_nam: Lãi suất cố định năm trong 3 năm đầu (Ví dụ: 8.0)
    :param lai_tha_noi: Lãi suất thả nổi các năm sau (Ví dụ: 10.5)
    :return: Mảng JSON lịch trả nợ
    """
    tien_vay = tong_gia_tri * (phan_tram_vay / 100.0)
    tien_tra_truoc = tong_gia_tri - tien_vay
    
    # Tiền gốc phải trả mỗi tháng chia đều
    goc_moi_thang = tien_vay / ky_han_thang
    du_no = tien_vay
    
    lich_tra_no = []
    
    for thang in range(1, ky_han_thang + 1):
        # Xác định lãi suất đang áp dụng cho tháng này
        # 36 tháng đầu là 3 năm
        if thang <= 36:
            lai_suat_nam_hien_tai = lai_co_dinh_3_nam
        else:
            lai_suat_nam_hien_tai = lai_tha_noi
            
        lai_suat_thang_hien_tai = (lai_suat_nam_hien_tai / 100.0) / 12.0
        
        # Tiền lãi được tính dựa trên dư nợ còn lại của tháng trước đó
        tien_lai = du_no * lai_suat_thang_hien_tai
        
        # Tổng tiền khách phải trả trong tháng này
        tong_tra_thang = goc_moi_thang + tien_lai
        
        lich_tra_no.append({
            "thang": thang,
            "du_no_dau_ky": round(du_no),
            "tien_goc": round(goc_moi_thang),
            "tien_lai": round(tien_lai),
            "tong_tra": round(tong_tra_thang),
            "du_no_cuoi_ky": round(max(0.0, du_no - goc_moi_thang))
        })
        
        # Giảm dư nợ cho tháng tiếp theo
        du_no -= goc_moi_thang
        
    return {
        "tong_gia_tri": tong_gia_tri,
        "tai_tro_ngan_hang": tien_vay,
        "khach_tra_truoc": tien_tra_truoc,
        "chi_tiet_lich_tra_no": lich_tra_no
    }
