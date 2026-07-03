const express = require("express");

const router = express.Router();

const {
  register,
  getMyPharmacy,
  updatePharmacy,
} = require("../controllers/pharamcyController");

const isShopOwner = require("../middlewares/isShopOwner")

const authHandler = require('../middlewares/auth')

router.post("/pharmacy", authHandler, isShopOwner, register)
router.get("/pharmacy/me",authHandler, isShopOwner, getMyPharmacy)
router.put("/pharmacy/me", authHandler, isShopOwner, updatePharmacy)

module.exports = router