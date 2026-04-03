export interface CarVersion {
  name: string;
  price: number;
}

export interface CarData {
  id: string;
  name: string;
  slug: string;
  segment: string;
  image: string;
  versions: CarVersion[];
  specs?: {
    battery?: string;
    range?: string;
    power?: string;
    dimensions?: string;
  };
}

export const MOCK_CARS: CarData[] = [
  {
    id: "vf3-eco",
    name: "VinFast VF 3 Eco",
    slug: "vf3-eco",
    segment: "Mini SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw115fdd0d/images/VF3/vf3-hero.png",
    versions: [
      { name: "Tiêu chuẩn 2", price: 302000000 },
      { name: "Tiêu chuẩn 1", price: 299000000 }
    ],
    specs: { battery: "18.64 kWh", range: "210 km", power: "43 hp", dimensions: "3,190 x 1,679 x 1,622 mm" }
  },
  {
    id: "vf3-plus",
    name: "VinFast VF 3 Plus",
    slug: "vf3-plus",
    segment: "Mini SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dw115fdd0d/images/VF3/vf3-hero.png",
    versions: [
      { name: "Tiêu chuẩn 2", price: 315000000 }
    ],
    specs: { battery: "18.64 kWh", range: "210 km", power: "43 hp", dimensions: "3,190 x 1,679 x 1,622 mm" }
  },
  {
    id: "vf5-plus",
    name: "VinFast VF 5 Plus",
    slug: "vf5-plus",
    segment: "A-SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dweb4acff0/images/VF5/vf5-hero-silver.png",
    versions: [
      { name: "Tiêu chuẩn", price: 529000000 }
    ],
    specs: { battery: "37.23 kWh", range: "326 km", power: "134 hp", dimensions: "3,965 x 1,720 x 1,580 mm" }
  },
  {
    id: "vf6-eco",
    name: "VinFast VF 6 Eco",
    slug: "vf6-eco",
    segment: "B-SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF6/vf6-hero.png",
    versions: [
      { name: "Tiêu chuẩn 1", price: 689000000 }
    ],
    specs: { battery: "59.6 kWh", range: "399 km", power: "134 hp", dimensions: "4,238 x 1,820 x 1,594 mm" }
  },
  {
    id: "vf6-plus",
    name: "VinFast VF 6 Plus",
    slug: "vf6-plus",
    segment: "B-SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF6/vf6-hero.png",
    versions: [
      { name: "Bản trần thép - Việt", price: 745000000 },
      { name: "Bản trần kính - US", price: 749000000 }
    ],
    specs: { battery: "59.6 kWh", range: "399 km", power: "201 hp", dimensions: "4,238 x 1,820 x 1,594 mm" }
  },
  {
    id: "vf-mpv-7",
    name: "VinFast VF MPV 7",
    slug: "vf-mpv-7",
    segment: "MPV",
    image: "https://picsum.photos/seed/vfmpv7/800/600",
    versions: [
      { name: "Tiêu chuẩn", price: 819000000 }
    ],
    specs: { battery: "N/A", range: "N/A", power: "N/A", dimensions: "N/A" }
  },
  {
    id: "vf7-eco",
    name: "VinFast VF 7 Eco",
    slug: "vf7-eco",
    segment: "C-SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF7/vf7-hero.png",
    versions: [
      { name: "Tiêu chuẩn 2", price: 789000000 },
      { name: "Tiêu chuẩn 2 - HUD", price: 799000000 }
    ],
    specs: { battery: "59.6 kWh", range: "375 km", power: "174 hp", dimensions: "4,545 x 1,890 x 1,635 mm" }
  },
  {
    id: "vf7-plus-thep",
    name: "VinFast VF 7 Plus - trần thép",
    slug: "vf7-plus-thep",
    segment: "C-SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF7/vf7-hero.png",
    versions: [
      { name: "Tiêu chuẩn 2", price: 889000000 },
      { name: "Tiêu chuẩn 1", price: 949000000 },
      { name: "Nâng cấp", price: 999000000 }
    ],
    specs: { battery: "75.3 kWh", range: "431 km", power: "349 hp", dimensions: "4,545 x 1,890 x 1,635 mm" }
  },
  {
    id: "vf7-plus-kinh",
    name: "VinFast VF 7 Plus - trần kính",
    slug: "vf7-plus-kinh",
    segment: "C-SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF7/vf7-hero.png",
    versions: [
      { name: "Tiêu chuẩn 2", price: 909000000 },
      { name: "Tiêu chuẩn 1", price: 969000000 },
      { name: "Nâng cấp", price: 1019000000 }
    ],
    specs: { battery: "75.3 kWh", range: "431 km", power: "349 hp", dimensions: "4,545 x 1,890 x 1,635 mm" }
  },
  {
    id: "vf8-eco",
    name: "VinFast VF 8 Eco (pin CATL)",
    slug: "vf8-eco",
    segment: "D-SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF8/vf8-hero.png",
    versions: [
      { name: "Tiêu chuẩn 1", price: 1019000000 },
      { name: "Nâng cấp", price: 1069000000 }
    ],
    specs: { battery: "87.7 kWh", range: "471 km", power: "348 hp", dimensions: "4,750 x 1,900 x 1,660 mm" }
  },
  {
    id: "vf8-plus",
    name: "VinFast VF 8 Plus (pin CATL)",
    slug: "vf8-plus",
    segment: "D-SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwe0df1cd9/images/VF8/vf8-hero.png",
    versions: [
      { name: "Tiêu chuẩn", price: 1199000000 }
    ],
    specs: { battery: "87.7 kWh", range: "400 km", power: "402 hp", dimensions: "4,750 x 1,900 x 1,660 mm" }
  },
  {
    id: "vf9-eco",
    name: "VinFast VF 9 Eco (pin CATL)",
    slug: "vf9-eco",
    segment: "E-SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwa3f5b746/images/VF9/vf9-hero.png",
    versions: [
      { name: "Tiêu chuẩn", price: 1499000000 }
    ],
    specs: { battery: "123 kWh", range: "602 km", power: "402 hp", dimensions: "5,118 x 2,004 x 1,696 mm" }
  },
  {
    id: "vf9-plus-thep",
    name: "VinFast VF 9 Plus - trần thép",
    slug: "vf9-plus-thep",
    segment: "E-SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwa3f5b746/images/VF9/vf9-hero.png",
    versions: [
      { name: "7 chỗ", price: 1699000000 },
      { name: "6 ghế", price: 1731000000 }
    ],
    specs: { battery: "123 kWh", range: "580 km", power: "402 hp", dimensions: "5,118 x 2,004 x 1,696 mm" }
  },
  {
    id: "vf9-lac-hong",
    name: "VinFast VF 9 Lạc Hồng 900",
    slug: "vf9-lac-hong",
    segment: "E-SUV",
    image: "https://shop.vinfastauto.com/on/demandware.static/-/Sites-app_vinfast_vn-Library/default/dwa3f5b746/images/VF9/vf9-hero.png",
    versions: [
      { name: "Tiêu chuẩn", price: 5000000000 }
    ],
    specs: { battery: "123 kWh", range: "602 km", power: "402 hp", dimensions: "5,118 x 2,004 x 1,696 mm" }
  },
  {
    id: "minio-green",
    name: "Minio Green",
    slug: "minio-green",
    segment: "Electric Scooter",
    image: "https://picsum.photos/seed/minio/800/600",
    versions: [
      { name: "Tiêu chuẩn", price: 269000000 }
    ]
  },
  {
    id: "ec-van",
    name: "EC Van",
    slug: "ec-van",
    segment: "Van",
    image: "https://picsum.photos/seed/ecvan/800/600",
    versions: [
      { name: "Tiêu chuẩn", price: 285000000 },
      { name: "Nâng cao", price: 305000000 },
      { name: "Nâng cao + cửa trượt", price: 325000000 }
    ]
  },
  {
    id: "herio-green",
    name: "Herio Green",
    slug: "herio-green",
    segment: "Electric Scooter",
    image: "https://picsum.photos/seed/herio/800/600",
    versions: [
      { name: "Tiêu chuẩn", price: 499000000 }
    ]
  },
  {
    id: "nerio-green",
    name: "Nerio Green",
    slug: "nerio-green",
    segment: "Electric Scooter",
    image: "https://picsum.photos/seed/nerio/800/600",
    versions: [
      { name: "Tiêu chuẩn", price: 668000000 }
    ]
  },
  {
    id: "limo-green",
    name: "Limo Green",
    slug: "limo-green",
    segment: "Electric Scooter",
    image: "https://picsum.photos/seed/limo/800/600",
    versions: [
      { name: "Tiêu chuẩn", price: 749000000 }
    ]
  }
];
