const Pharmacy = require("../models/pharmacyModel");

const register = async (req, res, next) => {
  try {
    const exisitingPharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    });

    if (exisitingPharmacy) {
      res.status(400).json({
        success: false,
        message: "pharmacy is already registered",
      });
    }
    const { name, address, location, phone, licenseno, openingHours } =
      req.body;

    const pharmacy = await Pharmacy.create({
      name,
      address,
      location,
      phone,
      licenseno,
      openingHours,
      owner: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "successfull",
    });
  } catch (error) {
    next(error);
  }
};

const getMyPharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "pharmacy not found",
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy,
    });
  } catch (error) {
    next(error);
  }
};

const updatePharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "pharmacy not found",
      });
    }

    Object.assign(pharmacy, req.body);
    await pharmacy.save();

    res.status(200).json({
      success: true,
      message: "pharmacy  updated successfully",
      data: pharmacy,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, getMyPharmacy, updatePharmacy };
