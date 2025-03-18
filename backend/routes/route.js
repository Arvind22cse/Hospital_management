const express = require('express');
const { doctorRegister, doctorList, doctorLogin, doctorLogout} = require('../Controller/doctor.control.js')
const { markAttendance, markCheckOut, getDoctorAttendance , getAttendance} = require("../Controller/attendance.control.js");
const { addphc , deletephc, updatePhc, phcList , addDoctorToPHC}= require("../Controller/phc.control.js")
const { addvac, deletevac, updatevac, vacList } = require("../Controller/vacination.control.js")



const router = express.Router()

router.get('/list-phc',phcList);
router.get('/list-doctor', doctorList);
router.get('/list-vac',vacList);


router.post("/doctor-login",doctorLogin)
router.post("/mark-attendance", markAttendance);
router.post("/mark-checkout",  markCheckOut);
router.get("/doctor-attendance", getDoctorAttendance);
router.get("/attendance/:doctorId", getAttendance);
router.get("/doctor-logout", doctorLogout);


router.post('/admin/add-phc',addphc);
router.delete('/admin/dphc/:id',deletephc);
router.put('/admin/uphc/:id',updatePhc);

router.post('/admin/add-vac',addvac);
router.delete('/admin/dvac/:id',deletevac);
router.put('/admin/uvac/:id',updatevac);

router.post('/add-doctor', doctorRegister);  
router.post("/add-doctor-phc", addDoctorToPHC);




module.exports = router;