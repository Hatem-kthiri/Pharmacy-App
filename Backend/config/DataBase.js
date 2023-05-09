require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Connection to Db SUCCESS !!!!");
  } catch (err) {
    console.error("Connection to Db FAIL !!!!", err);
    process.exit(1);
  }
};

module.exports = connectDB;
