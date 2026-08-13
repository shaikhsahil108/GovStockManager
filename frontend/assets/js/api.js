// =====================================
// DYNAMIC API URL - AUTO DETECT
// =====================================

const getApiUrl = () => {

    // 1. Custom override via localStorage
    const customApi = localStorage.getItem("GOV_STOCK_API_URL");
    if (customApi) return customApi;

    // 2. If running as a local file (file:// protocol), use localhost
    if (window.location.protocol === "file:") {
        return "http://localhost:3000/api";
    }

    // 3. If explicitly on localhost port that is NOT 3000 (e.g. live-server, VS Code, etc.)
    //    Point directly to local backend
    if (
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") &&
        window.location.port !== "3000"
    ) {
        return "http://localhost:3000/api";
    }

    // 4. Production / Render / Any cloud host:
    //    Use RELATIVE path - browser will call same server that served this page
    return "/api";
};

const API_URL = getApiUrl();

// =====================================
// FETCH WITH RETRY (handles slow cold starts)
// =====================================

async function fetchWithRetry(url, options = {}, retries = 3, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            // Don't retry on client errors (4xx), only server errors (5xx)
            if (response.ok || (response.status >= 400 && response.status < 500)) {
                return response;
            }
            throw new Error(`Server returned status ${response.status}`);
        } catch (err) {
            if (i === retries - 1) throw err;
            console.warn(`[API] Retrying... Attempt ${i + 1}/${retries} in ${delay}ms`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
}