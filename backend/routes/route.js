const express = require('express');
const { doctorRegister, doctorList  } = require('../Controller/doctor.control.js')
const { markAttendance, markCheckOut, getDoctorAttendance } = require("../Controller/attendance.control.js");
const {addphc , phcList , addDoctorToPHC}= require("../Controller/phc.control.js")
const { authenticateDoctor } = require("../middleware/authMiddleware.js")



const router = express.Router()


router.post('/add-doctor', doctorRegister);  
router.get('/list-doctor', doctorList);


router.post("/mark-attendance", authenticateDoctor, markAttendance);
router.post("/mark-checkout", authenticateDoctor, markCheckOut);
router.get("/doctor-attendance", authenticateDoctor, getDoctorAttendance);


router.post('/add-phc',addphc);
router.get('/list-phc',phcList);

router.post("/add-doctor-phc", addDoctorToPHC);

module.exports = router;