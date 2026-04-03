import json
import sqlite3
import os

# Initial cars from mockCars.ts
CARS = [
    {
        "name": "VinFast VF 3 Eco",
        "model": "VF3",
        "slug": "vf-3-eco",
        "segment": "Mini SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw115fdd0d/images/VF3/vf3-hero.png",
        "versions": json.dumps([
            {"name": "Tiêu chuẩn 2", "price": 302000000},
            {"name": "Tiêu chuẩn 1", "price": 299000000}
        ]),
        "specs": json.dumps({"battery": "18.64 kWh", "range": "210 km", "power": "43 hp", "dimensions": "3,190 x 1,679 x 1,622 mm"})
    },
    {
        "name": "VinFast VF 5 Plus",
        "model": "VF5",
        "slug": "vf-5-plus",
        "segment": "A-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dweb4acff0/images/VF5/vf5-hero-silver.png",
        "versions": json.dumps([
            {"name": "Tiêu chuẩn", "price": 529000000}
        ]),
        "specs": json.dumps({"battery": "37.23 kWh", "range": "326 km", "power": "134 hp", "dimensions": "4,965 x 1,720 x 1,580 mm"})
    },
    {
        "name": "VinFast VF 8 Eco",
        "model": "VF8",
        "slug": "vf-8-eco",
        "segment": "D-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF8/vf8-hero.png",
        "versions": json.dumps([
            {"name": "Tiêu chuẩn 1", "price": 1019000000},
            {"name": "Nâng cấp", "price": 1069000000}
        ]),
        "specs": json.dumps({"battery": "87.7 kWh", "range": "471 km", "power": "348 hp", "dimensions": "4,750 x 1,900 x 1,660 mm"})
    },
    {
        "name": "VinFast VF 9 Plus",
        "model": "VF9",
        "slug": "vf-9-plus",
        "segment": "E-SUV",
        "image_url": "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwa3f5b746/images/VF9/vf9-hero.png",
        "versions": json.dumps([
            {"name": "7 chỗ", "price": 1699000000},
            {"name": "6 ghế", "price": 1731000000}
        ]),
        "specs": json.dumps({"battery": "123 kWh", "range": "580 km", "power": "402 hp", "dimensions": "5,118 x 2,004 x 1,696 mm"})
    }
]

POLICIES = [
    {"name": "2026.01_CTKM GIẢM 6% TOÀN DÒNG", "discount_amount": 0.0, "voucher_value": 6.0},
    {"name": "2025.10_Ưu đãi 50tr VF 7", "discount_amount": 50000000.0, "voucher_value": 0.0},
]

def seed():
    conn = sqlite3.connect('vinfast.db')
    cursor = conn.cursor()
    
    # Check if table exists and has slug column
    try:
        cursor.execute("SELECT slug FROM cars LIMIT 1")
    except sqlite3.OperationalError:
        print("Table 'cars' is missing 'slug' column. Please recreate the DB.")
        conn.close()
        return

    for car in CARS:
        cursor.execute("INSERT INTO cars (name, model, slug, segment, image_url, versions, specs) VALUES (?, ?, ?, ?, ?, ?, ?)",
                       (car['name'], car['model'], car['slug'], car['segment'], car['image_url'], car['versions'], car['specs']))
    
    for p in POLICIES:
        cursor.execute("INSERT INTO policies (car_id, name, discount_amount, voucher_value, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
                       (0, p['name'], p['discount_amount'], p['voucher_value'], '2025-01-01', '2030-12-31'))
        
    conn.commit()
    conn.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
