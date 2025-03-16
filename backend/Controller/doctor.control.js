const doctorModel = require("../model/doctor.model.js");
const mongoose = require("mongoose");

//post
const doctorRegister = async (req, res) => {
  try {
    const { doctor_name, doctor_email, password, phone, specialization, phc } = req.body;

    if (!doctor_email || doctor_email.trim() === "") {
      return res
        .status(400)
        .json({ error: "Doctor email is required and cannot be empty" });
    }

    const existingDoctor = await doctorModel.findOne({ doctor_email });

    if (existingDoctor) {
      return res
        .status(400)
        .json({ error: "Doctor with this email already exists" });
    }

    const doctor_detail = new doctorModel({
      doctor_name,
      doctor_email,
      password,
      phone,
      specialization,
      phc,
    });

    await doctor_detail.save();
    console.log(`${doctor_name} added successfully`);
    res
      .status(200)
      .json({ message: `${doctor_name} added successfully`, doctor_detail });
  } catch (error) {
    console.log("Error:", error);

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Email already exists. Please use a different email." });
    }

    res.status(500).send("Error adding doctor");
  }
};

//get
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    res.status(200).json(doctors);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching doctors");
  }
};

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ doctor_email: email });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (password !== doctor.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Store doctor session
    req.session.doctorId = doctor._id; // Save doctor ID in session
    req.session.doctorName = doctor.doctor_name; // Save doctor email in session

    res
      .status(200)
      .json({
        message: "Login successful",
        doctorId: doctor._id,
        doctorName: doctor.doctor_name,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

const doctorLogout = (req, res) => {
  req.session.destroy(); // Destroy session on logout
  res.status(200).json({ message: "Logout successful" });
};

module.exports = { doctorRegister, doctorList, doctorLogin, doctorLogout };
