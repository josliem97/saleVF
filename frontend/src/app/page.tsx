"use client"
import React, { useEffect, useState } from 'react';
import { CarCard } from '../components/car/CarCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { API_BASE_URL } from '@/lib/api';
import { useSeller } from './SellerContext';

export default function Home() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [segment, setSegment] = useState("all")
  const [sort, setSort] = useState("price-asc")

  const { seller, loading: sellerLoading } = useSeller();

  useEffect(() => {
    if (sellerLoading) return;
    const fetchCars = async () => {
      try {
        const url = seller?.id ? `${API_BASE_URL}/cars/?seller_id=${seller.id}` : `${API_BASE_URL}/cars/`;
        const res = await fetch(url);
        const data = await res.json();
        setCars(data);
      } catch (err) { console.error("Error fetching cars:", err); }
      setLoading(false);
    }
    fetchCars();
  }, [seller, sellerLoading]);

  const filteredCars = cars.filter(car => {
    if (!car) return false;
    const matchSearch = (car.name || "").toLowerCase().includes(search.toLowerCase())
    const matchSegment = segment === "all" || car.segment === segment
    return matchSearch && matchSegment
  }).sort((a, b) => {
    const aPrice = a?.versions?.[0]?.price || 0;
    const bPrice = b?.versions?.[0]?.price || 0;
    if (sort === "price-asc") return aPrice - bPrice
    if (sort === "price-desc") return bPrice - aPrice
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href='/'}>
            <div className="w-10 h-10 bg-[#1464f4] text-white flex items-center justify-center font-black text-2xl rounded-lg">V</div>
            <h1 className="text-2xl font-black tracking-tight text-[#0a1128]">VINFAST</h1>
          </div>
          <nav className="hidden md:flex gap-8 font-semibold text-gray-600">
            <a href="/" className="text-[#1464f4]">Danh mục Xe</a>
            <a href="/compare" className="hover:text-gray-900 transition-colors">So sánh</a>
            <a href="/estimate" className="hover:text-gray-900 transition-colors">Dự toán</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-8 pl-2">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">Bảng giá xe VinFast</h1>
          <p className="text-gray-500 font-medium text-lg">Khám phá và so sánh giá tất cả các dòng xe VinFast</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-10 flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input 
              placeholder="🔍  Tìm kiếm xe (Vd: VF 8)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-base bg-gray-50"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              className="h-11 w-full sm:w-56 rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-700 font-semibold focus-visible:outline-none focus:border-[#1464f4] focus:ring-2 focus:ring-[#1464f4]/20 outline-none transition-colors"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
            >
              <option value="all">Tất cả phân khúc</option>
              {Array.from(new Set(cars.map(c => c.segment))).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select 
              className="h-11 w-full sm:w-56 rounded-xl border border-gray-300 bg-gray-50 px-4 text-gray-700 font-semibold focus-visible:outline-none focus:border-[#1464f4] focus:ring-2 focus:ring-[#1464f4]/20 outline-none transition-colors"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="price-asc">Khởi điểm: Thấp đến cao</option>
              <option value="price-desc">Khởi điểm: Cao đến thấp</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold">Đang tải dữ liệu xe...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCars.map(car => (
              <CarCard 
                key={car.id} 
                id={car.id}
                name={car.name}
                image={car.image_url}
                price={car.versions[0]?.price || 0}
                segment={car.segment}
                slug={car.slug}
              />
            ))}
          </div>
        )}

        {!loading && filteredCars.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 mt-6">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 font-medium text-lg mb-6">Không tìm thấy xe phù hợp với tiêu chí của bạn.</p>
            <Button variant="outline" size="lg" onClick={() => { setSearch(""); setSegment("all"); }}>Xóa bộ lọc</Button>
          </div>
        )}
      </main>
    </div>
  )
}
