  const express = require("express");

  const router = express.Router();

  const {
    login,
    register,
    logout,
    profile,
  } = require("../controllers/authController");

  const authHandler = require('../middlewares/auth');

  router.post("/register", register)
  router.post("/login", login)
  router.get("/logout", logout)
  router.get("/profile", authHandler, profile)

  module.exports = router