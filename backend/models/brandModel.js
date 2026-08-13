const db = require("../database/database");


// =====================================
// GET ALL BRANDS
// =====================================

function getAllBrands(callback) {

    db.all(
        `
        SELECT *
        FROM brands
        ORDER BY position ASC, id ASC
        `,
        [],
        callback
    );

}


// =====================================
// ADD BRAND
// =====================================

function addBrand(data, callback) {

    db.run(
        `
        INSERT INTO brands
        (
            restaurant_id,
            position,
            brand_name,
            short_name,
            item_code,
            category,
            size,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            data.restaurant_id || 1,
            data.position || 0,
            data.brand_name || "",
            data.short_name,
            data.item_code,
            data.category || "",
            data.size || "",
            data.status || "Active"
        ],
        callback
    );

}


// =====================================
// UPDATE BRAND
// =====================================

function updateBrand(id, data, callback) {

    db.run(
        `
        UPDATE brands

        SET
            restaurant_id = ?,
            position = ?,
            brand_name = ?,
            short_name = ?,
            item_code = ?,
            category = ?,
            size = ?,
            status = ?

        WHERE id = ?
        `,
        [
            data.restaurant_id || 1,
            data.position || 0,
            data.brand_name || "",
            data.short_name,
            data.item_code,
            data.category || "",
            data.size || "",
            data.status || "Active",
            id
        ],
        callback
    );

}


// =====================================
// DELETE BRAND
// =====================================

function deleteBrand(id, callback) {

    db.run(
        `
        DELETE FROM brands
        WHERE id = ?
        `,
        [id],
        callback
    );

}


// =====================================
// IMPORT BRANDS
// =====================================

function importBrands(brands, callback) {

    db.serialize(() => {

        const deleteQuery = `
            DELETE FROM brands
        `;

        db.run(
            deleteQuery,
            (deleteErr) => {

                if (deleteErr) {
                    return callback(deleteErr);
                }


                const stmt = db.prepare(
                    `
                    INSERT INTO brands
                    (
                        restaurant_id,
                        position,
                        brand_name,
                        short_name,
                        item_code,
                        category,
                        size,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `
                );


                let hasError = null;


                brands.forEach((brand, index) => {

                    stmt.run(
                        brand.restaurant_id || 1,
                        brand.position || (index + 1),
                        brand.brand_name || "",
                        brand.short_name,
                        brand.item_code,
                        brand.category || "",
                        brand.size || "",
                        brand.status || "Active",
                        (err) => {

                            if (err && !hasError) {
                                hasError = err;
                            }

                        }
                    );

                });


                stmt.finalize((err) => {

                    if (err) {
                        return callback(err);
                    }

                    if (hasError) {
                        return callback(hasError);
                    }

                    callback(null);

                });

            }
        );

    });

}


// =====================================
// EXPORT
// =====================================

module.exports = {

    getAllBrands,

    addBrand,

    updateBrand,

    deleteBrand,

    importBrands

};