"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchSellerByDomain, getCurrentDomain, Seller } from "../lib/seller";

interface SellerContextType {
    seller: Seller | null;
    loading: boolean;
}

const SellerContext = createContext<SellerContextType>({ seller: null, loading: true });

export const SellerProvider = ({ children }: { children: React.ReactNode }) => {
    const [seller, setSeller] = useState<Seller | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initSeller = async () => {
            const domain = getCurrentDomain();
            // Nếu là localhost, có thể map mặc định vào 1 seller để test
            const targetDomain = domain === "localhost" || domain === "127.0.0.1" 
                ? "liemvinfast.onrender.com" 
                : domain;

            const data = await fetchSellerByDomain(targetDomain);
            if (data) {
                setSeller(data);
                localStorage.setItem("seller_id", data.id.toString());
            }
            setLoading(false);
        };
        initSeller();
    }, []);

    return (
        <SellerContext.Provider value={{ seller, loading }}>
            {children}
        </SellerContext.Provider>
    );
};

export const useSeller = () => useContext(SellerContext);
