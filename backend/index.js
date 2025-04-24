const express = require("express");
const app = express();
var cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const router = require("./routes/route.js");
const session = require("express-session");
// const cron = require("node-cron");
// const twilio = require("twilio");
const Attendance = require("./model/attendance.model.js");
const Doctor = require("./model/doctor.model.js");

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// // Configure CORS
// const corsOptions = {
//   origin: 'http://localhost:3001', // Allow only your frontend origin
//   credentials: true, // Allow credentials (cookies, authorization headers)
// };
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend origin
    credentials: true, // Allow cookies and credentials
  })
);
// app.use(cors());

// app.use(
//   cors({
//     origin: "http://localhost:5174", // ✅ Allow only your frontend origin
//     credentials: true, // ✅ Allow cookies & authentication headers
//     methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allow specific HTTP methods
//     allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow necessary headers
//   })
// );

app.use(
  session({
    secret:'your-secret-key', // Use a strong secret key
    resave: false,
    saveUninitialized: false, // Do not save uninitialized sessions
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Prevent client-side JS from accessing the cookie
      maxAge: 1000 * 60 * 60 * 24, // Session duration (e.g., 1 day)
    },
  })
);

app.use("/api", router);

mongoose
  .connect("mongodb+srv://arvindm22cse:31-Aug-04@hospital.jyifl.mongodb.net/?retryWrites=true&w=majority&appName=Hospital")
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });


// Function to send SMS via Twilio
// const sendSms = async (phone, message) => {

//   try {
//     const response = await client.messages.create({
//       body: message,
//       from:process.env.TWILIO_PHONE_NUMBER, 
//       to: phone, 
//     });

//     console.log(`✅ SMS sent to ${phone}: ${response.sid}`);
//     return response;
//   } catch (error) {
//     console.error(`❌ Error sending SMS to ${phone}:`, error.message);
//     throw error;
//   }
// };


// Cron job runs every day at 9:30 AM
// cron.schedule("30 9 * * *", async () => {
//   console.log("📅 Running attendance check at 9:30 AM...");

//   const today = new Date().toISOString().split("T")[0];

//   try {
//     const doctors = await Doctor.find();


//     for (const doctor of doctors) {
//       const attendance = await Attendance.findOne({ doctor_id: doctor._id, date: today });

//       if (!attendance || !attendance.check_in) {
//         const message = `Reminder: Dr. ${doctor.doctor_name}, you have not checked in today. Please check in immediately.`;
//         sendSms(doctor.phone, message);
//         console.log(`📢 SMS alert sent to Dr. ${doctor.doctor_name}`);

//       }
//     }
//   } catch (error) {
//     console.error("❌ Error checking attendance:", error);
//   }
// });

// console.log("✅ Attendance check scheduler started...");



app.listen(3000, () => {
  console.log("server running");
});
