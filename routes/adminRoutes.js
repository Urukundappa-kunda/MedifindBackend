const express = require("express");

const router = express.Router();

const {
  searchUsers,
  getAllUsers,
  getOneUser,
  promoteUser,
  demoteUser,
  deleteUser,
  approvePharmacy,
  rejectPharmacy,
  getAllPharmacies
} = require("../controllers/adminController");

const authHandler = require('../middlewares/auth')

const isAdmin =  require('../middlewares/isAdmin')

router.get("/users/search",authHandler, isAdmin, searchUsers)
router.get("/users", authHandler, isAdmin, getAllUsers)
router.get("/users/:id",authHandler, isAdmin, getOneUser)
router.patch("/users/:id/promote", authHandler, isAdmin, promoteUser)
router.patch("/users/:id/demote",authHandler,isAdmin,demoteUser)
router.delete("/users/:id",authHandler, isAdmin, deleteUser )
router.get("/pharmacies", authHandler, isAdmin, getAllPharmacies)
router.put("/pharmacies/:id/approve", authHandler, isAdmin, approvePharmacy)
router.put("/pharmacies/:id/reject", authHandler, isAdmin, rejectPharmacy)


module.exports = router