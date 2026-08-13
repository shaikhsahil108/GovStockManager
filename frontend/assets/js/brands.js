const API_BASE = typeof API_URL !== "undefined" ? API_URL : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:3000/api" : `${window.location.origin}/api`);

let brands = [];
let editingBrandId = null;
let deletingBrandId = null;

let brandModal;
let deleteModal;


// =====================================
// PAGE LOAD
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    brandModal = new bootstrap.Modal(
        document.getElementById("brandModal")
    );

    deleteModal = new bootstrap.Modal(
        document.getElementById("deleteModal")
    );

    loadBrands();

});


// =====================================
// LOAD BRANDS
// =====================================

async function loadBrands() {

    const tbody = document.getElementById("brandsTableBody");

    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-5">
                Loading brands...
            </td>
        </tr>
    `;

    try {

        const response = await (typeof fetchWithRetry === "function"
            ? fetchWithRetry(`${API_BASE}/brands`)
            : fetch(`${API_BASE}/brands`));

        const result = await response.json();

        console.log("Brands API:", result);

        if (!response.ok) {
            throw new Error(
                result.error || "Failed to load brands"
            );
        }

        brands = result.data || [];

        renderBrands();

    } catch (error) {

        console.error("Load Brands Error:", error);

        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5 text-danger">
                    ❌ Failed to load brands
                    <br>
                    <small>${escapeHtml(error.message)}</small>
                </td>
            </tr>
        `;

        showStatus(
            "Failed to load brands: " + error.message,
            "danger"
        );

    }

}


// =====================================
// RENDER BRANDS
// =====================================

