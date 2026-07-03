const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true,
  },
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true,
  },
  units: {
    type: Number,
    required: true,
    min: [0, "units cannot be negative"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "price cannot be negative"],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true })

stockSchema.index({ pharmacy: 1, medicine: 1 }, { unique: true });

const Stock = mongoose.model("Stock", stockSchema)

module.exports = Stock