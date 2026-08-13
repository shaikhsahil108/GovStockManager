// =====================================
// DYNAMIC API URL - AUTO DETECT
// =====================================

const getApiUrl = () => {

    // 1. Custom override via localStorage
    const customApi = localStorage.getItem("GOV_STOCK_API_URL");
    if (customApi) return customApi.replace(/\/$/, "");

    // 2. Running as local file (file://)
    if (window.location.protocol === "file:") {
        return "http://localhost:3000/api";
    }

    // 3. Frontend running on localhost but NOT backend port 3000
    if (
        (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1") &&
        window.location.port !== "3000"
    ) {
        return "http://localhost:3000/api";
    }

    // 4. Backend serving frontend / production
    // Use same host with /api
    return "/api";
};

const API_URL = getApiUrl();


// =====================================
// FETCH WITH RETRY
// Handles slow server / Render cold starts
// =====================================

async function fetchWithRetry(
    url,
    options = {},
    retries = 3,
    delay = 3000
) {
    for (let i = 0; i < retries; i++) {

        try {
            const response = await fetch(url, options);

            // Success OR client error (4xx)
            // Don't retry 4xx errors
            if (
                response.ok ||
                (response.status >= 400 && response.status < 500)
            ) {
                return response;
            }

            // Retry server errors (5xx)
            throw new Error(
                `Server returned status ${response.status}`
            );

        } catch (err) {

            if (i === retries - 1) {
                throw err;
            }

            console.warn(
                `[API] Retrying... Attempt ${i + 1}/${retries} in ${delay}ms`
            );

            await new Promise(resolve =>
                setTimeout(resolve, delay)
            );
        }
    }
}