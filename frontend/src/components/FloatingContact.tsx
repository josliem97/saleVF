"use client"
import { useSeller } from "@/app/SellerContext";

export default function FloatingContact() {
    const { seller, loading } = useSeller();

    if (loading || !seller) return null;

    const cleanPhone = seller.phone.replace(/\s/g, '');

    return (
        <div className="fixed bottom-6 left-6 flex flex-col gap-4 z-[100] no-print">
            <a href={`https://zalo.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-600 transition-colors animate-bounce">
                <span className="font-bold text-xs uppercase tracking-widest">Zalo</span>
            </a>
            <a href={`tel:${cleanPhone}`} className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:bg-green-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
            </a>
        </div>
    );
}
