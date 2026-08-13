const db = require("../database/database");

// Get All Restaurants
exports.getAll = (callback) => {

    db.all(
        `
        SELECT *
        FROM restaurants
        ORDER BY id ASC
        `,
        [],
        callback
    );

};

// Create Restaurant
exports.create = (restaurant, callback) => {

    db.run(
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
        (?, ?, ?, ?, ?)
        `,
        [
            restaurant.name,
            restaurant.owner_name || "",
            restaurant.mobile || "",
            restaurant.address || "",
            restaurant.status || "Active"
        ],
        callback
    );

};

// Update Restaurant
exports.update = (id, restaurant, callback) => {

    db.run(
        `
        UPDATE restaurants
        SET
            name = ?,
            owner_name = ?,
            mobile = ?,
            address = ?,
            status = ?
        WHERE id = ?
        `,
        [
            restaurant.name,
            restaurant.owner_name || "",
            restaurant.mobile || "",
            restaurant.address || "",
            restaurant.status || "Active",
            id
        ],
        callback
    );

};

// Delete Restaurant
exports.delete = (id, callback) => {

    db.run(
        `
        DELETE FROM restaurants
        WHERE id = ?
        `,
        [id],
        callback
    );

};