const express = require("express");

const router = express.Router();

const {
  getAllMedicine,
  addMedicine,
  getMedicineById,
} = require("../controllers/medicineController");

const isShopOwner = require("../middlewares/isShopOwner");
const authHandler = require("../middlewares/auth");

router.get("/",getAllMedicine)
router.get("/search",getMedicineById)
router.post("/", authHandler, isShopOwner, addMedicine)



module.exports = router