const db = require("../database/database");

// =====================================
// GET ALL BRANDS
// =====================================

function getAllBrands(callback) {

    db.query(
        `
        SELECT *
        FROM brands
        ORDER BY position ASC, id ASC
        `,
        (err, result) => {

            if (err) {
                return callback(err);
            }

            callback(null, result.rows);
        }
    );

}


// =====================================
// ADD BRAND
// =====================================

function addBrand(data, callback) {

    db.query(
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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)

        RETURNING id
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
        (err, result) => {

            if (err) {
                return callback(err);
            }

            // Controller me this.lastID use ho raha hai
            // isliye SQLite jaisa response maintain kar rahe hain.

            callback.call(
                {
                    lastID: result.rows[0].id
                },
                null
            );

        }
    );

}


// =====================================
// UPDATE BRAND
// =====================================

function updateBrand(id, data, callback) {

    db.query(
        `
        UPDATE brands

        SET
            restaurant_id = $1,
            position = $2,
            brand_name = $3,
            short_name = $4,
            item_code = $5,
            category = $6,
            size = $7,
            status = $8

        WHERE id = $9
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
        (err, result) => {

            if (err) {
                return callback(err);
            }

            callback(null, result);

        }
    );

}


// =====================================
// DELETE BRAND
// =====================================

function deleteBrand(id, callback) {

    db.query(
        `
        DELETE FROM brands
        WHERE id = $1
        `,
        [id],
        (err, result) => {

            if (err) {
                return callback(err);
            }

            callback(null, result);

        }
    );

}


// =====================================
// IMPORT BRANDS
// =====================================

async function importBrands(brands, callback) {

    const client = await db.connect();

    try {

        // =====================================
        // START TRANSACTION
        // =====================================

        await client.query("BEGIN");


        // =====================================
        // DELETE OLD BRANDS
        // =====================================

        await client.query(
            `DELETE FROM brands`
        );


        // =====================================
        // INSERT NEW BRANDS
        // =====================================

        for (let index = 0; index < brands.length; index++) {

            const brand = brands[index];

            await client.query(
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

                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8
                )
                `,
                [
                    brand.restaurant_id || 1,

                    brand.position || (index + 1),

                    brand.brand_name || "",

                    brand.short_name,

                    brand.item_code,

                    brand.category || "",

                    brand.size || "",

                    brand.status || "Active"
                ]
            );

        }


        // =====================================
        // COMMIT
        // =====================================

        await client.query("COMMIT");

        console.log(
            `✅ ${brands.length} brands imported into PostgreSQL`
        );

        callback(null);

    }

    catch (error) {

        // =====================================
        // ROLLBACK
        // =====================================

        try {
            await client.query("ROLLBACK");
        }
        catch (rollbackError) {
            console.error(
                "❌ Rollback error:",
                rollbackError.message
            );
        }

        console.error(
            "❌ Brand import error:",
            error.message
        );

        callback(error);

    }

    finally {

        client.release();

    }

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