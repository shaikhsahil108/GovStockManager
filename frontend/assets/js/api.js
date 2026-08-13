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

// Helper function to handle cloud server spin-up retries (Render Free Tier wakes up in ~20-40s)
async function fetchWithRetry(url, options = {}, retries = 5, delay = 2500) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok || response.status < 500) {
                return response;
            }
            throw new Error(`Server returned status ${response.status}`);
        } catch (err) {
            if (i === retries - 1) throw err;
            console.warn(`[API] Server warming up... Attempt ${i + 1}/${retries}. Retrying in ${delay}ms...`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
}