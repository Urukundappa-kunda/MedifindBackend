const mongoose = require('mongoose')

const pharmacySchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  address:{
    type: String,
    required: true,
    lowercase: true
  },
  location:{
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  phone:{
    type: String,
  },
  licenseno:{
    type: String,
    required: true,
    trim: true,
    match: [/^.{6}$/, "license no must be 6 characters long"],
    unique: true
  },

  openingHours: {
    type: String,
    required: true
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending','approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: null,
  }
},{timestamps: true})

pharmacySchema.index({location: '2dsphere'})

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema)

module.exports = Pharmacy


