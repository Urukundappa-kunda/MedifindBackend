const User = require("../models/userModel");

const Pharmacy = require("../models/pharmacyModel");

const searchUsers = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "plase provide the user name",
      });
    }

    const users = await User.find({
      name: { $regex: name, $options: "i" },
      isDeleted: false,
    });

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "no users found",
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    let filter = { isDeleted: false };

    if (req.query.includeDeleted === "true") {
      filter = {};
    }

    const users = await User.find(filter).sort({createdAt: -1});

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getOneUser = async (req, res, next) => {
  try {
    const user = await User.findById({_id: req.params.id, isDeleted: false});

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const promoteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    if (user.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "the account is deactivated please contact the help support",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "user is already an admin",
      });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({
      success: true,
      message: "user promoted to the admin",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const demoteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "The account is deleted please contact to the support",
      });
    }

    if (user.role === "user") {
      return res.status(400).json({
        success: false,
        message: "User is already not an admin",
      });
    }

    if (user._id.equals(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot demote your own account",
      });
    }

    user.role = "user";
    await user.save();

    res.status(200).json({
      success: true,
      message: "User demoted successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not exists",
      });
    }

    if (user._id.equals(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "u cannot delete your own account",
      });
    }

    user.isDeleted = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const approvePharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    if(pharmacy.status === "approved"){
      return res.status(400).json({
        success: false,
        message: " pharmacy is already approved"
      })
    }

    pharmacy.status = "approved";
    pharmacy.rejectionReason = null,

    await pharmacy.save();

    res.status(200).json({
      success: true,
      message: "successfully registerd the pharmacy",
    });
  } catch (error) {
    next(error);
  }
};

const rejectPharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

      if(pharmacy.status === "rejected"){
      res.status(400).json({
        success: false,
        message: " pharmacy is already rejected"
      })
    }

    const owner = await User.findById(pharmacy.owner)

    if(!owner){
      res.status(404).json({
        success: false,
        message: "owner not found"
      })
    }

    pharmacy.status = "rejected";
    pharmacy.rejectionReason = reason

    await pharmacy.save();

    res.status(200).json({
      success: true,
      message: "sorry we cant register your pharmacy",
    });
  } catch (error) {
    next(error);
  }
};

const getAllPharmacies = async( req, res,  next) =>{
  try{

    const {status} = req.query

    const filter = status? {status} : {};

    const pharmacies = await Pharmacy.find(filter).populate('owner', 'name email')
    res.status(200).json({
      success: true,
      data: pharmacies
    })
  }catch(error){
    next(error)
  }
}

module.exports = {
  searchUsers,
  getAllUsers,
  getOneUser,
  promoteUser,
  demoteUser,
  deleteUser,
  approvePharmacy,
  rejectPharmacy,
  getAllPharmacies
};
