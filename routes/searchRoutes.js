const express = require('express')

const router = express.Router()

const {getAllMedicine, getMedicineBySearch, searchMedicines} = require('../controllers/searchController')

router.get("/all", getAllMedicine)
router.get("/medicine", searchMedicines)
router.get("/",getMedicineBySearch)

module.exports = router