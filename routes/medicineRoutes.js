const express = require("express");

const router = express.Router();

const {
  getAllMedicine,
  addMedicine,
  getMedicineById,
} = require("../controllers/medicineController");

const isShopOwner = require("../middlewares/isShopOwner");
const authHandler = require("../middlewares/auth");

router.get("/medicines",getAllMedicine)
router.get("/medicines/:id",getMedicineById)
router.post("/medicines", authHandler, isShopOwner, addMedicine)



module.exports = router