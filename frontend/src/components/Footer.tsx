import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-300 py-16 border-t border-gray-800 font-sans relative z-40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Column 1: Info */}
        <div className="space-y-6 text-sm">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-12 bg-[#1464f4] text-white flex items-center justify-center font-black text-3xl rounded-lg">V</div>
             <h2 className="text-4xl font-black tracking-widest text-[#1464f4]">VINFAST</h2>
          </div>
          <div className="space-y-4 text-gray-400">
            <p className="flex gap-2 leading-relaxed">
              <span className="font-bold text-white shrink-0">Địa chỉ:</span> 
              <span>Đại lý Vinfast Thọ Huyền Duy Tiên<br/>Khu Đô Thị Mới Đồng Văn, Phường Đồng Văn, Thị xã Duy Tiên, Tỉnh Hà Nam</span>
            </p>
            <p className="flex gap-2">
              <span className="font-bold text-white shrink-0">Chuyên viên tư vấn:</span> 
              <span className="text-white font-semibold">Phạm Đức Liêm</span>
            </p>
            <p className="flex gap-2 items-center">
              <span className="font-bold text-white shrink-0">Hotline:</span> 
              <span className="text-[#1464f4] font-black text-xl hover:text-blue-400 transition-colors cursor-pointer">
                 <a href="tel:0981242068">0981 242 068</a>
              </span>
            </p>
          </div>
          
          <div className="pt-6 border-t border-gray-800">
            <h3 className="text-white font-bold mb-3 uppercase tracking-widest text-sm relative inline-block after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-1/2 after:h-0.5 after:bg-[#1464f4]">Giờ mở cửa</h3>
            <p className="text-gray-400 mt-3">Từ 08:00 đến 22:00 (Hoạt động cả tuần)</p>
          </div>
        </div>

        {/* Column 2: Products */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/2 after:h-0.5 after:bg-[#1464f4]">Sản phẩm</h3>
          <ul className="grid grid-cols-2 lg:grid-cols-1 gap-y-3 text-sm text-gray-400">
            <li><a href="/car/vf-3" className="hover:text-white hover:translate-x-2 inline-block transition-all">VinFast VF 3</a></li>
            <li><a href="/car/vf-5" className="hover:text-white hover:translate-x-2 inline-block transition-all">VinFast VF 5 Plus</a></li>
            <li><a href="/car/vf-6" className="hover:text-white hover:translate-x-2 inline-block transition-all">VinFast VF 6</a></li>
            <li><a href="/car/vf-7" className="hover:text-white hover:translate-x-2 inline-block transition-all">VinFast VF 7</a></li>
            <li><a href="/car/vf-8" className="hover:text-white hover:translate-x-2 inline-block transition-all">VinFast VF 8</a></li>
            <li><a href="/car/vf-9" className="hover:text-white hover:translate-x-2 inline-block transition-all">VinFast VF 9</a></li>
            <li><a href="/car/vfe34" className="hover:text-white hover:translate-x-2 inline-block transition-all">VinFast VF e34</a></li>
          </ul>
        </div>

        {/* Column 3: Fanpage / Social */}
        <div>
           <h3 className="text-white font-bold text-lg mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/2 after:h-0.5 after:bg-[#1464f4]">Fanpage & Cộng đồng</h3>
           <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 h-44 flex flex-col justify-center relative overflow-hidden group hover:border-[#1464f4]/50 transition-colors">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-[#1464f4]/40 opacity-50 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative z-10">
                <p className="text-white font-black text-lg mb-1 drop-shadow-md">VinFast Thọ Huyền</p>
                <p className="text-gray-300 text-xs mb-4">Cập nhật chính sách mới nhất & Ưu đãi độc quyền</p>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#1464f4] hover:bg-white hover:text-[#1464f4] text-white font-bold px-5 py-2.5 rounded-lg text-sm shadow-lg transition-all text-center">
                  Tham gia Fanpage
                </a>
             </div>
           </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-6 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
        <div>&copy; {new Date().getFullYear()} Showroom VinFast Thọ Huyền Duy Tiên. Thiết kế riêng bởi Phạm Đức Liêm.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
          <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
        </div>
      </div>
    </footer>
  );
}
