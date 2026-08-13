const Restaurant = require("../models/restaurantModel");

// Get All Restaurants
exports.getAll = (req, res) => {

    Restaurant.getAll((err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            data: rows
        });

    });

};

// Create Restaurant
exports.create = (req, res) => {

    const { name, owner_name, mobile, address, status } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Restaurant name is required."
        });
    }

    Restaurant.create(
        {
            name,
            owner_name,
            mobile,
            address,
            status
        },
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                id: this.lastID
            });

        }
    );

};

// Update Restaurant
exports.update = (req, res) => {

    Restaurant.update(
        req.params.id,
        req.body,
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                updated: this.changes
            });

        }
    );

};

// Delete Restaurant
exports.delete = (req, res) => {

    Restaurant.delete(
        req.params.id,
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                deleted: this.changes
            });

        }
    );

};