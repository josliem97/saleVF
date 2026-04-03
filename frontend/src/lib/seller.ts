import { API_BASE_URL } from "./api";

export interface Seller {
    id: number;
    username: string;
    domain: string;
    name: string;
    phone: string;
    showroom: string;
    google_ads_id?: string;
    is_active: boolean;
}

export const getCurrentDomain = () => {
    if (typeof window !== "undefined") {
        return window.location.hostname;
    }
    return "";
};

export const fetchSellerByDomain = async (domain: string): Promise<Seller | null> => {
    try {
        const res = await fetch(`${API_BASE_URL}/sellers/by-domain/${domain}`);
        if (res.ok) return await res.json();
    } catch (err) {
        console.error("Error fetching seller:", err);
    }
    return null;
};
