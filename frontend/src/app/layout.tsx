import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin", "vietnamese"], 
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Báo Giá VinFast",
  description: "Hệ thống Báo Giá & Dự Toán chi phí chuyên nghiệp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 text-gray-900`}>
        {/* Global Sale Info Header */}
        <div className="bg-[#1a4b82] text-white py-2 px-4 text-[13px] md:text-sm font-semibold flex flex-col md:flex-row justify-center items-center gap-1.5 md:gap-6 z-50 relative">
          <span>TVBH: Phạm Đức Liêm</span>
          <span className="hidden md:inline text-blue-300">|</span>
          <span>Đại lý: Vinfast Thọ Huyền Duy Tiên</span>
          <span className="hidden md:inline text-blue-300">|</span>
          <span className="font-bold flex items-center gap-1 text-yellow-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
            0981 242 068
          </span>
        </div>
        {children}
        <div className="no-print w-full">
           <Footer />
        </div>

        <div className="fixed bottom-6 left-6 flex flex-col gap-4 z-[100] no-print">
          <a href="https://zalo.me/0981242068" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-600 transition-colors animate-bounce">
            <span className="font-bold text-xs uppercase tracking-widest">Zalo</span>
          </a>
          <a href="tel:0981242068" className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:bg-green-600 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
          </a>
        </div>
        <style>{`
          @media print {
            @page { size: a4; margin: 10mm; }
            html, body { height: auto; background: white !important; }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            
            /* Print Isolation */
            body * { visibility: hidden; }
            .printable-content, .printable-content * { visibility: visible; }
            .printable-content { 
              position: absolute; 
              left: 0; 
              top: 0; 
              width: 100%; 
              visibility: visible !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            .printable-content img { max-height: 150px; object-contain: contain; }

            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
        `}</style>
      </body>
    </html>
  );
}
