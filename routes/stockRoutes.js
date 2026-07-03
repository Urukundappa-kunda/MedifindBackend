const express = require("express");

const router = express.Router();

const {
  getMyStock,
  updateStock,
  addStock,
} = require("../controllers/stockController");

const isShopOwner = require("../middlewares/isShopOwner");

const authHandler = require("../middlewares/auth");

const isApproved = require("../middlewares/isApproved")

router.post('/stock', authHandler, isShopOwner, isApproved, addStock)

router.put('/stock/:id', authHandler, isShopOwner,isApproved,  updateStock)

router.get('/stock/me', authHandler, isShopOwner,isApproved, getMyStock)

module.exports = router 

