export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const getSellerId = () => {
    if (typeof window !== "undefined") {
        const s = localStorage.getItem("seller_id");
        return s ? parseInt(s) : null;
    }
    return null;
};
