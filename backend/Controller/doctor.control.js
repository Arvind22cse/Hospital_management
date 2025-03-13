const { response } = require("express");
const doctorModel = require("../model/doctor.model.js");


//post
const doctorRegister = async (req, res) => {
  try {
    const {
      doctor_name,
      doctor_email,
      password,
      phone,
      specialization,
      phc,
    } = req.body;

    var doctor_detail = new doctorModel({
      doctor_name,
      doctor_email,
      password,
      phone,
      specialization,
      phc,
    });

    await doctor_detail.save();
    console.log(`${doctor_name}} added successfully`);
    res
      .status(200)
      .json({ message: `${doctor_name} added successfully`,doctor_detail });
  } catch (error) {
    console.log(error);
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

module.exports = { doctorRegister , doctorList  };
