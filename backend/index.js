// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());

// mongoose.connect(process.env.MONGO_URL).then((result) => {
//     console.log('connected to mongodb')
// }).catch((err)=>{
//     console.error(err);
// })

// // Models
// const User = mongoose.model('User', new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   phone: String,
//   password: String,
//   role: { type: String, enum: ['admin', 'doctor', 'nurse', 'general'] },
//   specialization: String,
//   arrival_time: String
// }));

// const Attendance = mongoose.model('Attendance', new mongoose.Schema({
//   user_id: mongoose.Schema.Types.ObjectId,
//   phc_id: mongoose.Schema.Types.ObjectId,
//   check_in: Date,
//   check_out: Date,
//   geo_location: { lat: Number, lng: Number }
// }));

// const Service = mongoose.model('Service', new mongoose.Schema({
//   phc_id: mongoose.Schema.Types.ObjectId,
//   doctor_id: mongoose.Schema.Types.ObjectId,
//   service_type: String,
//   patient_count: Number,
//   date: Date
// }));

// const Alert = mongoose.model('Alert', new mongoose.Schema({
//   phc_id: mongoose.Schema.Types.ObjectId,
//   type: { type: String, enum: ['absenteeism', 'service_shortage'] },
//   message: String,
//   status: { type: String, default: 'pending' }
// }));

// // Role-based access control & Flow
// // General People: View services and doctors
// app.get('/api/general/services', async (req, res) => {
//   const services = await Service.find().populate('doctor_id', 'name specialization arrival_time');
//   res.json(services);
// });

// app.get('/api/general/doctors', async (req, res) => {
//   const doctors = await User.find({ role: 'doctor' }, 'name specialization arrival_time');
//   res.json(doctors);
// });

// // Doctor/Nurse: View attendance records with filtering
// app.get('/api/doctor/attendance', async (req, res) => {
//   const { doctorId, startDate, endDate } = req.query;
//   const query = { user_id: doctorId };
//   if (startDate && endDate) {
//     query.check_in = { $gte: new Date(startDate), $lt: new Date(endDate) };
//   }
//   const attendance = await Attendance.find(query);
//   const presentDays = attendance.length;
//   const absentDays = calculateAbsents(startDate, endDate, attendance);
//   res.json({ presentDays, absentDays, attendance });
// });

// function calculateAbsents(startDate, endDate, attendance) {
//   let totalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
//   return totalDays - attendance.length;
// }

// // Admin: Access overview
// app.get('/api/admin/overview', async (req, res) => {
//   const users = await User.find();
//   const services = await Service.find();
//   const alerts = await Alert.find();
//   res.json({ users, services, alerts });
// });



const express = require('express');
const app = express()
var cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const router = require('./routes/route.js')
const session = require("express-session");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Configure CORS
// const corsOptions = {
//   origin: 'http://localhost:3001', // Allow only your frontend origin
//   credentials: true, // Allow credentials (cookies, authorization headers)
// };

app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a strong secret key
    resave: false,
    saveUninitialized: false, // Do not save uninitialized sessions
    cookie: { 
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Prevent client-side JS from accessing the cookie
      maxAge: 1000 * 60 * 60 * 24, // Session duration (e.g., 1 day)
    },
  })
);

app.use('/api',router)


mongoose.connect(process.env.MONGO_URL).then((result) => {
    console.log('connected to mongodb')
}).catch((err)=>{
    console.error(err);
})


app.listen(3000, () =>{
    console.log("server running")
})