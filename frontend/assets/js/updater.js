const API_BASE = typeof API_URL !== "undefined" ? API_URL : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:3000/api" : `${window.location.origin}/api`);


// =====================================
// GLOBAL VARIABLES
// =====================================

let currentWorkbook = null;

let selectedDate = null;

let brands = [];

let updateHistory = [];


// =====================================
// PAGE LOAD
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const dateInput =
        document.getElementById("dateInput");

    dateInput.valueAsDate = new Date();

    loadBrands();

});


// =====================================
// LOAD BRANDS FROM DATABASE
// =====================================

async function loadBrands() {

    const brandSelect =
        document.getElementById("brandSelect");


    try {

        brandSelect.innerHTML = `
            <option value="">
                Loading brands...
            </option>
        `;


        const response = await fetch(
            `${API_BASE}/brands`
        );


        const result =
            await response.json();


        console.log(
            "Brands API:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Failed to load brands"
            );

        }


        brands = result.data || [];


        brandSelect.innerHTML = `
            <option value="">
                -- Select Brand --
            </option>
        `;


        if (brands.length === 0) {

            brandSelect.innerHTML = `
                <option value="">
                    No brands available
                </option>
            `;

            return;
        }


        brands.forEach((brand) => {

            const option =
                document.createElement("option");


            option.value = brand.id;


            option.textContent =
                `${brand.position}. ${
                    brand.short_name
                }`;


            option.dataset.itemCode =
                brand.item_code;


            brandSelect.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Load Brands Error:",
            error
        );


        brandSelect.innerHTML = `
            <option value="">
                Failed to load brands
            </option>
        `;


        showError(
            "Could not load brands from database: " +
            error.message
        );

    }

}


// =====================================
// BRAND SELECT CHANGE
// =====================================

document.addEventListener(
    "change",
    (event) => {

        if (
            event.target.id !==
            "brandSelect"
        ) {
            return;
        }


        const brandId =
            event.target.value;


        const itemCodeBox =
            document.getElementById(
                "itemCodeBox"
            );


        const selectedItemCode =
            document.getElementById(
                "selectedItemCode"
            );


        if (!brandId) {

            itemCodeBox.classList.add(
                "d-none"
            );

            selectedItemCode.textContent = "";

            return;
        }


        const brand =
            brands.find(
                b =>
                    String(b.id) ===
                    String(brandId)
            );


        if (!brand) {
            return;
        }


        selectedItemCode.textContent =
            brand.item_code;


        itemCodeBox.classList.remove(
            "d-none"
        );

    }
);


// =====================================
// SAVE UPDATE TO DATABASE HISTORY
// =====================================

async function saveHistoryToDatabase(
    brand,
    oldQty,
    newQty,
    saleDate
) {
    try {

        const response = await fetch(
            `${API_BASE}/history`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    restaurant_id:
                        brand.restaurant_id || 1,

                    brand_id:
                        brand.id,

                    brand_name:
                        brand.brand_name ||
                        brand.short_name,

                    short_name:
                        brand.short_name,

                    item_code:
                        brand.item_code,

                    category:
                        brand.category || "",

                    size:
                        brand.size || "",

                    old_quantity:
                        Number(oldQty) || 0,

                    new_quantity:
                        Number(newQty) || 0,

                    sale_date:
                        saleDate

                })
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                result.message ||
                "Failed to save history"
            );

        }


        console.log(
            "✅ History saved:",
            result
        );


        return true;


    } catch (error) {

        console.error(
            "❌ History Save Error:",
            error
        );

        throw error;

    }
}

// =====================================
// PROCESS EXCEL
// =====================================

