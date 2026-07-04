const User = require("../models/userModel");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");


const register = async (req, res, next) => {
  try {
    const {name, email, password, role} =  req.body

    const allowedRoles = ["user" , "shopOwner"]
    const assignedRoles = allowedRoles.includes(role) ? role : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRoles
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {

    const {email, password} = req.body

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "invalid credentials",
      });
    }

    const ismatch = await bcrypt.compare(req.body.password, user.password);

    if (!ismatch) {
      return res.status(401).json({
        success: false,
        message: "inavlid credentials",
      });
    }

    if(user.isDeleted === true ){
      return res.status(403).json({
        success: false,
        message: "your account has been deactivated contact the support",
      })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "successfully logged in",
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");


    res.status(200).json({
      success: true,
      message: "you have successfully logged out",
    });
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, profile };
