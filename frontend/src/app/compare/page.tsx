"use client"
import React, { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { API_BASE_URL } from "@/lib/api"

export default function ComparePage() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [car1Id, setCar1Id] = useState<string | number>("")
  const [car2Id, setCar2Id] = useState<string | number>("")

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cars/`);
        if (res.ok) {
          const data = await res.json();
          setCars(data);
          if (data.length >= 2) {
            setCar1Id(data[0].id);
            setCar2Id(data[1].id);
          } else if (data.length === 1) {
            setCar1Id(data[0].id);
            setCar2Id(data[0].id);
          }
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchCars();
  }, []);

  const selectedCar1 = cars.find(c => c.id === Number(car1Id))
  const selectedCar2 = cars.find(c => c.id === Number(car2Id))

  if (loading) return <div className="p-20 text-center font-bold text-gray-500">Đang tải dữ liệu so sánh...</div>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href='/'}>
            <div className="w-10 h-10 bg-[#1464f4] text-white flex items-center justify-center font-black text-2xl rounded-lg">V</div>
            <h1 className="text-2xl font-black tracking-tight text-[#0a1128]">VINFAST</h1>
          </div>
          <nav className="hidden md:flex gap-8 font-semibold text-gray-600">
            <a href="/" className="hover:text-gray-900 transition-colors">Danh mục Xe</a>
            <a href="/compare" className="text-[#1464f4]">So sánh</a>
            <a href="/estimate" className="hover:text-gray-900 transition-colors">Dự toán</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-grow max-w-7xl">
        <div className="mb-8 pl-2">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">SO SÁNH XE</h1>
          <p className="text-gray-500 font-medium text-lg">Phân tích chi tiết các dòng xe VinFast</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Chiếc xe 1</label>
            <select 
              className="w-full h-12 rounded-xl border-2 border-gray-100 bg-gray-50 px-4 text-lg font-bold text-[#1464f4] focus:border-[#1464f4] outline-none transition-all"
              value={car1Id}
              onChange={(e) => setCar1Id(e.target.value)}
            >
              {cars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Chiếc xe 2</label>
            <select 
              className="w-full h-12 rounded-xl border-2 border-gray-100 bg-gray-50 px-4 text-lg font-bold text-red-600 focus:border-red-500 outline-none transition-all"
              value={car2Id}
              onChange={(e) => setCar2Id(e.target.value)}
            >
              {cars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {selectedCar1 && selectedCar2 && (
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm p-4 md:p-8">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-0">
                  <TableHead className="w-1/3 text-gray-400 font-bold uppercase tracking-widest text-xs">Thông số</TableHead>
                  <TableHead className="w-1/3 text-center">
                    <img src={selectedCar1.image_url} alt={selectedCar1.name} className="h-24 object-contain mx-auto drop-shadow-lg mb-4" />
                    <div className="font-black text-[#1464f4] text-xl">{selectedCar1.name}</div>
                  </TableHead>
                  <TableHead className="w-1/3 text-center">
                    <img src={selectedCar2.image_url} alt={selectedCar2.name} className="h-24 object-contain mx-auto drop-shadow-lg mb-4" />
                    <div className="font-black text-red-600 text-xl">{selectedCar2.name}</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold text-gray-600">Giá niêm yết (từ)</TableCell>
                  <TableCell className="text-center font-black text-[#1464f4] text-xl">{(selectedCar1.versions[0]?.price || 0).toLocaleString('vi-VN')} ₫</TableCell>
                  <TableCell className="text-center font-black text-red-600 text-xl">{(selectedCar2.versions[0]?.price || 0).toLocaleString('vi-VN')} ₫</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-gray-500">Phân khúc</TableCell>
                  <TableCell className="text-center font-bold text-gray-800">{selectedCar1.segment}</TableCell>
                  <TableCell className="text-center font-bold text-gray-800">{selectedCar2.segment}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-gray-500">Dung lượng Pin</TableCell>
                  <TableCell className="text-center text-gray-700">{selectedCar1.specs?.battery || '---'}</TableCell>
                  <TableCell className="text-center text-gray-700">{selectedCar2.specs?.battery || '---'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-gray-500">Quãng đường (WLTP)</TableCell>
                  <TableCell className="text-center font-bold text-green-600">{selectedCar1.specs?.range || '---'}</TableCell>
                  <TableCell className="text-center font-bold text-green-600">{selectedCar2.specs?.range || '---'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-gray-500">Công suất</TableCell>
                  <TableCell className="text-center text-gray-700">{selectedCar1.specs?.power || '---'}</TableCell>
                  <TableCell className="text-center text-gray-700">{selectedCar2.specs?.power || '---'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-gray-500">Kích thước</TableCell>
                  <TableCell className="text-center text-gray-600 text-sm">{selectedCar1.specs?.dimensions || '---'}</TableCell>
                  <TableCell className="text-center text-gray-600 text-sm">{selectedCar2.specs?.dimensions || '---'}</TableCell>
                </TableRow>
                <TableRow className="border-0">
                  <TableCell></TableCell>
                  <TableCell className="text-center pt-8">
                     <Button className="w-full" onClick={() => window.location.href=`/car/${selectedCar1.slug}`}>Xem chi tiết</Button>
                  </TableCell>
                  <TableCell className="text-center pt-8">
                     <Button className="w-full" variant="outline" onClick={() => window.location.href=`/car/${selectedCar2.slug}`}>Xem chi tiết</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  )
}
