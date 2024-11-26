
const express = require("express");

const router = express.Router();
const {saveCase, getCaseByOrganizationId, getSingleCase} = require("../controllers/CaseController.ts");
const limiter = require("../middleware/RateLimiting.ts");
const { protect } = require("../middleware/Protect.ts");

router.route("/organization/:organizationId").get(protect, getCaseByOrganizationId);
router.route("/:caseId").get(protect, getSingleCase);
router.route("/saveCase").post(limiter, saveCase);

module.exports = router;