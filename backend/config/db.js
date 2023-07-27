const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    //console.log(`Conneted To Mongodb Databse `);
  } catch (error) {
    //console.log(`Error in Mongodb`);
  }
};

//export default connectDB;
module.exports = connectDB;
