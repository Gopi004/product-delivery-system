const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.post("/register/:role", authController.registerUser);
router.post("/login/:role", authController.loginUser);

module.exports = router;
