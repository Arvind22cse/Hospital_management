const { response } = require("express");
const phcModel = require("../model/phc.model.js");
const doctorModel = require("../model/doctor.model.js");

//post - admin
const addphc = async (req, res) => {
  try {
    const {
      name,
      location,
      type,
      services,
      doctors,
      contact_info,
      facilities,
      alerts,
      additional_services,
      basic_services,
    } = req.body;

    var phc_detail = new phcModel({
      name,
      location,
      type,
      services,
      doctors,
      contact_info,
      facilities,
      alerts,
      additional_services,
      basic_services,
    });

    await phc_detail.save();
    console.log(`${name} added successfully`);
    res.status(200).json({ message: `${name} added successfully`, phc_detail });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding phc");
  }
};

//get - general
const phcList = async (req, res) => {
  try {
    const phc = await phcModel.find();
    res.status(200).json(phc);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching phc");
  }
};

// Add Doctor to a PHC using name
const addDoctorToPHC = async (req, res) => {
  try {
    const { doctor_name, doctor_email, name } = req.body;

    const phc = await phcModel.findOne({ name: name });
    if (!phc) {
      return res.status(404).json({ message: "PHC not found" });
    }

    const doctor = await doctorModel.findOne({
      doctor_name: doctor_name,
      doctor_email: doctor_email,
    });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.phc = phc._id;
    await doctor.save();

    if (!phc.doctors.includes(doctor._id)) {
      phc.doctors.push(doctor._id);
      await phc.save();
    }

    res
      .status(200)
      .json({ message: `Doctor ${doctor_name} added to PHC ${name}`, phc });
  } catch (error) {
    res.status(500).json({ message: "Error adding doctor to PHC", error });
  }
};

module.exports = { addphc, phcList, addDoctorToPHC };
