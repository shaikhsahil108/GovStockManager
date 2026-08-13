const API_BASE = typeof API_URL !== "undefined" ? API_URL : (window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:3000/api" : "/api");


// =====================================
// LOAD SETTINGS
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    loadSavedSettings();

    loadRestaurants();

    checkSystemStatus();

});


// =====================================
// LOAD SAVED SETTINGS
// =====================================

function loadSavedSettings() {

    const settings =
        JSON.parse(
            localStorage.getItem("govStockSettings") || "{}"
        );


    if (settings.appName) {

        const appName =
            document.getElementById("appName");

        if (appName) {
            appName.value = settings.appName;
        }

    }


    if (settings.defaultRestaurant) {

        window.savedRestaurant =
            settings.defaultRestaurant;

    }


    const autoDownload =
        document.getElementById("autoDownload");

    if (
        autoDownload &&
        settings.autoDownload !== undefined
    ) {

        autoDownload.checked =
            settings.autoDownload;

    }


    const preserveFormatting =
        document.getElementById(
            "preserveFormatting"
        );

    if (
        preserveFormatting &&
        settings.preserveFormatting !== undefined
    ) {

        preserveFormatting.checked =
            settings.preserveFormatting;

    }


    const confirmUpdate =
        document.getElementById(
            "confirmUpdate"
        );

    if (
        confirmUpdate &&
        settings.confirmUpdate !== undefined
    ) {

        confirmUpdate.checked =
            settings.confirmUpdate;

    }


    const theme =
        document.getElementById("theme");

    if (
        theme &&
        settings.theme
    ) {

        theme.value =
            settings.theme;

    }


    const sidebarMode =
        document.getElementById(
            "sidebarMode"
        );

    if (
        sidebarMode &&
        settings.sidebarMode
    ) {

        sidebarMode.value =
            settings.sidebarMode;

    }

}


// =====================================
// LOAD RESTAURANTS
// =====================================

