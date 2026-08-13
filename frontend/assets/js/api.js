// Dynamic API URL Configuration
const getApiUrl = () => {
    // 1. Check for custom API override in localStorage (useful for mobile APK testing)
    const customApi = localStorage.getItem("GOV_STOCK_API_URL");
    if (customApi) return customApi;

    // 2. Local development fallback
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || window.location.protocol === "file:") {
        return "http://localhost:3000/api";
    }

    // 3. Production server URL (If frontend and backend are hosted on same domain or relative path)
    return `${window.location.origin}/api`;
};

const API_URL = getApiUrl();