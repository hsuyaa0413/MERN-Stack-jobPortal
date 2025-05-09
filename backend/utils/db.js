const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB)
    console.log("DB connection established successfully!")
  } catch (e) {
    console.log(e)
  }
}

module.exports = connectDB
