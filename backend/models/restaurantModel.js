const db = require("../database/database");

// =====================================
// GET ALL RESTAURANTS
// =====================================

exports.getAll = (callback) => {

    db.query(
        `
        SELECT *
        FROM restaurants
        ORDER BY id ASC
        `,
        (err, result) => {

            if (err) {
                return callback(err);
            }

            callback(null, result.rows);
        }
    );

};


// =====================================
// CREATE RESTAURANT
// =====================================

exports.create = (restaurant, callback) => {

    db.query(
        `
        INSERT INTO restaurants
        (
            name,
            owner_name,
            mobile,
            address,
            status
        )

        VALUES
        ($1, $2, $3, $4, $5)

        RETURNING id
        `,
        [
            restaurant.name,
            restaurant.owner_name || "",
            restaurant.mobile || "",
            restaurant.address || "",
            restaurant.status || "Active"
        ],
        (err, result) => {

            if (err) {
                return callback(err);
            }

            // SQLite ke this.lastID ko maintain
            // karne ke liye same format de rahe hain.

            callback.call(
                {
                    lastID: result.rows[0].id
                },
                null
            );

        }
    );

};


// =====================================
// UPDATE RESTAURANT
// =====================================

exports.update = (id, restaurant, callback) => {

    db.query(
        `
        UPDATE restaurants

        SET
            name = $1,
            owner_name = $2,
            mobile = $3,
            address = $4,
            status = $5

        WHERE id = $6
        `,
        [
            restaurant.name,
            restaurant.owner_name || "",
            restaurant.mobile || "",
            restaurant.address || "",
            restaurant.status || "Active",
            id
        ],
        (err, result) => {

            if (err) {
                return callback(err);
            }

            callback(null, result);
        }
    );

};


// =====================================
// DELETE RESTAURANT
// =====================================

exports.delete = (id, callback) => {

    db.query(
        `
        DELETE FROM restaurants
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

};