import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import "./globals.css";
import { SellerProvider } from "./SellerContext";
import HeaderBranding from "@/components/HeaderBranding";
import FloatingContact from "@/components/FloatingContact";

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
        <SellerProvider>
          <HeaderBranding />
          {children}
          <div className="no-print w-full">
            <Footer />
          </div>
          <FloatingContact />
        </SellerProvider>
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
