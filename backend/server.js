const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Temperature = require("./models/temperature");
const { Parser } = require("json2csv");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL;
// Middleware
app.use(express.json());
app.use(cors());

dotenv.config();
//databse config
connectDB();

// Routes
// TO get data from backend db
app.get("/api/temperatures", async (req, res) => {
  try {
    const temperatures = await Temperature.find()
      .sort({ timestamp: -1 }) // Sort in descending order based on timestamp
      .limit(10); // Limit to the latest 10 records only
    res.json(temperatures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//To post/ add data to db coming from client
app.post("/api/temperatures", async (req, res) => {
  try {
    const { temperature, humidity, windSpeed } = req.body;

    if (!temperature || !humidity || !windSpeed) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTemperature = new Temperature({
      temperature,
      humidity,
      windSpeed,
    });
    await newTemperature.save();

    res.status(201).json({ message: "Data added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
// Route for json to csv

app.get("/api/temperatures/export", async (req, res) => {
  try {
    const temperatures = await Temperature.find().sort({ timestamp: 1 });

    // Create CSV data from the MongoDB documents
    const csvFields = ["timestamp", "temperature", "humidity", "windSpeed"];
    const json2csvParser = new Parser({ fields: csvFields });
    const csvData = json2csvParser.parse(temperatures);

    // Set the response headers to trigger the file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=data.csv");
    res.send(csvData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
