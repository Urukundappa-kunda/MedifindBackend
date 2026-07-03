const express = require('express')

const router = express.Router()

const {getAllMedicine, getMedicineBySearch, searchMedicines} = require('../controllers/searchController')

router.get("/search/all", getAllMedicine)
router.get("/search/medicine", searchMedicines)
router.get("/search",getMedicineBySearch)

module.exports = router