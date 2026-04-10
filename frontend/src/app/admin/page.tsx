"use client"
import React, { useEffect, useState, useMemo } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { useSeller } from '../SellerContext';

type Tab = 'leads' | 'cars' | 'policies' | 'quote';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('leads');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Leads State
  const [leads, setLeads] = useState<any[]>([]);
  // Cars State
  const [cars, setCars] = useState<any[]>([]);
  const [editingCar, setEditingCar] = useState<any>(null);
  // Policies State
  const [policies, setPolicies] = useState<any[]>([]);
  const [newPolicy, setNewPolicy] = useState({ name: '', type: 'percent', value: 0 });
  const [editingPolicy, setEditingPolicy] = useState<any>(null);

  // Quote Tool State
  const [selectedCarId, setSelectedCarId] = useState<string | number>("");
  const [selectedVersionName, setSelectedVersionName] = useState("");
  const [sellerDiscount, setSellerDiscount] = useState(0);
  const [selectedPolIds, setSelectedPolIds] = useState<number[]>([]);
  const [khuVuc, setKhuVuc] = useState("I");
  const [loaiBienSo, setLoaiBienSo] = useState("Biển trắng");
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [vinClub, setVinClub] = useState("Không có hạng VinClub");
  const [lanBanhRes, setLanBanhRes] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { seller, loading: sellerLoading } = useSeller();

  useEffect(() => {
    if (!isLoggedIn || !seller) return;
    fetchLeads();
    fetchCars();
    fetchPolicies();
  }, [isLoggedIn, seller]);

  useEffect(() => {
    if (!seller) return;
    if (activeTab === 'leads') fetchLeads();
    if (activeTab === 'cars') fetchCars();
    if (activeTab === 'policies') fetchPolicies();
  }, [activeTab, seller]);

  // --- API CALLS ---
  const fetchLeads = async () => {
    if (!seller) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/leads/?seller_id=${seller.id}`);
      const data = await res.json();
      setLeads(data);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const fetchCars = async () => {
    if (!seller) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/cars/?seller_id=${seller.id}`);
      const data = await res.json();
      setCars(data);
      if (data.length > 0 && !selectedCarId) {
        setSelectedCarId(data[0].id);
        setSelectedVersionName(data[0].versions[0]?.name || "");
      }
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const fetchPolicies = async () => {
    if (!seller) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/policies/?seller_id=${seller.id}`);
      const data = await res.json();
      setPolicies(data);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  const handleSaveCar = async (carData: any) => {
    try {
      const method = carData.id ? 'PUT' : 'POST';
      const url = carData.id ? `${API_BASE_URL}/cars/${carData.id}` : `${API_BASE_URL}/cars/`;
      const payload = { ...carData, seller_id: seller?.id };
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setEditingCar(null);
      fetchCars();
    } catch (error) { alert("Lỗi khi lưu xe"); }
  };

  const handleDeleteCar = async (id: number) => {
    if (!confirm("Xóa xe này?")) return;
    await fetch(`${API_BASE_URL}/cars/${id}`, { method: 'DELETE' });
    fetchCars();
  };

  const handleAddPolicy = async () => {
    try {
      const payload = {
        seller_id: seller?.id,
        car_id: null,
        name: newPolicy.name,
        discount_amount: newPolicy.type === 'fixed' ? newPolicy.value : 0,
        voucher_value: newPolicy.type === 'percent' ? newPolicy.value : 0,
        start_date: new Date().toISOString().split('T')[0],
        end_date: "2030-12-31"
      };
      const res = await fetch(`${API_BASE_URL}/policies/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Lỗi thêm chính sách: " + (err?.detail || JSON.stringify(err)));
        return;
      }
      setNewPolicy({ name: '', type: 'percent', value: 0 });
      fetchPolicies();
    } catch (error: any) {
      console.error('Add policy error:', error, 'API_URL:', API_BASE_URL);
      alert("Lỗi kết nối: " + (error?.message || String(error)) + " | URL: " + API_BASE_URL + "/policies/");
    }
  };

  const handleSavePolicy = async () => {
    if (!editingPolicy) return;
    try {
      const payload = {
        seller_id: seller?.id,
        car_id: editingPolicy.car_id || null,
        name: editingPolicy.name,
        discount_amount: editingPolicy.discount_amount ?? 0,
        voucher_value: editingPolicy.voucher_value ?? 0,
        start_date: editingPolicy.start_date || new Date().toISOString().split('T')[0],
        end_date: editingPolicy.end_date || "2030-12-31"
      };
      const res = await fetch(`${API_BASE_URL}/policies/${editingPolicy.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Lỗi lưu chính sách: " + (err?.detail || JSON.stringify(err)));
        return;
      }
      setEditingPolicy(null);
      fetchPolicies();
    } catch (error) { alert("Lỗi kết nối khi lưu chính sách"); }
  };

  const handleDeletePolicy = async (id: number) => {
    await fetch(`${API_BASE_URL}/policies/${id}`, { method: 'DELETE' });
    fetchPolicies();
  };

  const formatPrice = (v: number) => new Intl.NumberFormat('vi-VN').format(v || 0) + ' ₫';

  // --- Quote Calculation Logic ---
  const selectedCar = useMemo(() => cars.find(c => c.id === Number(selectedCarId)), [cars, selectedCarId]);
  const selectedVersion = useMemo(() => selectedCar?.versions.find((v: any) => v.name === selectedVersionName), [selectedCar, selectedVersionName]);

  const basePrice = selectedVersion?.price || 0;
  let promoDiscount = 0;
  selectedPolIds.forEach(id => {
    const p = policies.find(pol => pol.id === id);
    if (p) {
      if (p.voucher_value > 0) promoDiscount += (basePrice * p.voucher_value) / 100;
      else promoDiscount += p.discount_amount;
    }
  });

  const vinClubRates: Record<string, number> = {
    "Không có hạng VinClub": 0,
    "Hạng Gold (Giảm 0.5%)": 0.5,
    "Hạng Platinum (Giảm 1%)": 1,
    "Hạng Diamond (Giảm 1.5%)": 1.5,
  };
  const vinClubDiscount = (basePrice * (vinClubRates[vinClub] || 0)) / 100;
  const finalPriceBeforeFees = basePrice - promoDiscount - sellerDiscount - vinClubDiscount;
  const phiDuongBo = loaiBienSo.includes("vàng") ? 2160000 : 1560000;

  useEffect(() => {
    if (finalPriceBeforeFees <= 0) return;
    const calc = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/calculate/lan-banh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gia_xe: finalPriceBeforeFees, khu_vuc: khuVuc, loai_xe: "Điện" })
        });
        const data = await res.json();
        setLanBanhRes(data);
      } catch (err) { console.error(err); }
    };
    calc();
  }, [finalPriceBeforeFees, khuVuc]);

  const tongLanBanh = finalPriceBeforeFees + (lanBanhRes?.thue_truoc_ba || 0) + (lanBanhRes?.phi_bien_so || 0) + (lanBanhRes?.bao_hiem_tnds || 0) + phiDuongBo + 480000; // +480k dang kiem & dich vu

  const handleDownloadPDF = () => {
    window.print();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a1128] flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-sm">
          <h2 className="text-2xl font-black text-center mb-8 text-[#0a1128]">ADMIN LOGIN</h2>
          <input type="text" id="user" placeholder="Tên đăng nhập" className="w-full border-2 p-4 rounded-xl mb-4 text-center text-gray-900" />
          <input type="password" id="pass" placeholder="Mật khẩu" className="w-full border-2 p-4 rounded-xl mb-4 text-center text-gray-900" />
          <button className="w-full bg-[#1464f4] text-white p-4 rounded-xl font-bold" onClick={async () => {
            const userInput = (document.getElementById('user') as HTMLInputElement).value;
            const passInput = (document.getElementById('pass') as HTMLInputElement).value;

            // Master back-door for Superadmin (optional)
            if (passInput === '1234') {
              setIsLoggedIn(true);
              return;
            }

            try {
              const res = await fetch(`${API_BASE_URL}/sellers/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: userInput, password: passInput })
              });
              if (res.ok) {
                setIsLoggedIn(true);
              } else {
                alert("Thông tin đăng nhập không chính xác.");
              }
            } catch (error) { alert("Lỗi kết nối server."); }
          }}>Đăng nhập</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-[#0a1128] text-white h-20 px-8 flex justify-between items-center shrink-0 no-print">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="w-10 h-10 bg-[#1464f4] text-white flex items-center justify-center font-black text-2xl rounded-lg">V</div>
          <h1 className="text-xl font-black tracking-widest">VINFAST <span className="text-[#1464f4]">ADMIN</span></h1>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="text-sm font-bold text-red-400">Đăng xuất</button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-2 shrink-0 no-print">
          {[
            { id: 'leads', icon: '👤', label: 'Khách hàng (Leads)' },
            { id: 'quote', icon: '📝', label: 'Công cụ Báo giá' },
            { id: 'cars', icon: '🚗', label: 'Xe & Bảng giá' },
            { id: 'policies', icon: '📜', label: 'Chính sách ưu đãi' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-blue-50 text-[#1464f4]' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {/* PRINT HEADER (HIDDEN IN UI) */}
          <div className="print-only quotation-header mb-10 w-full">
            <div className="flex justify-between items-center w-full">
              <div>
                <h1 className="quotation-title">BÁO GIÁ CHI TIẾT</h1>
                <p className="text-gray-500 font-bold">Ngày: {new Date().toLocaleDateString('vi-VN')}</p>
                {(custName || custPhone) && (
                  <p className="text-[#1464f4] font-black mt-2">Kính gửi: {custName} {custPhone ? `- ${custPhone}` : ''}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-black text-xl text-[#1464f4]">{seller?.name || "Phạm Đức Liêm"}</p>
                <p className="text-sm font-bold text-gray-500">{seller?.showroom || "Vinfast Thọ Huyền Duy Tiên"}</p>
                <p className="text-sm font-bold text-gray-500">Sđt: {seller?.phone || "0981 242 068"}</p>
              </div>
            </div>
          </div>

          {activeTab === 'quote' && (
            <section className="animate-in fade-in">
              <div className="flex justify-between items-center mb-8 no-print">
                <h2 className="text-3xl font-black">Công cụ Báo giá Seller</h2>
                <div className="flex gap-3">
                  <button onClick={() => window.print()} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Xem bản in
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-[#1464f4] hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Xuất PDF / In Báo Giá
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs Side (no-print) */}
                <div className="lg:col-span-4 space-y-6 no-print">
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b pb-2">Khách hàng</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Họ tên</label>
                        <input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Tên khách hàng..." className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-100" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Số điện thoại</label>
                        <input type="text" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="09xx..." className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-100" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b pb-2">Thông tin xe</h3>
                    <select value={selectedCarId} onChange={e => { setSelectedCarId(e.target.value); const c = cars.find(car => car.id == e.target.value); if (c) setSelectedVersionName(c.versions[0]?.name || "") }} className="w-full border-2 p-3 rounded-xl mb-3 font-bold text-gray-800">
                      {cars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select value={selectedVersionName} onChange={e => setSelectedVersionName(e.target.value)} className="w-full border-2 p-3 rounded-xl font-bold text-gray-600">
                      {selectedCar?.versions.map((v: any) => <option key={v.name} value={v.name}>{v.name}</option>)}
                    </select>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Chiết khấu riêng của Seller (đ)</label>
                    <input type="number" value={sellerDiscount} onChange={e => setSellerDiscount(Number(e.target.value))} className="w-full border-2 p-3 rounded-xl font-black text-xl text-red-600" />
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">VinClub & Khu vực</label>
                    <select value={vinClub} onChange={e => setVinClub(e.target.value)} className="w-full border-2 p-3 rounded-xl mb-3 font-bold text-blue-600">
                      <option>Không có hạng VinClub</option>
                      <option>Hạng Gold (Giảm 0.5%)</option>
                      <option>Hạng Platinum (Giảm 1%)</option>
                      <option>Hạng Diamond (Giảm 1.5%)</option>
                    </select>
                    <select value={khuVuc} onChange={e => setKhuVuc(e.target.value)} className="w-full border-2 p-3 rounded-xl mb-3"><option value="I">Khu vực I (HN, HCM)</option><option value="II">Khu vực II (Tỉnh)</option></select>
                    <select value={loaiBienSo} onChange={e => setLoaiBienSo(e.target.value)} className="w-full border-2 p-3 rounded-xl"><option>Biển trắng</option><option>Biển vàng</option></select>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Chương trình khuyến mãi</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {policies.map(p => (
                        <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm font-medium">
                          <input type="checkbox" checked={selectedPolIds.includes(p.id)} onChange={e => {
                            if (e.target.checked) setSelectedPolIds([...selectedPolIds, p.id]);
                            else setSelectedPolIds(selectedPolIds.filter(id => id !== p.id));
                          }} />
                          {p.name}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results Side (printable) */}
                <div className="lg:col-span-8 printable-content" id="quotation-print-area">
                  <div className="bg-white p-8 print:p-0 print:border-none print:shadow-none rounded-3xl border border-gray-200 shadow-lg min-h-[600px] print:min-h-0 flex flex-col">
                    {/* QUOTATION HEADER FOR PDF/PRINT ONLY */}
                    <div className="hidden print:flex quotation-header mb-6 w-full justify-between items-center border-b-[3px] border-[#1464f4] pb-4">
                      <div>
                        <h1 className="text-2xl font-black text-[#0a1128]">BÁO GIÁ CHI TIẾT</h1>
                        <p className="text-gray-500 font-bold">Ngày: {new Date().toLocaleDateString('vi-VN')}</p>
                        {(custName || custPhone) && (
                          <p className="text-[#1464f4] font-black mt-2">Kính gửi: {custName} {custPhone ? `- ${custPhone}` : ''}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-[#1464f4]">{seller?.name || "Phạm Đức Liêm"}</p>
                        <p className="text-sm font-bold text-gray-500">{seller?.showroom || "Vinfast Thọ Huyền Duy Tiên"}</p>
                        <p className="text-sm font-bold text-gray-500">Sđt: {seller?.phone || "0981 242 068"}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-start mb-6 print:mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-1">{selectedCar?.name || "Chọn xe..."}</h3>
                        <p className="text-[#1464f4] font-bold text-lg">{selectedVersionName}</p>
                        <span className="bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-500 uppercase">{selectedCar?.segment}</span>
                      </div>
                      <img src={selectedCar?.image_url} alt="xe" className="h-32 print:h-24 object-contain" />
                    </div>

                    <div className="flex-1 space-y-3 print:space-y-2">
                      <div className="flex justify-between pb-2 border-b border-dashed">
                        <span className="text-gray-500 font-medium">Giá niêm yết:</span>
                        <span className="font-bold text-gray-800">{formatPrice(basePrice)}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-dashed">
                        <span className="text-gray-500 font-medium font-bold text-red-500">Giảm giá chương trình:</span>
                        <span className="font-bold text-red-500">-{formatPrice(promoDiscount)}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-dashed">
                        <span className="text-gray-500 font-medium font-bold text-red-650">Chiết khấu Đại Lý:</span>
                        <span className="font-bold text-red-600">-{formatPrice(sellerDiscount)}</span>
                      </div>
                      {vinClubDiscount > 0 && (
                        <div className="flex justify-between pb-3 border-b border-dashed">
                          <span className="text-gray-500 font-medium font-bold text-blue-500">VinClub ({vinClub}):</span>
                          <span className="font-bold text-blue-500">-{formatPrice(vinClubDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-3 print:py-2 bg-blue-50/50 px-4 rounded-xl">
                        <span className="font-black text-[#1464f4]">GIÁ XE SAU GIẢM:</span>
                        <span className="font-black text-[#1464f4] text-xl">{formatPrice(finalPriceBeforeFees)}</span>
                      </div>

                      <div className="pt-4 print:pt-2 space-y-2">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Chi phí lăn bánh dự tính</p>
                        <div className="flex justify-between text-sm"><span>Lệ phí trước bạ (0%):</span><span>{formatPrice(lanBanhRes?.thue_truoc_ba)}</span></div>
                        <div className="flex justify-between text-sm"><span>Phí biển số (Khu vực {khuVuc}):</span><span>{formatPrice(lanBanhRes?.phi_bien_so)}</span></div>
                        <div className="flex justify-between text-sm"><span>Phí đường bộ (1 năm):</span><span>{formatPrice(phiDuongBo)}</span></div>
                        <div className="flex justify-between text-sm"><span>Bảo hiểm TNDS:</span><span>{formatPrice(lanBanhRes?.bao_hiem_tnds)}</span></div>
                        <div className="flex justify-between text-sm"><span>Phí đăng kiểm & dịch vụ:</span><span>{formatPrice(480000)}</span></div>
                      </div>
                    </div>

                    <div className="mt-6 print:mt-4 pt-4 border-t-2 border-[#1464f4] flex justify-between items-end">
                      <span className="text-xl font-black text-gray-900 uppercase">Tổng cộng lăn bánh:</span>
                      <span className="text-3xl font-black text-[#1464f4] whitespace-nowrap">{formatPrice(tongLanBanh)}</span>
                    </div>

                    <p className="mt-8 text-[9px] text-gray-400 italic text-center no-print">* Báo giá mang tính chất tham khảo tại cùng thời điểm.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'leads' && (
            <section className="animate-in fade-in">
              <h2 className="text-3xl font-black mb-8">Danh sách Leads</h2>
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] border-b">
                    <tr><th className="p-5">Khách hàng</th><th className="p-5">SĐT</th><th className="p-5">Sản phẩm</th><th className="p-5">Trạng thái</th></tr>
                  </thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l.id} className="border-b last:border-0">
                        <td className="p-5 font-bold">{l.name}<br /><span className="font-normal text-gray-400 text-xs">{l.address}</span></td>
                        <td className="p-5 font-semibold">{l.phone}</td>
                        <td className="p-5"><span className="bg-blue-50 text-[#1464f4] px-3 py-1 rounded-lg font-bold">{l.interested_car_id}</span></td>
                        <td className="p-5"><span className="text-orange-600 font-bold">{l.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'cars' && (
            <section className="animate-in fade-in">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black">Quản lý Xe & Giá</h2>
                <button onClick={() => setEditingCar({ name: '', model: '', segment: '', image_url: '', versions: [{ name: '', price: 0 }], specs: {} })} className="bg-[#1464f4] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700">＋ Thêm xe mới</button>
              </div>

              {editingCar && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
                  <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-black mb-6">Thông tin xe</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6 text-gray-900">
                      <input placeholder="Tên xe (VD: VF 8)" className="border-2 p-4 rounded-xl w-full" value={editingCar.name} onChange={e => setEditingCar({ ...editingCar, name: e.target.value })} />
                      <input placeholder="Phân khúc" className="border-2 p-4 rounded-xl w-full" value={editingCar.segment} onChange={e => setEditingCar({ ...editingCar, segment: e.target.value })} />
                      <input placeholder="Model ID (VD: VF8)" className="border-2 p-4 rounded-xl w-full" value={editingCar.model} onChange={e => setEditingCar({ ...editingCar, model: e.target.value })} />
                      <input placeholder="Link ảnh xe" className="border-2 p-4 rounded-xl w-full" value={editingCar.image_url} onChange={e => setEditingCar({ ...editingCar, image_url: e.target.value })} />
                    </div>
                    <div className="mb-6">
                      <label className="font-bold mb-2 block">Phiên bản & Giá</label>
                      {editingCar.versions.map((v: any, idx: number) => (
                        <div key={idx} className="flex gap-4 mb-2">
                          <input placeholder="Tên bản" className="border-2 p-3 rounded-xl flex-1 text-gray-900" value={v.name} onChange={e => {
                            const arr = [...editingCar.versions]; arr[idx].name = e.target.value; setEditingCar({ ...editingCar, versions: arr });
                          }} />
                          <input type="number" placeholder="Giá" className="border-2 p-3 rounded-xl w-40 text-gray-900" value={v.price} onChange={e => {
                            const arr = [...editingCar.versions]; arr[idx].price = Number(e.target.value); setEditingCar({ ...editingCar, versions: arr });
                          }} />
                        </div>
                      ))}
                      <button className="text-[#1464f4] font-bold text-sm" onClick={() => setEditingCar({ ...editingCar, versions: [...editingCar.versions, { name: '', price: 0 }] })}>＋ Thêm bản</button>
                    </div>
                    <div className="flex gap-4">
                      <button className="flex-1 bg-gray-100 p-4 rounded-xl font-bold text-gray-700" onClick={() => setEditingCar(null)}>Hủy</button>
                      <button className="flex-1 bg-[#1464f4] text-white p-4 rounded-xl font-bold" onClick={() => handleSaveCar(editingCar)}>Lưu xe</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm group">
                    <div className="h-32 mb-4">
                      <img src={c.image_url} alt="xe" className="h-full w-full object-contain" />
                    </div>
                    <h4 className="font-black text-xl mb-1">{c.name}</h4>
                    <p className="text-gray-400 text-sm mb-4">{c.segment}</p>
                    <div className="space-y-1 mb-6">
                      {c.versions?.map((v: any) => (
                        <div key={v.name} className="flex justify-between text-xs font-bold text-gray-600">
                          <span>{v.name}</span>
                          <span className="text-[#1464f4]">{v.price.toLocaleString('vi-VN')} đ</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingCar(c)} className="flex-1 bg-blue-50 text-blue-600 font-bold py-2 rounded-xl text-sm italic">Sửa</button>
                      <button onClick={() => handleDeleteCar(c.id)} className="flex-1 bg-red-50 text-red-600 font-bold py-2 rounded-xl text-sm italic">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'policies' && (
            <section className="animate-in fade-in max-w-4xl">
              <h2 className="text-3xl font-black mb-8">Quản lý Chính sách</h2>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-10">
                <h3 className="font-black mb-6 uppercase text-gray-400 tracking-widest text-xs">Thêm chính sách mới</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input className="border-2 p-4 rounded-xl col-span-2 text-gray-900" placeholder="Tên chính sách" value={newPolicy.name} onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value })} />
                  <select className="border-2 p-4 rounded-xl text-gray-900 font-bold" value={newPolicy.type} onChange={e => setNewPolicy({ ...newPolicy, type: e.target.value })}>
                    <option value="percent">Giảm theo %</option>
                    <option value="fixed">Giảm tiền mặt (đ)</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <input type="number" className="border-2 p-4 rounded-xl flex-1 text-gray-900 font-black text-xl" value={newPolicy.value} onChange={e => setNewPolicy({ ...newPolicy, value: Number(e.target.value) })} />
                  <button onClick={handleAddPolicy} className="bg-[#1464f4] text-white px-10 py-4 rounded-xl font-bold shadow-lg">Thêm chính sách</button>
                </div>
              </div>
              {/* Edit Policy Modal */}
              {editingPolicy && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                    <h3 className="text-2xl font-black mb-6">Sửa chính sách</h3>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Tên chính sách</label>
                        <input className="w-full border-2 p-4 rounded-xl text-gray-900" value={editingPolicy.name} onChange={e => setEditingPolicy({ ...editingPolicy, name: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Giảm tiền mặt (đ)</label>
                          <input type="number" className="w-full border-2 p-4 rounded-xl text-gray-900" value={editingPolicy.discount_amount ?? 0} onChange={e => setEditingPolicy({ ...editingPolicy, discount_amount: Number(e.target.value), voucher_value: 0 })} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Giảm theo % (nhập số %)</label>
                          <input type="number" className="w-full border-2 p-4 rounded-xl text-gray-900" value={editingPolicy.voucher_value ?? 0} onChange={e => setEditingPolicy({ ...editingPolicy, voucher_value: Number(e.target.value), discount_amount: 0 })} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="flex-1 bg-gray-100 p-4 rounded-xl font-bold text-gray-700" onClick={() => setEditingPolicy(null)}>Hủy</button>
                      <button className="flex-1 bg-[#1464f4] text-white p-4 rounded-xl font-bold" onClick={handleSavePolicy}>Lưu chính sách</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {policies.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-lg mb-2 leading-tight">{p.name}</h4>
                      <p className="text-blue-600 font-black text-xl">{p.discount_amount > 0 ? `${formatPrice(p.discount_amount)}` : `Giảm ${p.voucher_value}%`}</p>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button onClick={() => setEditingPolicy(p)} className="flex-1 text-blue-500 font-bold text-sm text-center bg-blue-50 py-2 rounded-xl hover:underline">Sửa</button>
                      <button onClick={() => handleDeletePolicy(p.id)} className="flex-1 text-red-500 font-bold text-sm text-center bg-red-50 py-2 rounded-xl hover:underline">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