async function loadRestaurants() {

    const select =
        document.getElementById(
            "defaultRestaurant"
        );


    if (!select) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/restaurants`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load restaurants"
            );

        }


        const result =
            await response.json();


        const restaurants =
            Array.isArray(result)
                ? result
                : (result.data || []);


        select.innerHTML = `
            <option value="">
                Select Default Restaurant
            </option>
        `;


        restaurants.forEach(
            restaurant => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    restaurant.id;


                option.textContent =
                    restaurant.name;


                select.appendChild(
                    option
                );

            }
        );


        // Restore saved restaurant

        if (window.savedRestaurant) {

            select.value =
                window.savedRestaurant;

        }


        updateRestaurantStatus(
            restaurants,
            select.value
        );


        select.addEventListener(
            "change",
            () => {

                updateRestaurantStatus(
                    restaurants,
                    select.value
                );

            }
        );


    } catch (error) {

        console.error(
            "Restaurant Load Error:",
            error
        );


        select.innerHTML = `
            <option value="">
                ❌ Failed to load restaurants
            </option>
        `;


        updateBadge(
            "restaurantStatus",
            "Offline",
            "danger"
        );

    }

}


// =====================================
// RESTAURANT STATUS
// =====================================

function updateRestaurantStatus(
    restaurants,
    selectedId
) {

    const restaurant =
        restaurants.find(
            item =>
                String(item.id) ===
                String(selectedId)
        );


    if (!restaurant) {

        updateBadge(
            "restaurantStatus",
            "Not Selected",
            "secondary"
        );

        return;

    }


    const status =
        restaurant.status ||
        "Active";


    if (
        status.toLowerCase() ===
        "active"
    ) {

        updateBadge(
            "restaurantStatus",
            "Active",
            "success"
        );

    } else {

        updateBadge(
            "restaurantStatus",
            status,
            "warning"
        );

    }

}


// =====================================
// CHECK SYSTEM STATUS
// =====================================

async function checkSystemStatus() {

    updateBadge(
        "apiStatus",
        "Checking...",
        "warning"
    );


    updateBadge(
        "restaurantConnection",
        "Checking...",
        "warning"
    );


    updateBadge(
        "brandConnection",
        "Checking...",
        "warning"
    );


    try {

        // -------------------------------
        // API
        // -------------------------------

        const apiResponse =
            await fetch(
                `${window.location.origin}/health`
            );


        if (!apiResponse.ok) {

            throw new Error(
                "API Offline"
            );

        }


        updateBadge(
            "apiStatus",
            "Online",
            "success"
        );


        // -------------------------------
        // Restaurants
        // -------------------------------

        const restaurantResponse =
            await fetch(
                `${API_BASE}/restaurants`
            );


        if (restaurantResponse.ok) {

            updateBadge(
                "restaurantConnection",
                "Connected",
                "success"
            );

        } else {

            updateBadge(
                "restaurantConnection",
                "Error",
                "danger"
            );

        }


        // -------------------------------
        // Brands
        // -------------------------------

        const brandResponse =
            await fetch(
                `${API_BASE}/brands`
            );


        if (brandResponse.ok) {

            updateBadge(
                "brandConnection",
                "Connected",
                "success"
            );

        } else {

            updateBadge(
                "brandConnection",
                "Error",
                "danger"
            );

        }


    } catch (error) {

        console.error(
            "System Status Error:",
            error
        );


        updateBadge(
            "apiStatus",
            "Offline",
            "danger"
        );


        updateBadge(
            "restaurantConnection",
            "Offline",
            "danger"
        );


        updateBadge(
            "brandConnection",
            "Offline",
            "danger"
        );

    }

}


// =====================================
// SAVE SETTINGS
// =====================================

function saveSettings() {

    const appName =
        document.getElementById(
            "appName"
        )?.value.trim();


    const defaultRestaurant =
        document.getElementById(
            "defaultRestaurant"
        )?.value;


    const autoDownload =
        document.getElementById(
            "autoDownload"
        )?.checked;


    const preserveFormatting =
        document.getElementById(
            "preserveFormatting"
        )?.checked;


    const confirmUpdate =
        document.getElementById(
            "confirmUpdate"
        )?.checked;


    const theme =
        document.getElementById(
            "theme"
        )?.value;


    const sidebarMode =
        document.getElementById(
            "sidebarMode"
        )?.value;


    const settings = {

        appName:
            appName ||
            "Gov Stock Manager",

        defaultRestaurant:
            defaultRestaurant ||
            "",

        autoDownload:
            autoDownload,

        preserveFormatting:
            preserveFormatting,

        confirmUpdate:
            confirmUpdate,

        theme:
            theme,

        sidebarMode:
            sidebarMode

    };


    localStorage.setItem(
        "govStockSettings",
        JSON.stringify(settings)
    );


    applyTheme(
        theme
    );


    showStatus(
        "Settings saved successfully.",
        "success"
    );

}


// =====================================
// RESET SETTINGS
// =====================================

function resetSettings() {

    const confirmed =
        confirm(
            "Reset all application settings to default?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "govStockSettings"
    );


    // Application name

    const appName =
        document.getElementById(
            "appName"
        );

    if (appName) {

        appName.value =
            "Gov Stock Manager";

    }


    // Restaurant

    const restaurant =
        document.getElementById(
            "defaultRestaurant"
        );

    if (restaurant) {

        restaurant.value = "";

    }


    // Excel settings

    const autoDownload =
        document.getElementById(
            "autoDownload"
        );

    if (autoDownload) {

        autoDownload.checked =
            true;

    }


    const preserveFormatting =
        document.getElementById(
            "preserveFormatting"
        );

    if (preserveFormatting) {

        preserveFormatting.checked =
            true;

    }


    const confirmUpdate =
        document.getElementById(
            "confirmUpdate"
        );

    if (confirmUpdate) {

        confirmUpdate.checked =
            true;

    }


    // Appearance

    const theme =
        document.getElementById(
            "theme"
        );

    if (theme) {

        theme.value =
            "light";

    }


    const sidebarMode =
        document.getElementById(
            "sidebarMode"
        );

    if (sidebarMode) {

        sidebarMode.value =
            "expanded";

    }


    applyTheme(
        "light"
    );


    showStatus(
        "Settings reset successfully.",
        "success"
    );

}


// =====================================
// THEME
// =====================================

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    } else {

        document.body.classList.remove(
            "dark-theme"
        );

    }

}


// =====================================
// UPDATE BADGE
// =====================================

function updateBadge(
    elementId,
    text,
    type
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    element.textContent =
        text;


    element.className =
        `badge bg-${type}`;

}


// =====================================
// SHOW STATUS
// =====================================

function showStatus(
    message,
    type
) {

    const status =
        document.getElementById(
            "settingsStatus"
        );


    if (!status) {
        return;
    }


    status.className =
        `alert alert-${type}`;


    status.textContent =
        message;


    status.classList.remove(
        "d-none"
    );


    setTimeout(
        () => {

            status.classList.add(
                "d-none"
            );

        },
        3000
    );

}


// =====================================
// INITIAL THEME
// =====================================

(function initializeTheme() {

    const settings =
        JSON.parse(
            localStorage.getItem(
                "govStockSettings"
            ) || "{}"
        );


    if (settings.theme) {

        applyTheme(
            settings.theme
        );

    }

})();