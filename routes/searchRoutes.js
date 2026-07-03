const express = require('express')

const router = express.Router()

const {getAllMedicine, getMedicineBySearch} = require('../controllers/searchController')

router.get("/search/all", getAllMedicine)
router.get("/search",getMedicineBySearch)

module.exports = router