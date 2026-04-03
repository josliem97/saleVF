import json
import sqlite3
import os
from datetime import date

# FULL DATA FROM MOCKCARS.TS AND USER REQUESTS
CARS = [
    {
        "name": "VinFast VF 3 Eco", "model": "VF3", "slug": "vf3-eco", "segment": "Mini SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw115fdd0d/images/VF3/vf3-hero.png",
        "versions": [{"name": "Tiêu chuẩn 2", "price": 302000000}, {"name": "Tiêu chuẩn 1", "price": 299000000}],
        "specs": {"battery": "18.64 kWh", "range": "210 km", "power": "43 hp", "dimensions": "3,190 x 1,679 x 1,622 mm"}
    },
    {
        "name": "VinFast VF 3 Plus", "model": "VF3", "slug": "vf3-plus", "segment": "Mini SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw115fdd0d/images/VF3/vf3-hero.png",
        "versions": [{"name": "Tiêu chuẩn 2", "price": 315000000}],
        "specs": {"battery": "18.64 kWh", "range": "210 km", "power": "43 hp", "dimensions": "3,190 x 1,679 x 1,622 mm"}
    },
    {
        "name": "VinFast VF 5 Plus", "model": "VF5", "slug": "vf5-plus", "segment": "A-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dweb4acff0/images/VF5/vf5-hero-silver.png",
        "versions": [{"name": "Tiêu chuẩn", "price": 529000000}],
        "specs": {"battery": "37.23 kWh", "range": "326 km", "power": "134 hp", "dimensions": "3,965 x 1,720 x 1,580 mm"}
    },
    {
        "name": "VinFast VF 6 Eco", "model": "VF6", "slug": "vf6-eco", "segment": "B-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF6/vf6-hero.png",
        "versions": [{"name": "Tiêu chuẩn 1", "price": 689000000}],
        "specs": {"battery": "59.6 kWh", "range": "399 km", "power": "134 hp", "dimensions": "4,238 x 1,820 x 1,594 mm"}
    },
    {
        "name": "VinFast VF 6 Plus", "model": "VF6", "slug": "vf6-plus", "segment": "B-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF6/vf6-hero.png",
        "versions": [{"name": "Bản trần thép - Việt", "price": 745000000}, {"name": "Bản trần kính - US", "price": 749000000}],
        "specs": {"battery": "59.6 kWh", "range": "399 km", "power": "201 hp", "dimensions": "4,238 x 1,820 x 1,594 mm"}
    },
    {
        "name": "VinFast VF MPV 7", "model": "MPV7", "slug": "vf-mpv-7", "segment": "MPV",
        "image_url": "https://picsum.photos/seed/vfmpv7/800/600",
        "versions": [{"name": "Tiêu chuẩn", "price": 819000000}],
        "specs": {"battery": "N/A", "range": "N/A", "power": "N/A", "dimensions": "N/A"}
    },
    {
        "name": "VinFast VF 7 Eco", "model": "VF7", "slug": "vf7-eco", "segment": "C-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF7/vf7-hero.png",
        "versions": [{"name": "Tiêu chuẩn 2", "price": 789000000}, {"name": "Tiêu chuẩn 2 - HUD", "price": 799000000}],
        "specs": {"battery": "59.6 kWh", "range": "375 km", "power": "174 hp", "dimensions": "4,545 x 1,890 x 1,635 mm"}
    },
    {
        "name": "VinFast VF 7 Plus - trần thép", "model": "VF7", "slug": "vf7-plus-thep", "segment": "C-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF7/vf7-hero.png",
        "versions": [{"name": "Tiêu chuẩn 2", "price": 889000000}, {"name": "Tiêu chuẩn 1", "price": 949000000}, {"name": "Nâng cấp", "price": 999000000}],
        "specs": {"battery": "75.3 kWh", "range": "431 km", "power": "349 hp", "dimensions": "4,545 x 1,890 x 1,635 mm"}
    },
    {
        "name": "VinFast VF 7 Plus - trần kính", "model": "VF7", "slug": "vf7-plus-kinh", "segment": "C-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF7/vf7-hero.png",
        "versions": [{"name": "Tiêu chuẩn 2", "price": 909000000}, {"name": "Tiêu chuẩn 1", "price": 969000000}, {"name": "Nâng cấp", "price": 1019000000}],
        "specs": {"battery": "75.3 kWh", "range": "431 km", "power": "349 hp", "dimensions": "4,545 x 1,890 x 1,635 mm"}
    },
    {
        "name": "VinFast VF 8 Eco (pin CATL)", "model": "VF8", "slug": "vf8-eco", "segment": "D-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF8/vf8-hero.png",
        "versions": [{"name": "Tiêu chuẩn 1", "price": 1019000000}, {"name": "Nâng cấp", "price": 1069000000}],
        "specs": {"battery": "87.7 kWh", "range": "471 km", "power": "348 hp", "dimensions": "4,750 x 1,900 x 1,660 mm"}
    },
    {
        "name": "VinFast VF 8 Plus (pin CATL)", "model": "VF8", "slug": "vf8-plus", "segment": "D-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF8/vf8-hero.png",
        "versions": [{"name": "Tiêu chuẩn", "price": 1199000000}],
        "specs": {"battery": "87.7 kWh", "range": "400 km", "power": "402 hp", "dimensions": "4,750 x 1,900 x 1,660 mm"}
    },
    {
        "name": "VinFast VF 9 Eco (pin CATL)", "model": "VF9", "slug": "vf9-eco", "segment": "E-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwa3f5b746/images/VF9/vf9-hero.png",
        "versions": [{"name": "Tiêu chuẩn", "price": 1499000000}],
        "specs": {"battery": "123 kWh", "range": "602 km", "power": "402 hp", "dimensions": "5,118 x 2,004 x 1,696 mm"}
    },
    {
        "name": "VinFast VF 9 Plus - trần thép", "model": "VF9", "slug": "vf9-plus-thep", "segment": "E-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwa3f5b746/images/VF9/vf9-hero.png",
        "versions": [{"name": "7 chỗ", "price": 1699000000}, {"name": "6 ghế", "price": 1731000000}],
        "specs": {"battery": "123 kWh", "range": "580 km", "power": "402 hp", "dimensions": "5,118 x 2,004 x 1,696 mm"}
    },
    {
        "name": "VinFast VF 9 Lạc Hồng 900", "model": "VF9", "slug": "vf9-lac-hong", "segment": "E-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwa3f5b746/images/VF9/vf9-hero.png",
        "versions": [{"name": "Tiêu chuẩn", "price": 5000000000}],
        "specs": {"battery": "123 kWh", "range": "602 km", "power": "402 hp", "dimensions": "5,118 x 2,004 x 1,696 mm"}
    },
    {
        "name": "Minio Green", "model": "Scooter", "slug": "minio-green", "segment": "Electric Scooter",
        "image_url": "https://picsum.photos/seed/minio/800/600",
        "versions": [{"name": "Tiêu chuẩn", "price": 269000000}], "specs": {}
    },
    {
        "name": "EC Van", "model": "Van", "slug": "ec-van", "segment": "Van",
        "image_url": "https://picsum.photos/seed/ecvan/800/600",
        "versions": [{"name": "Tiêu chuẩn", "price": 285000000}, {"name": "Nâng cao", "price": 305000000}, {"name": "Nâng cao + cửa trượt", "price": 325000000}], "specs": {}
    },
    {
        "name": "Herio Green", "model": "Scooter", "slug": "herio-green", "segment": "Electric Scooter",
        "image_url": "https://picsum.photos/seed/herio/800/600",
        "versions": [{"name": "Tiêu chuẩn", "price": 499000000}], "specs": {}
    },
    {
        "name": "Nerio Green", "model": "Scooter", "slug": "nerio-green", "segment": "Electric Scooter",
        "image_url": "https://picsum.photos/seed/nerio/800/600",
        "versions": [{"name": "Tiêu chuẩn", "price": 668000000}], "specs": {}
    },
    {
        "name": "Limo Green", "model": "Scooter", "slug": "limo-green", "segment": "Electric Scooter",
        "image_url": "https://picsum.photos/seed/limo/800/600",
        "versions": [{"name": "Tiêu chuẩn", "price": 749000000}], "specs": {}
    }
]

