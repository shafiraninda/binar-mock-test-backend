const express = require("express");
const ROUTER = express.Router();
const userController = require("../seeders/userController");

ROUTER.post('/signup', userController.signup)
ROUTER.post("/login", userController.login)

module.exports = ROUTER;
