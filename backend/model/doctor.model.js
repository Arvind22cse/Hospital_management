const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  doctor_name: {
    type: String,
    required: true,
  },
  doctor_email: {
    type: String,
    required: true,
    unique: true,  
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  phc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PHC",
  },
});


const doctorModel = mongoose.model("Doctor", doctorSchema);

module.exports = doctorModel;
