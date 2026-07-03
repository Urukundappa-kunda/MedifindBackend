const Pharmacy = require("../models/pharmacyModel");

const isApproved = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "No pharmacy found for this account",
      });
    }

    if (pharmacy.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your pharmacy is not approved yet",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isApproved;
