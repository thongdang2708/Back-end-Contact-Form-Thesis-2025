
const express = require("express");

const router = express.Router();
const {existsOrganization} = require("../controllers/OrganizationController.ts");

router.route("/existsOrganization/:id").get(existsOrganization);

module.exports = router;