function renderBrands() {

    const tbody =
        document.getElementById("brandsTableBody");

    const total =
        document.getElementById("brandTotal");


    total.textContent =
        `${brands.length} Brand${brands.length !== 1 ? "s" : ""}`;


    if (brands.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5">

                    <div class="fs-1">🏷️</div>

                    <h5>No Brands Found</h5>

                    <p class="text-muted">
                        Add your first brand to get started.
                    </p>

                    <button
                        class="btn btn-primary"
                        onclick="openAddBrandModal()"
                    >
                        + Add Brand
                    </button>

                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML = "";


    brands.forEach((brand) => {

        const tr =
            document.createElement("tr");


        const status =
            brand.status || "Active";


        const statusBadge =
            status === "Active"
                ? `<span class="badge bg-success">Active</span>`
                : `<span class="badge bg-secondary">Inactive</span>`;


        tr.innerHTML = `

            <td>
                <span class="badge bg-primary">
                    ${escapeHtml(brand.position)}
                </span>
            </td>

            <td>
                <strong>
                    ${escapeHtml(brand.brand_name || "-")}
                </strong>
            </td>

            <td>
                <code>
                    ${escapeHtml(brand.short_name)}
                </code>
            </td>

            <td>
                <code>
                    ${escapeHtml(brand.item_code)}
                </code>
            </td>

            <td>
                ${escapeHtml(brand.category || "-")}
            </td>

            <td>
                ${escapeHtml(brand.size || "-")}
            </td>

            <td>
                ${statusBadge}
            </td>

            <td class="text-end">

                <button
                    class="btn btn-sm btn-outline-primary me-1"
                    onclick="openEditBrandModal(${brand.id})"
                    title="Edit"
                >
                    ✏️
                </button>

                <button
                    class="btn btn-sm btn-outline-danger"
                    onclick="openDeleteModal(${brand.id})"
                    title="Delete"
                >
                    🗑️
                </button>

            </td>
        `;


        tbody.appendChild(tr);

    });

}


// =====================================
// OPEN ADD MODAL
// =====================================

function openAddBrandModal() {

    editingBrandId = null;

    document.getElementById(
        "brandModalTitle"
    ).textContent = "Add Brand";


    document.getElementById(
        "brandForm"
    ).reset();


    document.getElementById(
        "brandId"
    ).value = "";


    document.getElementById(
        "brandPosition"
    ).value = brands.length + 1;


    document.getElementById(
        "brandStatusInput"
    ).value = "Active";


    brandModal.show();

}


// =====================================
// OPEN EDIT MODAL
// =====================================

function openEditBrandModal(id) {

    const brand =
        brands.find(
            b => Number(b.id) === Number(id)
        );


    if (!brand) {

        showStatus(
            "Brand not found.",
            "danger"
        );

        return;
    }


    editingBrandId = id;


    document.getElementById(
        "brandModalTitle"
    ).textContent = "Edit Brand";


    document.getElementById(
        "brandId"
    ).value = brand.id;


    document.getElementById(
        "brandPosition"
    ).value = brand.position || "";


    document.getElementById(
        "brandName"
    ).value = brand.brand_name || "";


    document.getElementById(
        "shortName"
    ).value = brand.short_name || "";


    document.getElementById(
        "itemCode"
    ).value = brand.item_code || "";


    document.getElementById(
        "brandCategory"
    ).value = brand.category || "";


    document.getElementById(
        "brandSize"
    ).value = brand.size || "";


    document.getElementById(
        "brandStatusInput"
    ).value = brand.status || "Active";


    brandModal.show();

}


// =====================================
// SAVE BRAND
// =====================================

async function saveBrand() {

    const position =
        document.getElementById(
            "brandPosition"
        ).value.trim();


    const brandName =
        document.getElementById(
            "brandName"
        ).value.trim();


    const shortName =
        document.getElementById(
            "shortName"
        ).value.trim();


    const itemCode =
        document.getElementById(
            "itemCode"
        ).value.trim();


    const category =
        document.getElementById(
            "brandCategory"
        ).value;


    const size =
        document.getElementById(
            "brandSize"
        ).value.trim();


    const status =
        document.getElementById(
            "brandStatusInput"
        ).value;


    // =================================
    // VALIDATION
    // =================================

    if (!position) {

        showStatus(
            "Position is required.",
            "danger"
        );

        return;
    }


    if (!shortName) {

        showStatus(
            "Short Name is required.",
            "danger"
        );

        return;
    }


    if (!itemCode) {

        showStatus(
            "Item Code is required.",
            "danger"
        );

        return;
    }


    const data = {

        restaurant_id: 1,

        position: Number(position),

        brand_name: brandName,

        short_name: shortName,

        item_code: itemCode,

        category: category,

        size: size,

        status: status

    };


    try {

        let response;


        // =================================
        // UPDATE
        // =================================

        if (editingBrandId) {

            response = await fetch(
                `${API_BASE}/brands/${editingBrandId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)
                }
            );

        }

        // =================================
        // ADD
        // =================================

        else {

            response = await fetch(
                `${API_BASE}/brands`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)
                }
            );

        }


        const result =
            await response.json();


        console.log(
            "Save Brand API:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.error ||
                result.message ||
                "Failed to save brand"
            );

        }


        brandModal.hide();


        showStatus(
            editingBrandId
                ? "Brand updated successfully."
                : "Brand added successfully.",
            "success"
        );


        editingBrandId = null;


        await loadBrands();


    } catch (error) {

        console.error(
            "Save Brand Error:",
            error
        );


        showStatus(
            "❌ " + error.message,
            "danger"
        );

    }

}


// =====================================
// OPEN DELETE MODAL
// =====================================

function openDeleteModal(id) {

    const brand =
        brands.find(
            b => Number(b.id) === Number(id)
        );


    if (!brand) {
        return;
    }


    deletingBrandId = id;


    document.getElementById(
        "deleteBrandName"
    ).textContent =
        brand.brand_name ||
        brand.short_name;


    deleteModal.show();

}


// =====================================
// CONFIRM DELETE
// =====================================

async function confirmDeleteBrand() {

    if (!deletingBrandId) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/brands/${deletingBrandId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        console.log(
            "Delete Brand API:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to delete brand"
            );

        }


        deleteModal.hide();


        showStatus(
            "Brand deleted successfully.",
            "success"
        );


        deletingBrandId = null;


        await loadBrands();


    } catch (error) {

        console.error(
            "Delete Brand Error:",
            error
        );


        showStatus(
            "❌ " + error.message,
            "danger"
        );

    }

}


// =====================================
// STATUS MESSAGE
// =====================================

function showStatus(message, type) {

    const status =
        document.getElementById(
            "brandStatus"
        );


    status.className =
        `alert alert-${type}`;


    status.textContent =
        message;


    status.classList.remove(
        "d-none"
    );


    setTimeout(() => {

        status.classList.add(
            "d-none"
        );

    }, 4000);

}


// =====================================
// HTML ESCAPE
// =====================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}