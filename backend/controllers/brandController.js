const Brand = require("../models/brandModel");


// =====================================
// GET ALL BRANDS
// =====================================

exports.getBrands = (req, res) => {

    Brand.getAllBrands((err, rows) => {

        if (err) {

            console.error("Get Brands Error:", err.message);

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


// =====================================
// ADD BRAND
// =====================================

exports.addBrand = (req, res) => {

    const {
        restaurant_id,
        position,
        brand_name,
        short_name,
        item_code,
        category,
        size,
        status
    } = req.body;


    // Required fields

    if (!short_name || !item_code) {

        return res.status(400).json({
            success: false,
            error: "Short Name and Item Code are required."
        });

    }


    const brandData = {

        restaurant_id: restaurant_id || 1,

        position: position || 0,

        brand_name: brand_name || "",

        short_name,

        item_code,

        category: category || "",

        size: size || "",

        status: status || "Active"

    };


    Brand.addBrand(
        brandData,
        function (err) {

            if (err) {

                console.error(
                    "Add Brand Error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    error: err.message
                });

            }


            res.json({

                success: true,

                id: this.lastID,

                message: "Brand added successfully."

            });

        }
    );

};


// =====================================
// UPDATE BRAND
// =====================================

exports.updateBrand = (req, res) => {

    const id = req.params.id;


    if (!id) {

        return res.status(400).json({
            success: false,
            error: "Brand ID is required."
        });

    }


    const {
        restaurant_id,
        position,
        brand_name,
        short_name,
        item_code,
        category,
        size,
        status
    } = req.body;


    if (!short_name || !item_code) {

        return res.status(400).json({
            success: false,
            error: "Short Name and Item Code are required."
        });

    }


    const brandData = {

        restaurant_id: restaurant_id || 1,

        position: position || 0,

        brand_name: brand_name || "",

        short_name,

        item_code,

        category: category || "",

        size: size || "",

        status: status || "Active"

    };


    Brand.updateBrand(
        id,
        brandData,
        function (err) {

            if (err) {

                console.error(
                    "Update Brand Error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    error: err.message
                });

            }


            res.json({

                success: true,

                message: "Brand updated successfully."

            });

        }
    );

};


// =====================================
// DELETE BRAND
// =====================================

exports.deleteBrand = (req, res) => {

    const id = req.params.id;


    if (!id) {

        return res.status(400).json({
            success: false,
            error: "Brand ID is required."
        });

    }


    Brand.deleteBrand(
        id,
        function (err) {

            if (err) {

                console.error(
                    "Delete Brand Error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    error: err.message
                });

            }


            res.json({

                success: true,

                message: "Brand deleted successfully."

            });

        }
    );

};


// =====================================
// IMPORT BRANDS
// =====================================

exports.importBrands = (req, res) => {

    const brands = req.body;


    if (!Array.isArray(brands)) {

        return res.status(400).json({
            success: false,
            error: "Invalid data. Expected an array."
        });

    }


    Brand.importBrands(
        brands,
        (err) => {

            if (err) {

                console.error(
                    "Import Brands Error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    error: err.message
                });

            }


            res.json({

                success: true,

                total: brands.length,

                message: "Brands imported successfully."

            });

        }
    );

};