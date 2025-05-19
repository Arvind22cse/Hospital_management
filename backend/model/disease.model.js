const mongoose = require("mongoose");

const DiseaseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  symptoms: { type: [String], required: true },
  severity: {
    type: String,
    enum: ["Mild", "Moderate", "Severe"],
    required: true,
  },
  treatment: { type: String, required: true },
  prevention: { type: String, required: true },
  images: [
    {
      image: { type: String, required: true }, // store image path or URL
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Disease", DiseaseSchema);
