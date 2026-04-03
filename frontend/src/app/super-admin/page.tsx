"use client"
import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/api';

export default function SuperadminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSeller, setNewSeller] = useState({
    username: '',
    password: '',
    domain: '',
    name: '',
    phone: '',
    showroom: '',
    google_ads_id: '',
  });

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/sellers/`);
      const data = await res.json();
      setSellers(data);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) fetchSellers();
  }, [isLoggedIn]);

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/sellers/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSeller),
      });
      if (res.ok) {
        const created = await res.json();
        // Tự động khởi tạo dữ liệu mẫu cho seller mới (lấy từ template_id=1 mặc định)
        await fetch(`${API_BASE_URL}/sellers/${created.id}/init-data`, { method: 'POST' });
        alert("Đã tạo Seller và khởi tạo dữ liệu mẫu thành công!");
        setNewSeller({ username: '', password: '', domain: '', name: '', phone: '', showroom: '', google_ads_id: '' });
        fetchSellers();
      } else {
        const err = await res.json();
        alert("Lỗi: " + err.detail);
      }
    } catch (error) { alert("Lỗi khi tạo Seller"); }
  };

  const toggleSellerStatus = async (sellerId: number, currentStatus: boolean) => {
    try {
      await fetch(`${API_BASE_URL}/sellers/${sellerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });
      fetchSellers();
    } catch (error) { alert("Lỗi khi cập nhật trạng thái"); }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-sm">
          <h2 className="text-2xl font-black text-center mb-8 text-gray-900">SUPERADMIN ACCESS</h2>
          <input 
            type="password" 
            id="sp-pass" 
            placeholder="Superadmin Password" 
            className="w-full border-2 p-4 rounded-xl mb-4 text-center text-gray-900" 
          />
          <button 
            className="w-full bg-black text-white p-4 rounded-xl font-bold" 
            onClick={() => {
              // Master password for Superadmin
              if ((document.getElementById('sp-pass') as HTMLInputElement).value === 'admin999') {
                setIsLoggedIn(true);
              } else {
                alert("Incorrect password");
              }
            }}
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans p-8">
      <div className="max-w-6xl mx-auto w-full">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Quản lý Khách hàng (Sellers)</h1>
            <p className="text-gray-500 font-medium">Hệ thống Superadmin - Quản trị nền tảng SaaS</p>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="bg-red-50 text-red-600 px-6 py-2 rounded-xl font-bold">Thoát</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Create New Seller */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-black mb-6 border-b pb-4">Tạo Seller Mới</h2>
            <form onSubmit={handleCreateSeller} className="space-y-4">
              <input required placeholder="Username" className="w-full border-2 p-3 rounded-xl text-gray-900" value={newSeller.username} onChange={e => setNewSeller({...newSeller, username: e.target.value})} />
              <input required type="password" placeholder="Password" className="w-full border-2 p-3 rounded-xl text-gray-900" value={newSeller.password} onChange={e => setNewSeller({...newSeller, password: e.target.value})} />
              <input required placeholder="Domain (liemvinfast.onrender.com)" className="w-full border-2 p-3 rounded-xl text-gray-900" value={newSeller.domain} onChange={e => setNewSeller({...newSeller, domain: e.target.value})} />
              <div className="border-t pt-4 space-y-4">
                <input required placeholder="Tên Sale" className="w-full border-2 p-3 rounded-xl text-gray-900" value={newSeller.name} onChange={e => setNewSeller({...newSeller, name: e.target.value})} />
                <input required placeholder="Số điện thoại" className="w-full border-2 p-3 rounded-xl text-gray-900" value={newSeller.phone} onChange={e => setNewSeller({...newSeller, phone: e.target.value})} />
                <input required placeholder="Showroom" className="w-full border-2 p-3 rounded-xl text-gray-900" value={newSeller.showroom} onChange={e => setNewSeller({...newSeller, showroom: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-[#1464f4] text-white p-4 rounded-xl font-black shadow-lg shadow-blue-200">TẠO TÀI KHOẢN & SETUP DATA</button>
            </form>
          </div>

          {/* Sellers List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b">
                  <tr>
                    <th className="p-5">Thông tin Sale</th>
                    <th className="p-5">Tên miền (Domain)</th>
                    <th className="p-5">Trạng thái</th>
                    <th className="p-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-900">
                  {sellers.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5">
                        <div className="font-bold">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.username} | {s.phone}</div>
                      </td>
                      <td className="p-5 font-mono text-xs">{s.domain}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${s.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {s.is_active ? 'ĐANG CHẠY' : 'TẠM KHÓA'}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => toggleSellerStatus(s.id, s.is_active)}
                          className={`text-xs font-bold underline ${s.is_active ? 'text-red-500' : 'text-green-500'}`}
                        >
                          {s.is_active ? 'Khóa' : 'Kích hoạt'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sellers.length === 0 && !loading && (
                    <tr><td colSpan={4} className="p-10 text-center text-gray-400 font-bold">Chưa có người bán nào được tạo.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
