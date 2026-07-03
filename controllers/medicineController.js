const Medicine = require('../models/medicineModel')

const addMedicine = async (req , res , next) => {
  try{
    const medicine = await Medicine.create(req.body)
    res.status(201).json({
      success: true,
      message: "Medicine is added perfectly"
    })
  }catch(error){
    next(error)
  }
}

const getAllMedicine = async (req , res , next) => {
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

const getMedicineById =  async (req , res , next) => {
  try{
    const medicine =  await Medicine.findById(req.params.id)

    if(!medicine){
      res.status(404).json({
        success: false,
        message: "medicine doesnt exit"
      })
    }

    res.status(200).json({
      success: true,
      data: medicine,
    })
  }catch(error){
    next(error)
  }
}


module.exports = {addMedicine, getAllMedicine, getMedicineById}