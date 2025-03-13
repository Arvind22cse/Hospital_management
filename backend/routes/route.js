const express = require('express');
const { doctorRegister, doctorList, doctorLogin, doctorLogout} = require('../Controller/doctor.control.js')
const { markAttendance, markCheckOut, getDoctorAttendance } = require("../Controller/attendance.control.js");
const {addphc , phcList , addDoctorToPHC}= require("../Controller/phc.control.js")



const router = express.Router()


router.post('/add-doctor', doctorRegister);  
router.get('/list-doctor', doctorList);

router.post("/doctor-login",doctorLogin)
router.post("/mark-attendance", markAttendance);
router.post("/mark-checkout",  markCheckOut);
router.get("/doctor-attendance", getDoctorAttendance);
router.get("/doctor-logout", doctorLogout);



router.post('/add-phc',addphc);
router.get('/list-phc',phcList);

router.post("/add-doctor-phc", addDoctorToPHC);

module.exports = router;