const doctorModel = require("../model/doctor.model.js");
const mongoose = require("mongoose");
const path = require('path');
const fs = require('fs');
const multer = require('multer'); 

// Configure multer for doctor image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doctor-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    // Accept all files with image extensions regardless of mimetype
    const filetypes = /jpeg|jpg|png|webp|gif|bmp|tiff|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    }
    
    cb(new Error(`Invalid file type. Only ${filetypes} are allowed!`));
  }
}).single('doctor_image');
// Modified doctorRegister to handle image upload
const doctorRegister = async (req, res) => {
  try {
    const {
      doctor_name,
      doctor_email,
      password,
      phone,
      specialization,
      phc,
      image,
    } = req.body;

    if (!doctor_email || doctor_email.trim() === "") {
      return res.status(400).json({ error: "Doctor email is required." });
    }

    const existingDoctor = await doctorModel.findOne({ doctor_email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ error: "Doctor with this email already exists." });
    }

    let imagePath = "";

    if (image && image.data) {
      const buffer = Buffer.from(image.data, "base64");
      const filename = `doctor-${Date.now()}.${image.extension}`;
      const uploadDir = path.join(__dirname, "../uploads/");

      // Ensure upload directory exists
      await fs.promises.mkdir(uploadDir, { recursive: true });

      const filepath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filepath, buffer);

      imagePath = `uploads/${filename}`; // For DB storage
    }

    const doctor_detail = new doctorModel({
      doctor_name,
      doctor_email,
      password,
      phone,
      specialization,
      phc,
      doctor_image: imagePath,
    });

    await doctor_detail.save();

    console.log(`${doctor_name} added successfully`);
    res.status(200).json({
      message: `${doctor_name} added successfully`,
      doctor_detail,
    });
  } catch (error) {
    console.error("Error during registration:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        error: "Email already exists. Please use a different email.",
      });
    }

    res.status(500).send("Error adding doctor");
  }
};


//post
// const doctorRegister = async (req, res) => {
//   try {
//     const { doctor_name, doctor_email, password, phone, specialization, phc } = req.body;

//     if (!doctor_email || doctor_email.trim() === "") {
//       return res
//         .status(400)
//         .json({ error: "Doctor email is required and cannot be empty" });
//     }

//     const existingDoctor = await doctorModel.findOne({ doctor_email });

//     if (existingDoctor) {
//       return res
//         .status(400)
//         .json({ error: "Doctor with this email already exists" });
//     }

//     const doctor_detail = new doctorModel({
//       doctor_name,
//       doctor_email,
//       password,
//       phone,
//       specialization,
//       phc,
//     });

//     await doctor_detail.save();
//     console.log(`${doctor_name} added successfully`);
//     res
//       .status(200)
//       .json({ message: `${doctor_name} added successfully`, doctor_detail });
//   } catch (error) {
//     console.log("Error:", error);

//     if (error.code === 11000) {
//       return res
//         .status(400)
//         .json({ error: "Email already exists. Please use a different email." });
//     }

//     res.status(500).send("Error adding doctor");
//   }
// };

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

module.exports = { doctorRegister, doctorList, doctorLogin, doctorLogout , upload };
