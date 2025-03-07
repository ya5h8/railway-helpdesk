const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// User registration
router.post("/register", authController.registerUser);

// User login
router.post("/login", authController.loginUser);

// Department login
router.post("/department-login", authController.loginDepartmentUser);

module.exports = router;