const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true
  },
  category:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  }
},{timestamps: true})

const Medicine = mongoose.model("Medicine", medicineSchema)

module.exports = Medicine




