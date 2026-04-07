"use client"
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { useSeller } from '@/app/SellerContext';

export default function LeadForm({ defaultCarId = "" }: { defaultCarId?: string }) {
  const [cars, setCars] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    interested_car_id: defaultCarId || ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { seller } = useSeller();

  useEffect(() => {
    const fetchCars = async () => {
      if (!seller?.id) return;
      try {
        const res = await fetch(`${API_BASE_URL}/cars/?seller_id=${seller.id}`);
        if (res.ok) {
          const data = await res.json();
          setCars(data);
          if (!formData.interested_car_id && data.length > 0) {
            setFormData(prev => ({ ...prev, interested_car_id: data[0].id.toString() }));
          }
        }
      } catch (err) { console.error(err); }
    };
    fetchCars();
  }, [seller?.id]); // Thêm dependency seller?.id

  useEffect(() => {
    if (defaultCarId) {
       setFormData(prev => ({ ...prev, interested_car_id: defaultCarId.toString() }));
    }
  }, [defaultCarId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) {
      alert("Đang tải context người bán, vui lòng thử lại sau.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        seller_id: seller.id
      };
      const res = await fetch(`${API_BASE_URL}/leads/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) setSubmitted(true);
      else {
        const err = await res.json();
        alert("Gửi thất bại. Vui lòng kiểm tra lại thông tin. (" + (err.detail || "") + ")");
      }
    } catch (error) {
      alert("Lỗi khi gửi thông tin! Vui lòng thử lại sau.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 p-8 md:p-12 rounded-3xl border-2 border-green-200 text-center max-w-3xl mx-auto my-16 shadow-xl shadow-green-100 animate-in zoom-in-95">
        <h3 className="text-3xl font-black text-green-700 mb-4 tracking-tight">ĐÃ GỬI YÊU CẦU THÀNH CÔNG!</h3>
        <p className="text-green-600 text-lg font-medium">Cảm ơn bạn đã quan tâm. Chuyên viên Sale của VinFast sẽ liên hệ ngay lập tức.</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-colors">Gửi thêm yêu cầu</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 max-w-3xl mx-auto my-16 relative overflow-hidden" id="lead-form">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>
      
      <div className="relative z-10">
        <h3 className="text-3xl md:text-4xl font-black text-[#0a1128] text-center mb-8 tracking-tight">NHẬN TƯ VẤN & BÁO GIÁ</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên *</label>
              <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#1464f4]/20 focus:border-[#1464f4] outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Vd: Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại *</label>
              <input required type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#1464f4]/20 focus:border-[#1464f4] outline-none transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Vd: 090xxxxxxx" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Khu vực sống (Địa chỉ)</label>
            <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-[#1464f4]/20 focus:border-[#1464f4] outline-none transition-all" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Phường, Quận, Thành phố..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Dòng xe quan tâm nhất</label>
            <select className="w-full bg-gray-50 border border-gray-200 text-lg rounded-xl p-4 focus:ring-2 focus:ring-[#1464f4]/20 focus:border-[#1464f4] outline-none font-semibold text-[#1464f4]" value={formData.interested_car_id} onChange={e => setFormData({...formData, interested_car_id: e.target.value})}>
              {cars.map(c => <option key={c.id} value={c.id}>{c.name} {c.versions[0]?.name || ''}</option>)}
            </select>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-[#1464f4] hover:bg-blue-700 text-white font-black tracking-wider py-5 rounded-xl text-lg transition-all shadow-[0_10px_20px_rgba(20,100,244,0.3)] hover:shadow-[0_15px_30px_rgba(20,100,244,0.4)] hover:-translate-y-1">
            {loading ? "ĐANG GỬI THÔNG TIN..." : "XÁC NHẬN GỬI YÊU CẦU"}
          </button>
        </form>
      </div>
    </div>
  );
}