POLICIES = [
    {"name": "2026.01_CTKM GIẢM 6% TRÊN GIÁ NIÊM YẾT", "discount_amount": 0.0, "voucher_value": 6.0},
    {"name": "2026.01_CTKM GIẢM 10% TRÊN GIÁ NIÊM YẾT CHO DÒNG XE VF 8", "discount_amount": 0.0, "voucher_value": 10.0},
    {"name": "2026.01_CTKM GIẢM 10% TRÊN GIÁ NIÊM YẾT CHO DÒNG XE VF 9", "discount_amount": 0.0, "voucher_value": 10.0},
    {"name": "2025.10_Ưu đãi 50tr cho VF 7 Plus bản tiêu chuẩn 1 FWD", "discount_amount": 50000000.0, "voucher_value": 0.0},
    {"name": "2025.10_Ưu đãi 50tr cho VF 7 Plus bản nâng cấp", "discount_amount": 50000000.0, "voucher_value": 0.0},
    {"name": "2025.12_Ưu đãi giảm giá 3tr cho xe VF 3 tiêu chuẩn 1", "discount_amount": 3000000.0, "voucher_value": 0.0},
    {"name": "2025.12_Ưu đãi giảm 30tr cho VF 7 Plus Tiêu chuẩn 2", "discount_amount": 30000000.0, "voucher_value": 0.0},
    {"name": "2025.12_Ưu đãi giảm 20tr cho VF 8 Eco 1 cầu", "discount_amount": 20000000.0, "voucher_value": 0.0},
    {"name": "2025.12_Ưu đãi giảm 50tr cho VF 8 Eco 2 cầu", "discount_amount": 50000000.0, "voucher_value": 0.0},
    {"name": "2026.03 ƯU ĐÃI GIẢM 5% KH LLVT CA&QĐ", "discount_amount": 0.0, "voucher_value": 5.0},
    {"name": "2026.03_ƯU ĐÃI GIẢM 3% KHI CHUYỂN ĐỔI XE XĂNG SANG XE ĐIỆN", "discount_amount": 0.0, "voucher_value": 3.0},
]

def seed():
    conn = sqlite3.connect('vinfast.db')
    cursor = conn.cursor()
    
    # Clear existing data to avoid duplicates
    cursor.execute("DELETE FROM cars")
    cursor.execute("DELETE FROM policies")
    # cursor.execute("DELETE FROM sqlite_sequence WHERE name='cars' OR name='policies'")
    
    for car in CARS:
        cursor.execute("INSERT INTO cars (name, model, slug, segment, image_url, versions, specs) VALUES (?, ?, ?, ?, ?, ?, ?)",
                       (car['name'], car['model'], car['slug'], car['segment'], car['image_url'], json.dumps(car['versions']), json.dumps(car['specs'])))
    
    for p in POLICIES:
        cursor.execute("INSERT INTO policies (car_id, name, discount_amount, voucher_value, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
                       (0, p['name'], p['discount_amount'], p['voucher_value'], '2025-01-01', '2030-12-31'))
        
    conn.commit()
    conn.close()
    print(f"Sync complete: {len(CARS)} cars and {len(POLICIES)} policies added.")

if __name__ == "__main__":
    seed()
