const mongoose = require('mongoose');

const temperatureSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
});

const Temperature = mongoose.model('Temperature', temperatureSchema);

module.exports = Temperature;
