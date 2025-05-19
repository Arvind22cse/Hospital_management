const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  check_in: { type: String, required: false },
  check_out: { type: String },
  face_image: { type: String }, // Optional: Store the image URL or path here
});

const attendanceModel = mongoose.model("Attendance", attendanceSchema);

module.exports = attendanceModel;
