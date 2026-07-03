const User = require("../models/userModel");

const jwt = require("jsonwebtoken");

const authHandler = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "please login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "user not found",
      });
    }
    next()
  } catch (error) {
    next(error);
  }
};

module.exports = authHandler;
