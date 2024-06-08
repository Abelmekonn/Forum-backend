const express = require("express");
const router = express.Router();
const {login,register,checker}=require("../controller/userController")

// authorization middleware
const authMiddleware=require('../middleware/authMiddleware')

// Register poster
router.post("/register", register);

// Login
router.post("/login", login);

// Check user
router.get("/check",authMiddleware, checker);

module.exports = router;
