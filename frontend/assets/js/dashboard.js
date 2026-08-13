const API_BASE = typeof API_URL !== "undefined" ? API_URL : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:3000/api" : `${window.location.origin}/api`);

// ===============================
// LOAD DASHBOARD
// ===============================
async function loadDashboard() {

    try {

        // ===============================
        // GET RESTAURANTS
        // ===============================
        const restaurantResponse = await fetch(
            `${API_BASE}/restaurants`
        );

        if (!restaurantResponse.ok) {
            throw new Error(
                `Restaurants API Error: ${restaurantResponse.status}`
            );
        }

        const restaurantResult = await restaurantResponse.json();

        console.log("Restaurants API:", restaurantResult);

        const restaurants = Array.isArray(restaurantResult)
            ? restaurantResult
            : (restaurantResult.data || []);


        // ===============================
        // GET BRANDS
        // ===============================
        const brandResponse = await fetch(
            `${API_BASE}/brands`
        );

        if (!brandResponse.ok) {
            throw new Error(
                `Brands API Error: ${brandResponse.status}`
            );
        }

        const brandResult = await brandResponse.json();

        console.log("Brands API:", brandResult);

        const brands = Array.isArray(brandResult)
            ? brandResult
            : (brandResult.data || []);


        // ===============================
        // UPDATE RESTAURANT COUNT
        // ===============================
        const restaurantCount =
            document.getElementById("restaurantCount");

        if (restaurantCount) {
            restaurantCount.textContent = restaurants.length;
        }


        // ===============================
        // UPDATE BRAND COUNT
        // ===============================
        const brandCount =
            document.getElementById("brandCount");

        if (brandCount) {
            brandCount.textContent = brands.length;
        }


        // ===============================
        // DEBUG
        // ===============================
        console.log(
            "Restaurant Count:",
            restaurants.length
        );

        console.log(
            "Brand Count:",
            brands.length
        );

    } catch (error) {

        console.error(
            "❌ Dashboard Error:",
            error
        );


        // ===============================
        // FALLBACK
        // ===============================
        const restaurantCount =
            document.getElementById("restaurantCount");

        const brandCount =
            document.getElementById("brandCount");


        if (restaurantCount) {
            restaurantCount.textContent = "0";
        }

        if (brandCount) {
            brandCount.textContent = "0";
        }
    }
}


// ===============================
// START DASHBOARD
// ===============================
document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);