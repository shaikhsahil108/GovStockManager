const API_BASE = "http://localhost:3000/api";

let restaurants = [];
let deleteRestaurantId = null;


// =====================================
// START
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    loadRestaurants();

});


// =====================================
// LOAD RESTAURANTS
// =====================================

async function loadRestaurants() {

    const table =
        document.getElementById(
            "restaurantTableBody"
        );

    try {

        table.innerHTML = `
            <tr>
                <td colspan="8"
                    class="text-center py-5">
                    Loading restaurants...
                </td>
            </tr>
        `;


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


        restaurants =
            Array.isArray(result)
                ? result
                : (result.data || []);


        renderRestaurants(
            restaurants
        );


        updateStats(
            restaurants
        );


    } catch (error) {

        console.error(
            "Restaurant Load Error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="8"
                    class="text-center py-5 text-danger">

                    ❌ Failed to load restaurants.

                    <br>

                    <small>
                        Make sure backend server is running.
                    </small>

                </td>
            </tr>
        `;

    }

}


// =====================================
// RENDER
// =====================================

function renderRestaurants(
    data
) {

    const table =
        document.getElementById(
            "restaurantTableBody"
        );


    if (!data.length) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="text-center py-5 text-muted"
                >

                    🏪 No restaurants found.

                    <br>

                    <button
                        class="btn btn-primary btn-sm mt-3"
                        onclick="openAddRestaurantModal()"
                    >
                        + Add Restaurant
                    </button>

                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML =
        data.map(
            (restaurant, index) => {

                const status =
                    restaurant.status ||
                    "Active";


                const statusBadge =
                    status.toLowerCase() === "active"
                        ? "success"
                        : "secondary";


                const created =
                    restaurant.created_at
                        ? formatDate(
                            restaurant.created_at
                        )
                        : "-";


                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>


                        <td>

                            <strong>
                                🏪
                                ${escapeHtml(
                                    restaurant.name
                                )}
                            </strong>

                        </td>


                        <td>
                            ${
                                escapeHtml(
                                    restaurant.owner_name || "-"
                                )
                            }
                        </td>


                        <td>

                            ${
                                restaurant.mobile
                                    ? `<a href="tel:${escapeHtml(
                                        restaurant.mobile
                                    )}">
                                        ${escapeHtml(
                                            restaurant.mobile
                                        )}
                                       </a>`
                                    : "-"
                            }

                        </td>


                        <td>

                            <span
                                title="${escapeHtml(
                                    restaurant.address || ""
                                )}"
                            >

                                ${escapeHtml(
                                    restaurant.address || "-"
                                )}

                            </span>

                        </td>


                        <td>

                            <span
                                class="badge bg-${statusBadge}"
                            >
                                ${escapeHtml(status)}
                            </span>

                        </td>


                        <td>
                            ${created}
                        </td>


                        <td class="text-end">

                            <button
                                class="btn btn-sm btn-outline-primary me-1"
                                onclick="editRestaurant(${restaurant.id})"
                                title="Edit"
                            >
                                ✏️
                            </button>


                            <button
                                class="btn btn-sm btn-outline-danger"
                                onclick="openDeleteRestaurantModal(
                                    ${restaurant.id},
                                    '${escapeJs(
                                        restaurant.name
                                    )}'
                                )"
                                title="Delete"
                            >
                                🗑️
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


// =====================================
// UPDATE STATS
// =====================================

function updateStats(
    data
) {

    const total =
        data.length;


    const active =
        data.filter(
            restaurant =>
                (
                    restaurant.status ||
                    "Active"
                ).toLowerCase() ===
                "active"
        ).length;


    const inactive =
        total - active;


    document.getElementById(
        "totalRestaurants"
    ).textContent = total;


    document.getElementById(
        "activeRestaurants"
    ).textContent = active;


    document.getElementById(
        "inactiveRestaurants"
    ).textContent = inactive;


    document.getElementById(
        "restaurantTotalBadge"
    ).textContent =
        `${total} Restaurant${total !== 1 ? "s" : ""}`;

}


// =====================================
// SEARCH
// =====================================

function filterRestaurants() {

    const input =
        document.getElementById(
            "restaurantSearch"
        );


    const search =
        input.value
            .trim()
            .toLowerCase();


    const filtered =
        restaurants.filter(
            restaurant => {

                return [

                    restaurant.name,

                    restaurant.owner_name,

                    restaurant.mobile,

                    restaurant.address,

                    restaurant.status

                ]
                .filter(Boolean)
                .some(
                    value =>
                        String(value)
                            .toLowerCase()
                            .includes(search)
                );

            }
        );


    renderRestaurants(
        filtered
    );

}


// =====================================
// OPEN ADD MODAL
// =====================================

function openAddRestaurantModal() {

    document.getElementById(
        "restaurantForm"
    ).reset();


    document.getElementById(
        "restaurantId"
    ).value = "";


    document.getElementById(
        "restaurantModalTitle"
    ).textContent =
        "Add Restaurant";


    document.getElementById(
        "restaurantStatusInput"
    ).value =
        "Active";


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById(
                "restaurantModal"
            )
        );


    modal.show();

}


// =====================================
// EDIT
// =====================================

function editRestaurant(
    id
) {

    const restaurant =
        restaurants.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!restaurant) {

        showMessage(
            "Restaurant not found.",
            "danger"
        );

        return;

    }


    document.getElementById(
        "restaurantId"
    ).value =
        restaurant.id;


    document.getElementById(
        "restaurantName"
    ).value =
        restaurant.name || "";


    document.getElementById(
        "ownerName"
    ).value =
        restaurant.owner_name || "";


    document.getElementById(
        "restaurantMobile"
    ).value =
        restaurant.mobile || "";


    document.getElementById(
        "restaurantAddress"
    ).value =
        restaurant.address || "";


    document.getElementById(
        "restaurantStatusInput"
    ).value =
        restaurant.status || "Active";


    document.getElementById(
        "restaurantModalTitle"
    ).textContent =
        "Edit Restaurant";


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById(
                "restaurantModal"
            )
        );


    modal.show();

}


// =====================================
// SAVE
// =====================================

async function saveRestaurant() {

    const id =
        document.getElementById(
            "restaurantId"
        ).value;


    const name =
        document.getElementById(
            "restaurantName"
        ).value.trim();


    const owner_name =
        document.getElementById(
            "ownerName"
        ).value.trim();


    const mobile =
        document.getElementById(
            "restaurantMobile"
        ).value.trim();


    const address =
        document.getElementById(
            "restaurantAddress"
        ).value.trim();


    const status =
        document.getElementById(
            "restaurantStatusInput"
        ).value;


    if (!name) {

        showMessage(
            "Restaurant name is required.",
            "warning"
        );

        return;

    }


    const data = {

        name,

        owner_name,

        mobile,

        address,

        status

    };


    try {

        let response;


        if (id) {

            response =
                await fetch(
                    `${API_BASE}/restaurants/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );

        } else {

            response =
                await fetch(
                    `${API_BASE}/restaurants`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );

        }


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                result.message ||
                "Operation failed"
            );

        }


        bootstrap.Modal
            .getInstance(
                document.getElementById(
                    "restaurantModal"
                )
            )
            ?.hide();


        showMessage(
            id
                ? "Restaurant updated successfully."
                : "Restaurant added successfully.",
            "success"
        );


        await loadRestaurants();


    } catch (error) {

        console.error(
            "Save Restaurant Error:",
            error
        );


        showMessage(
            error.message,
            "danger"
        );

    }

}


