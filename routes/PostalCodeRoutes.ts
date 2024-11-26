const express = require("express");

const router = express.Router();
const { checkPostalCodeValid } = require("../controllers/PostalCodeController.ts");

router.get("/:postalCode", checkPostalCodeValid);

module.exports = router;