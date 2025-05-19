const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: String, // e.g., "2025-04-20"
    required: true,
  },
  check_in: {
    type: Date, // ✅ actual timestamp for check-in
    required: true,
  },
  check_out: {
    type: Date, // Actual timestamp for check-out
    required: false, // Optional field, can be added later
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isCompleted: {
    type: Boolean,
    default: false, // Whether the attendance process is completed (check-in and check-out done)
  },
});

const Attendance = mongoose.model("Atten", attendanceSchema);
module.exports = Attendance;
