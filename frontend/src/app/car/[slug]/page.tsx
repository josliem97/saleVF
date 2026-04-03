"use client"
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LeadForm from "@/components/LeadForm";
import { API_BASE_URL } from "@/lib/api";

export default function CarDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [car, setCar] = useState<any>(null);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estimator States
  const [khuVuc, setKhuVuc] = useState("I");
  const [loaiBienSo, setLoaiBienSo] = useState("Biển trắng (Cá nhân, DN)");
  const [vinClub, setVinClub] = useState("Không có hạng VinClub");
  const [selectedPromos, setSelectedPromos] = useState<number[]>([]); // Using IDs from DB
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  
  const [lanBanhRes, setLanBanhRes] = useState<any>(null);

  const handleDownloadPDF = () => {
    window.print();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        const carRes = await fetch(`${API_BASE_URL}/cars/slug/${slug}`);
        if (carRes.ok) {
          const carData = await carRes.json();
          setCar(carData);
          setSelectedVersion(carData.versions[0]);
        }

        const polRes = await fetch(`${API_BASE_URL}/policies/`);
        if (polRes.ok) {
          const polData = await polRes.json();
          setPolicies(polData);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  // Derived Values
  const price = selectedVersion?.price || 0;
  
  const vinClubRates: Record<string, number> = {
    "Không có hạng VinClub": 0,
    "Hạng Gold (Giảm 1%)": 1,
    "Hạng Platinum (Giảm 2%)": 2,
    "Hạng Diamond (Giảm 3%)": 3,
  };
  const vinClubDiscount = (price * (vinClubRates[vinClub] || 0)) / 100;

  let promoDiscount = 0;
  selectedPromos.forEach(id => {
    const promo = policies.find(p => p.id === id);
    if (promo) {
      if (promo.voucher_value > 0) promoDiscount += (price * promo.voucher_value) / 100; // voucher_value encodes % here
      else promoDiscount += promo.discount_amount;
    }
  });

  const finalDiscountedPrice = price - vinClubDiscount - promoDiscount;
  const phiDuongBoCustom = loaiBienSo.includes("vàng") ? 2160000 : 1560000;

  const handlePromoToggle = (id: number) => {
    if (selectedPromos.includes(id)) {
      setSelectedPromos(selectedPromos.filter(p => p !== id));
    } else {
      setSelectedPromos([...selectedPromos, id]);
    }
  };

  useEffect(() => {
    if (!selectedVersion) return;
    const fetchCalculations = async () => {
      try {
        const resLanBanh = await fetch(`${API_BASE_URL}/calculate/lan-banh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gia_xe: finalDiscountedPrice, khu_vuc: khuVuc, loai_xe: "Điện" })
        });
        const dataLanBanh = await resLanBanh.json();
        setLanBanhRes(dataLanBanh);
      } catch (error) { console.error(error); }
    };
    const timerId = setTimeout(() => fetchCalculations(), 300);
    return () => clearTimeout(timerId);
  }, [selectedVersion, khuVuc, finalDiscountedPrice]);

  const formatPrice = (value: number) => new Intl.NumberFormat('vi-VN').format(value || 0) + ' ₫';

  const thueTruocBa = lanBanhRes?.thue_truoc_ba || 0;
  const phiBienSo = lanBanhRes?.phi_bien_so || 0;
  const baoHiemTNDS = lanBanhRes?.bao_hiem_tnds || 0;
  const phiDangKiem = 340000;
  const phiDichVu = 140000;
  const tongLanBanh = finalDiscountedPrice + thueTruocBa + phiBienSo + phiDuongBoCustom + baoHiemTNDS + phiDangKiem + phiDichVu;

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Đang tải thông tin...</div>;
  if (!car || !selectedVersion) return <div className="p-10 text-center font-bold text-red-500 text-xl">Không tìm thấy thông tin xe.</div>;

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-gray-900 leading-relaxed selection:bg-blue-100">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 bg-opacity-95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-[#1464f4] text-white flex items-center justify-center font-black text-2xl rounded-lg shadow-sm">V</div>
            <h1 className="text-2xl font-black tracking-tight text-[#0a1128]">VINFAST</h1>
          </div>
          <nav className="hidden md:flex gap-8 font-semibold text-gray-600">
            <a href="/" className="hover:text-gray-900 transition-colors">Danh mục Xe</a>
            <a href="/compare" className="hover:text-gray-900 transition-colors">So sánh</a>
          </nav>
        </div>
      </header>

      <div className="bg-gray-50/50 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-64 md:h-96 w-full flex items-center justify-center">
              <img src={car.image_url} alt={car.name} className="object-contain max-h-[110%] drop-shadow-2xl" />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <div className="inline-block bg-[#1464f4]/10 text-[#1464f4] px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-4">
                  {car.segment}
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 tracking-tight">{car.name}</h1>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100/60">
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Chọn phiên bản:</label>
                <select 
                  value={selectedVersion.name}
                  onChange={(e) => {
                    const v = car.versions.find((v: any) => v.name === e.target.value);
                    if (v) setSelectedVersion(v);
                  }}
                  className="w-full border-2 border-gray-100 rounded-xl font-bold bg-gray-50/50 text-gray-800 p-4 outline-none cursor-pointer mb-6"
                >
                  {car.versions.map((v: any) => <option key={v.name} value={v.name}>{v.name}</option>)}
                </select>
                <div>
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">Giá niêm yết (Đã bao gồm VAT & Pin)</p>
                   <p className="text-4xl font-black text-[#1464f4]">{formatPrice(selectedVersion.price)}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 no-print">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Thông tin khách hàng</p>
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Tên khách hàng" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold" />
                      <input type="text" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="Số điện thoại" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold" />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* FLOATING PRINT & PDF BUTTONS */}
      <div className="fixed bottom-32 right-6 z-50 no-print flex flex-col gap-3">
        <button 
          onClick={handleDownloadPDF}
          className="w-14 h-14 bg-[#1464f4] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
          title="Xuất PDF / In Báo Giá"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
        </button>
        <button 
          onClick={() => window.print()}
          className="w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
          title="In Báo Giá"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        </button>
      </div>

      <div id="car-detail-content" className="printable-content">
        {/* PRINT HEADER */}
        <div className="print-only quotation-header max-w-7xl mx-auto px-8 py-6 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="quotation-title text-2xl font-black">BÁO GIÁ XE VINFAST</h1>
              <p className="text-gray-500 font-bold text-sm">Ngày lập: {new Date().toLocaleDateString('vi-VN')}</p>
              {(custName || custPhone) && (
                <p className="text-[#1464f4] font-black mt-1 italic">Kính gửi: {custName} {custPhone ? `- ${custPhone}` : ''}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-black text-lg text-[#1464f4]">Phạm Đức Liêm</p>
              <p className="text-[10px] font-bold text-gray-500">Vinfast Thọ Huyền Duy Tiên</p>
              <p className="text-[10px] font-bold text-gray-500">Sđt: 0981 242 068</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
         <h2 className="text-3xl font-black mb-8 border-l-8 border-[#1464f4] pl-6 text-[#0a1128]">Dự toán giá lăn bánh</h2>
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-7">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Nơi đăng ký</label>
                    <select value={khuVuc} onChange={e => setKhuVuc(e.target.value)} className="w-full bg-white border-2 border-gray-100 text-gray-800 rounded-xl p-4 font-bold outline-none focus:border-[#1464f4] appearance-none">
                      <option value="I">Khu vực I (Hà Nội, TP.HCM)</option>
                      <option value="II">Khu vực II (Tỉnh khác)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Loại biển số</label>
                    <select value={loaiBienSo} onChange={e => setLoaiBienSo(e.target.value)} className="w-full bg-white border-2 border-gray-100 text-gray-800 rounded-xl p-4 font-bold outline-none focus:border-[#1464f4] appearance-none">
                      <option>Biển trắng (Cá nhân, DN)</option>
                      <option>Biển vàng (Kinh doanh)</option>
                    </select>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Hạng thành viên VinClub</label>
                  <select value={vinClub} onChange={e => setVinClub(e.target.value)} className="w-full bg-white border-2 border-gray-100 text-gray-800 rounded-xl p-4 font-bold outline-none focus:border-[#1464f4] appearance-none">
                    <option>Không có hạng VinClub</option>
                    <option>Hạng Gold (Giảm 1%)</option>
                    <option>Hạng Platinum (Giảm 2%)</option>
                    <option>Hạng Diamond (Giảm 3%)</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Chương trình khuyến mãi áp dụng:</label>
                  <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                     {policies.map(p => (
                       <label key={p.id} className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedPromos.includes(p.id) ? 'bg-blue-50 border-[#1464f4]' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                         <input type="checkbox" checked={selectedPromos.includes(p.id)} onChange={() => handlePromoToggle(p.id)} className="w-5 h-5 text-[#1464f4]" />
                         <span className="font-bold text-gray-700 text-sm">{p.name}</span>
                       </label>
                     ))}
                  </div>
               </div>
            </div>

            <div className="lg:col-span-5">
               <div className="bg-[#0a1128] text-white rounded-3xl p-8 shadow-2xl sticky top-28">
                  <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Tóm tắt dự toán</h3>
                  <div className="space-y-4 mb-8">
                     <div className="flex justify-between text-gray-400"><span>Giá niêm yết:</span><span className="text-white">{formatPrice(selectedVersion.price)}</span></div>
                     <div className="flex justify-between font-bold text-xl border-b border-white/10 pb-4"><span className="text-[#1464f4]">Giá xe sau ưu đãi:</span><span className="text-[#1464f4]">{formatPrice(finalDiscountedPrice)}</span></div>
                     <div className="text-sm space-y-3 pt-2 text-gray-300">
                        <div className="flex justify-between"><span>Thuế trước bạ (0%):</span><span>{formatPrice(thueTruocBa)}</span></div>
                        <div className="flex justify-between"><span>Phí biển số (Khu vực {khuVuc}):</span><span>{formatPrice(phiBienSo)}</span></div>
                        <div className="flex justify-between"><span>Phí đường bộ:</span><span>{formatPrice(phiDuongBoCustom)}</span></div>
                        <div className="flex justify-between font-black text-2xl text-white pt-4"><span>TỔNG LĂN BÁNH:</span><span className="text-[#1464f4]">{formatPrice(tongLanBanh)}</span></div>
                     </div>
                  </div>
                  <button onClick={() => router.push(`/estimate?car=${slug}&price=${finalDiscountedPrice}`)} className="w-full bg-[#1464f4] hover:bg-blue-600 text-white font-black py-4 rounded-xl text-lg transition-all shadow-lg shadow-blue-500/20 no-print">
                    XEM LỊCH TRẢ GÓP CHI TIẾT →
                  </button>
               </div>
            </div>
         </div>
         
         <div className="no-print mt-20">
            <div className="bg-gray-100 py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mt-20">
               <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-xl">
                  <h2 className="text-3xl font-black text-center mb-8">Liên hệ tư vấn & Lái thử</h2>
                  <LeadForm defaultCarId={car.slug} />
               </div>
            </div>
         </div>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
      `}</style>
      </div>
    </div>
  );
}
