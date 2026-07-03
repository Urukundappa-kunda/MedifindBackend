const User = require('../models/userModel')

const Medicine = require('../models/medicineModel')

const getAllMedicine =  async (req, res, next) => {
  try{
    const medicines = await Medicine.find()
    res.status(200).json({
      success: true,
      data: medicines
    })
  }catch(error){
    next(error)
  }
}

const getMedicineBySearch = async (req, res, next) => {
  try{
    const {name} = req.query;

    if(!name){
      res.status(400).json({
        success: false,
        message: "please enter the medicine name"
      })
    }

    const medicines = await Medicine.find({
      name: {
        $regex:name,
        $options:"i"
      }
    })

    if(medicines.length == 0){
      return res.status(404).json({
        success: true,
        message: "no medicines found"
      })
    }

    res.status(200),json({
      success: true,
      data: medicines
    })
  }catch(error){
    next(error)
  }
}


module.exports = {
  getAllMedicine,
  getMedicineBySearch
}