function processExcel() {

    const file =
        document.getElementById(
            "fileInput"
        ).files[0];


    const brandId =
        document.getElementById(
            "brandSelect"
        ).value;


    const qty =
        document.getElementById(
            "qtyInput"
        ).value;


    selectedDate =
        document.getElementById(
            "dateInput"
        ).value;


    // =================================
    // VALIDATION
    // =================================

    if (!file) {

        return showError(
            "Please upload the government Excel file."
        );

    }


    if (!brandId) {

        return showError(
            "Please select a brand."
        );

    }


    if (qty === "") {

        return showError(
            "Please enter quantity."
        );

    }


    if (!selectedDate) {

        return showError(
            "Please select date."
        );

    }


    const brand =
        brands.find(
            b =>
                String(b.id) ===
                String(brandId)
        );


    if (!brand) {

        return showError(
            "Selected brand was not found."
        );

    }


    const reader =
        new FileReader();


    reader.onload = (event) => {

        try {

            // =================================
            // LOAD WORKBOOK ONLY ONCE
            // =================================

            if (!currentWorkbook) {

                currentWorkbook =
                    XLSX.read(
                        new Uint8Array(
                            event.target.result
                        ),
                        {
                            type: "array",
                            cellDates: true
                        }
                    );

            }


            const wsName =
                currentWorkbook.SheetNames[0];


            const ws =
                currentWorkbook.Sheets[
                    wsName
                ];


            const rows =
                XLSX.utils.sheet_to_json(
                    ws,
                    {
                        header: 1
                    }
                );


            if (!rows.length) {

                return showError(
                    "Excel file is empty."
                );

            }


            const headers =
                rows[0];


            const idxCode =
                headers.indexOf(
                    "Local Item Code"
                );


            const idxQty =
                headers.indexOf(
                    "Quantity(Loose Bottle)"
                );


            const idxSaleDate =
                headers.indexOf(
                    "Sale Date"
                );


            // =================================
            // CHECK REQUIRED COLUMNS
            // =================================

            if (
                idxCode === -1 ||
                idxQty === -1
            ) {

                return showError(
                    "Required Excel columns were not found. Expected: Local Item Code and Quantity(Loose Bottle)."
                );

            }


            let found = false;


            const jsDate =
                new Date(
                    selectedDate
                );


            // =================================
            // UPDATE ROWS
            // =================================

            for (
                let i = 1;
                i < rows.length;
                i++
            ) {

                // Update sale date

                if (
                    idxSaleDate !== -1
                ) {

                    rows[i][idxSaleDate] =
                        jsDate;

                }


                // Check item code

                const excelCode =
                    String(
                        rows[i][idxCode] ||
                        ""
                    ).trim();


                if (
                    excelCode ===
                    String(
                        brand.item_code
                    ).trim()
                ) {

                    const oldQty =
                        rows[i][idxQty];


                    rows[i][idxQty] =
                        Number(qty);


                    updateHistory.push({

                        row: i,

                        col: idxQty,

                        oldValue: oldQty,

                        brandId: brand.id,

                        brandName:
                            brand.short_name,

                        qty: qty

                    });


                    addLog(
                        brand.short_name,
                        qty,
                        updateHistory.length - 1
                    );


                    found = true;

                }

            }


            // =================================
            // ITEM NOT FOUND
            // =================================

            if (!found) {

                return showError(
                    `Item code "${brand.item_code}" was not found in the Excel file.`
                );

            }


            // =================================
            // SAVE WORKBOOK
            // =================================

            currentWorkbook.Sheets[
                wsName
            ] =
                XLSX.utils.aoa_to_sheet(
                    rows
                );


            document
                .getElementById(
                    "downloadBtn"
                )
                .classList.remove(
                    "d-none"
                );


            showSuccess(
                `${brand.short_name} updated successfully.`
            );


        } catch (error) {

            console.error(
                "Excel Error:",
                error
            );


            showError(
                error.message
            );

        }

    };


    reader.readAsArrayBuffer(
        file
    );

}


// =====================================
// UNDO UPDATE
// =====================================

function deleteUpdate(index) {

    const entry =
        updateHistory[index];


    if (!entry) {
        return;
    }


    if (!currentWorkbook) {
        return;
    }


    const wsName =
        currentWorkbook.SheetNames[0];


    const ws =
        currentWorkbook.Sheets[
            wsName
        ];


    const rows =
        XLSX.utils.sheet_to_json(
            ws,
            {
                header: 1
            }
        );


    rows[entry.row][entry.col] =
        entry.oldValue;


    currentWorkbook.Sheets[
        wsName
    ] =
        XLSX.utils.aoa_to_sheet(
            rows
        );


    const logElement =
        document.getElementById(
            "log-" + index
        );


    if (logElement) {

        logElement.remove();

    }


    updateHistory[index] =
        null;


    showSuccess(
        "Update undone."
    );

}


// =====================================
// ADD UPDATE LOG
// =====================================

function addLog(
    brand,
    qty,
    index
) {

    const log =
        document.getElementById(
            "updateLog"
        );


    // Remove empty message

    const emptyMessage =
        log.querySelector(
            ".text-muted.text-center"
        );


    if (emptyMessage) {
        emptyMessage.remove();
    }


    const div =
        document.createElement(
            "div"
        );


    div.className =
        "alert alert-success d-flex justify-content-between align-items-center mb-2";


    div.id =
        "log-" + index;


    div.innerHTML = `

        <span>
            ✔
            <strong>${escapeHtml(brand)}</strong>
            →
            Qty:
            ${escapeHtml(qty)}
        </span>

        <button
            class="btn btn-sm btn-danger"
            onclick="deleteUpdate(${index})"
        >
            Undo
        </button>

    `;


    log.appendChild(div);

}


// =====================================
// DOWNLOAD EXCEL
// =====================================

function downloadExcel() {

    if (!currentWorkbook) {

        return showError(
            "No updated Excel file available."
        );

    }


    const filename =
        selectedDate
            ? `Stock_${selectedDate}.xlsx`
            : "Updated_Stock.xlsx";


    XLSX.writeFile(
        currentWorkbook,
        filename
    );


    showSuccess(
        "Excel downloaded successfully."
    );

}


// =====================================
// ERROR MESSAGE
// =====================================

function showError(message) {

    const status =
        document.getElementById(
            "status"
        );


    status.className =
        "alert alert-danger";


    status.textContent =
        "❌ " + message;


    status.classList.remove(
        "d-none"
    );

}


// =====================================
// SUCCESS MESSAGE
// =====================================

function showSuccess(message) {

    const status =
        document.getElementById(
            "status"
        );


    status.className =
        "alert alert-success";


    status.textContent =
        "✅ " + message;


    status.classList.remove(
        "d-none"
    );

}


// =====================================
// HTML ESCAPE
// =====================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

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