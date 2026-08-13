const express = require("express");
const router = express.Router();

const controller = require("../controllers/brandController");

router.get("/", controller.getBrands);

router.post("/", controller.addBrand);

router.post("/import", controller.importBrands);

router.put("/:id", controller.updateBrand);

router.delete("/:id", controller.deleteBrand);



module.exports = router;