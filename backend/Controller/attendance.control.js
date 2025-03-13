const doctorModel = require("../model/doctor.model.js");
const attendanceModel = require("../model/attendance.model.js");



// Mark Attendance (Check-in)
const markAttendance = async (req, res) => {
  try {
    const { doctor_email, check_in } = req.body;
    const date = new Date().toISOString().split("T")[0]; // Current Date YYYY-MM-DD

    const doctor = await doctorModel.findOne({ doctor_email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if already checked in today
    const existingAttendance = await attendanceModel.findOne({ doctor_id: doctor._id, date });
    if (existingAttendance) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    // Create new attendance entry
    const attendance = new attendanceModel({ doctor_id: doctor._id, date, check_in });
    await attendance.save();

    res.status(200).json({ message: "Check-in successful", attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error marking attendance" });
  }
};

// Mark Check-out
const markCheckOut = async (req, res) => {
  try {
    const { doctor_email, check_out } = req.body;
    const date = new Date().toISOString().split("T")[0];

    const doctor = await doctorModel.findOne({ doctor_email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const attendance = await attendanceModel.findOne({ doctor_id: doctor._id, date });

    if (!attendance) {
      return res.status(400).json({ message: "Check-in first before checking out" });
    }

    attendance.check_out = check_out;
    await attendance.save();

    res.status(200).json({ message: "Check-out successful", attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error marking check-out" });
  }
};

// Get Doctor Attendance with Filtering
const getDoctorAttendance = async (req, res) => {
  try {
    const { doctor_email, startDate, endDate } = req.query;

    const doctor = await doctorModel.findOne({ doctor_email });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    let query = { doctor_id: doctor._id };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await attendanceModel.find(query);

    res.status(200).json({ doctor: doctor.name, attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching attendance" });
  }
};

module.exports = { markAttendance, markCheckOut, getDoctorAttendance };
