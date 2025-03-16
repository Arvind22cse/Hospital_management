const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema({
  vaccine_name: { type: String, required: true },
  required_age: { type: Number, required: true },
  location: { type: String, required: true },
  from_date: { type: String, required: true },
  last_date: { type: String, required: true },
  description: { type: String, required: true },
});

const vaccinationModel = mongoose.model("Vaccination", vaccinationSchema);

module.exports = vaccinationModel;