// =====================================
// OPEN DELETE MODAL
// =====================================

function openDeleteRestaurantModal(
    id,
    name
) {

    deleteRestaurantId =
        id;


    document.getElementById(
        "deleteRestaurantName"
    ).textContent =
        name;


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById(
                "deleteRestaurantModal"
            )
        );


    modal.show();

}


// =====================================
// CONFIRM DELETE
// =====================================

async function confirmDeleteRestaurant() {

    if (!deleteRestaurantId) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/restaurants/${deleteRestaurantId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to delete restaurant"
            );

        }


        bootstrap.Modal
            .getInstance(
                document.getElementById(
                    "deleteRestaurantModal"
                )
            )
            ?.hide();


        deleteRestaurantId =
            null;


        showMessage(
            "Restaurant deleted successfully.",
            "success"
        );


        await loadRestaurants();


    } catch (error) {

        console.error(
            "Delete Restaurant Error:",
            error
        );


        showMessage(
            error.message,
            "danger"
        );

    }

}


// =====================================
// MESSAGE
// =====================================

function showMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "restaurantStatusMessage"
        );


    element.className =
        `alert alert-${type}`;


    element.textContent =
        message;


    element.classList.remove(
        "d-none"
    );


    setTimeout(
        () => {

            element.classList.add(
                "d-none"
            );

        },
        3000
    );

}


// =====================================
// DATE
// =====================================

function formatDate(
    value
) {

    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// =====================================
// HTML ESCAPE
// =====================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


// =====================================
// JS STRING ESCAPE
// =====================================

function escapeJs(
    value
) {

    return String(
        value ?? ""
    )
    .replace(
        /\\/g,
        "\\\\"
    )
    .replace(
        /'/g,
        "\\'"
    )
    .replace(
        /\n/g,
        "\\n"
    )
    .replace(
        /\r/g,
        "\\r"
    );

}