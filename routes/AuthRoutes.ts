
const express = require("express");

const {register, login, getNewTokenFromRefreshToken, getMe} = require("../controllers/AuthController.ts");
const {protect} = require("../middleware/Protect.ts");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getNewTokenFromRefreshToken").post(getNewTokenFromRefreshToken);
router.route("/me").post(protect, getMe);

module.exports = router;