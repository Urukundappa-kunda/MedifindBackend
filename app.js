const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const connectDB = require("./config/db");
connectDB();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

const authRoutes = require("./routes/authRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const searchRoutes = require("./routes/searchRoutes");
const stockRoutes = require("./routes/stockRoutes");
const adminRoutes = require("./routes/adminRoutes");



app.use("/api/auth", authRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/admin", adminRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);


module.exports = app;
