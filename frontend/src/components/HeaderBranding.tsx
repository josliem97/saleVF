"use client"
import { useSeller } from "@/app/SellerContext";

export default function HeaderBranding() {
    const { seller, loading } = useSeller();

    if (loading) return <div className="h-10 bg-gray-100 animate-pulse"></div>;
    if (!seller) return null;

    return (
        <div className="bg-[#1a4b82] text-white py-2 px-4 text-[13px] md:text-sm font-semibold flex flex-col md:flex-row justify-center items-center gap-1.5 md:gap-6 z-50 relative">
            <span>TVBH: {seller.name}</span>
            <span className="hidden md:inline text-blue-300">|</span>
            <span>Đại lý: {seller.showroom}</span>
            <span className="hidden md:inline text-blue-300">|</span>
            <span className="font-bold flex items-center gap-1 text-yellow-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                {seller.phone}
            </span>
        </div>
    );
}
