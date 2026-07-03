const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`successfully connected to mongodb ${conn.connection.host}`);
  } catch (error) {
    console.log(`connection to mongodb has been failed ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB