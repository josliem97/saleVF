"use client"
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

function EstimatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const carSlug = searchParams.get('car');
  const priceParam = searchParams.get('price');
  const basePrice = priceParam ? Number(priceParam) : 0;
  
  const [car, setCar] = useState<any>(null);
  const [loadingCar, setLoadingCar] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      if (!carSlug) {
        setLoadingCar(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/cars/slug/${carSlug}`);
        if (res.ok) {
          const data = await res.json();
          setCar(data);
        }
      } catch (err) { console.error(err); }
      setLoadingCar(false);
    };
    fetchCar();
  }, [carSlug]);

  const finalPrice = basePrice > 0 ? basePrice : (car?.versions?.[0]?.price || 0);

  // Installment State
  const [soTienVay, setSoTienVay] = useState<number>(0);
  const [kyHanThang, setKyHanThang] = useState<number>(60);
  const [laiCoDinh, setLaiCoDinh] = useState<number>(8.0);
  const [laiThaNoi, setLaiThaNoi] = useState<number>(11.5);
  const [traGopRes, setTraGopRes] = useState<any>(null);
  const [loadingCalc, setLoadingCalc] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");

  const handleDownloadPDF = () => {
    window.print();
  };

  useEffect(() => {
    if (finalPrice > 0 && soTienVay === 0) {
      setSoTienVay(finalPrice * 0.8);
    }
  }, [finalPrice, soTienVay]);

  useEffect(() => {
    const fetchApi = async () => {
      if (finalPrice <= 0) return;
      setLoadingCalc(true);
      try {
        const phanTramVay = (soTienVay / finalPrice) * 100;
        const res = await fetch(`${API_BASE_URL}/calculate/tra-gop`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tong_gia_tri: finalPrice,
            phan_tram_vay: phanTramVay > 100 ? 100 : phanTramVay,
            ky_han_thang: kyHanThang,
            lai_co_dinh_3_nam: laiCoDinh,
            lai_tha_noi: laiThaNoi
          })
        });
        const data = await res.json();
        setTraGopRes(data);
      } catch (err) { console.error(err); }
      setLoadingCalc(false);
    };

    const timer = setTimeout(() => {
      if (soTienVay > 0) fetchApi();
    }, 400);
    return () => clearTimeout(timer);
  }, [soTienVay, kyHanThang, laiCoDinh, laiThaNoi, finalPrice]);

  const tongLaiPhaiTra = useMemo(() => {
    if (!traGopRes?.chi_tiet_lich_tra_no) return 0;
    return traGopRes.chi_tiet_lich_tra_no.reduce((sum: number, item: any) => sum + item.tien_lai, 0);
  }, [traGopRes]);

  const tongGocLai = useMemo(() => {
    if (!traGopRes?.chi_tiet_lich_tra_no) return 0;
    return traGopRes.chi_tiet_lich_tra_no.reduce((sum: number, item: any) => sum + item.tong_tra, 0);
  }, [traGopRes]);

  const formatPrice = (value: number) => new Intl.NumberFormat('vi-VN').format(value || 0) + ' ₫';

  if (loadingCar) return <div className="p-20 text-center font-bold text-gray-500">Đang khởi tạo công cụ...</div>;

  const carName = car?.name || "Xe VinFast";
  const carImage = car?.image_url || "";

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans selection:bg-blue-100">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-[#1464f4] text-white flex items-center justify-center font-black text-2xl rounded-lg">V</div>
            <h1 className="text-2xl font-black tracking-tight text-[#0a1128]">VINFAST</h1>
          </div>
          <nav className="hidden md:flex gap-8 font-semibold text-gray-600">
             <button onClick={() => router.push(`/car/${carSlug}`)} className="text-[#1464f4] hover:underline">Quay lại trang xe</button>
          </nav>
        </div>
      </header>

      <div className="bg-[#0a1128] text-white py-12 px-4 text-center relative overflow-hidden no-print">
        <div className="absolute inset-0 opacity-10 blur-xl">
           {carImage && <img src={carImage} alt="bg" className="w-[120%] -mt-20 object-cover" />}
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 relative z-10 uppercase">BẢNG TÍNH TRẢ GÓP</h2>
        <p className="text-blue-200 text-lg relative z-10">Dư nợ giảm dần áp dụng cho dòng xe <strong>{carName}</strong></p>
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

      <div id="estimate-content" className="printable-content">
        {/* PRINT HEADER */}
        <div className="print-only quotation-header max-w-5xl mx-auto px-8 py-6 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="quotation-title text-2xl font-black">LỊCH TRẢ GÓP CHI TIẾT</h1>
              <p className="text-gray-500 font-bold text-sm">Ngày lập: {new Date().toLocaleDateString('vi-VN')}</p>
              {(custName || custPhone) && (
                <p className="text-[#1464f4] font-black mt-1">Kính gửi: {custName} {custPhone ? `- ${custPhone}` : ''}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-black text-lg text-[#1464f4]">Phạm Đức Liêm</p>
              <p className="text-[10px] font-bold text-gray-500">Vinfast Thọ Huyền Duy Tiên</p>
              <p className="text-[10px] font-bold text-gray-500">Sđt: 0981 242 068</p>
            </div>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="space-y-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="no-print pb-6 border-b border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Thông tin khách hàng</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div><input type="text" value={custName} onChange={e => setCustName(e.target.value)} placeholder="Tên khách hàng" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold" /></div>
                      <div><input type="text" value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="Số điện thoại" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold" /></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                       <label className="block text-sm font-semibold text-gray-700">Giá xe căn cứ vay:</label>
                       <span className="font-bold text-[#1464f4] text-lg">{formatPrice(finalPrice)}</span>
                    </div>
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-gray-700 mb-2">Số tiền vay (VNĐ)</label>
                     <div className="relative">
                        <input type="number" value={soTienVay} onChange={e => setSoTienVay(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-bold text-lg rounded-xl p-4 outline-none focus:border-[#1464f4]" />
                        <span className="absolute right-4 top-4 text-gray-400 font-bold">VNĐ</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Số năm vay</label>
                      <select value={kyHanThang} onChange={e => setKyHanThang(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl">
                        <option value="36">3 năm (36 tháng)</option>
                        <option value="60">5 năm (60 tháng)</option>
                        <option value="96">8 năm (96 tháng)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Chiết khấu lãi</label>
                      <select className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl"><option>Mặc định</option></select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Lãi cố định (%)</label>
                      <input type="number" step="0.1" value={laiCoDinh} onChange={e => setLaiCoDinh(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl font-bold"/>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Lãi thả nổi (%)</label>
                      <input type="number" step="0.1" value={laiThaNoi} onChange={e => setLaiThaNoi(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl font-bold"/>
                    </div>
                 </div>
               </div>

               <div className="bg-[#f2f8fc] rounded-3xl p-8 border border-blue-100 flex flex-col">
                  <h3 className="text-xl font-bold text-[#1a4b82] mb-6 border-b border-blue-200 pb-4">Kết quả dự tính</h3>
                  <div className="space-y-6 flex-1">
                    <div className="flex justify-between items-center bg-white px-5 py-4 rounded-xl shadow-sm text-[#1a4b82]"><span className="font-semibold">Trả trước:</span><span className="font-black text-2xl">{formatPrice(finalPrice - soTienVay)}</span></div>
                    <div className="flex justify-between items-center px-4"><span className="font-semibold text-[#1a4b82]">Gốc đều hàng tháng:</span><span className="font-bold text-gray-800">{formatPrice(soTienVay / kyHanThang)}</span></div>
                    <div className="flex justify-between items-center px-4"><span className="font-semibold text-[#1a4b82]">Tháng đầu (Gốc + Lãi):</span><span className="font-black text-2xl text-red-600">{traGopRes?.chi_tiet_lich_tra_no?.length > 0 ? formatPrice(traGopRes.chi_tiet_lich_tra_no[0].tong_tra) : '0 ₫'}</span></div>
                    <div className="flex justify-between items-center px-4 pt-4 border-t border-blue-200/50"><span className="font-medium text-[#1a4b82]/80">Tổng lãi phải trả:</span><span className="font-bold text-xl text-[#1a4b82]">{formatPrice(tongLaiPhaiTra)}</span></div>
                    <div className="flex justify-between items-center px-4"><span className="font-medium text-[#1a4b82]/80">Tổng thanh toán:</span><span className="font-bold text-xl text-[#1a4b82]">{formatPrice(tongGocLai)}</span></div>
                  </div>
                  <div className="mt-10 text-[11px] text-[#1a4b82]/60 italic text-center">* Dựa trên dư nợ giảm dần tham khảo.</div>
               </div>
            </div>

            {traGopRes?.chi_tiet_lich_tra_no?.length > 0 && (
              <div className="mt-12 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm no-print">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#1a4b82]">Lịch thanh toán chi tiết</h3>
                  <button onClick={() => setShowTable(!showTable)} className="bg-[#1464f4] text-white px-6 py-2 rounded-xl font-bold no-print">{showTable ? "Thu gọn" : "Xem chi tiết"}</button>
                </div>
                {showTable && (
                  <div className="overflow-x-auto rounded-xl border mt-6">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-gray-50 border-b">
                        <tr><th className="p-4">Kỳ</th><th className="p-4">Dư nợ đầu</th><th className="p-4">Lãi</th><th className="p-4">Gốc</th><th className="p-4 font-black">Tổng</th></tr>
                      </thead>
                      <tbody>
                        {traGopRes.chi_tiet_lich_tra_no.map((item: any) => (
                          <tr key={item.thang} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="p-3 font-bold text-gray-500">{item.thang}</td>
                            <td className="p-3">{formatPrice(item.du_no_dau_ky)}</td>
                            <td className="p-3 text-red-600 font-semibold">{formatPrice(item.tien_lai)}</td>
                            <td className="p-3 text-green-700 font-medium">{formatPrice(item.tien_goc)}</td>
                            <td className="p-3 font-black text-[#1a4b82] bg-blue-50/10">{formatPrice(item.tong_tra)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

export default function EstimatePage() {
  return <Suspense fallback={<div className="p-20 text-center">Loading...</div>}><EstimatePageContent /></Suspense>;
}
