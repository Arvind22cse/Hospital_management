const doctorModel = require("../model/doctor.model.js");
const attendanceModel = require("../model/attendance.model.js");



// Mark Attendance (Check-in)
const markAttendance = async (req, res) => {
  try {
    if (!req.body.doctorId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const doctorId = req.session.doctorId || req.body.doctorId; // Get doctorId from session
    const date = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const check_in = new Date().toLocaleTimeString(); // Current Time

    // Check if already checked in today
    const existingAttendance = await attendanceModel.findOne({ doctor_id: doctorId, date });
    if (existingAttendance) {
      console.log("Already checked in today" )
      return res.status(400).json({ message: "Already checked in today" });
    }

    // Create new attendance entry
    const attendance = new attendanceModel({ doctor_id: doctorId, date, check_in });
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
    const doctorId = req.session.doctorId || req.body.doctorId;
    const date = new Date().toISOString().split("T")[0];
    const check_out = new Date().toLocaleTimeString();

    const attendance = await attendanceModel.findOne({ doctor_id: doctorId, date });

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
    const doctorId = req.query.doctorId || req.body.doctorId;

    const { startDate, endDate } = req.query;

    let query = { doctor_id: doctorId };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await attendanceModel.find(query);
    console.log("Backend Attendance Data:", attendance);
    res.status(200).json({ attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching attendance" });
  }
};




// Get all attendance records for a particular doctor with doctor details
const getAttendance = async (req, res) => {
  try {
    const { doctorId } = req.params;


    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required." });
    }

    const today = new Date().toISOString().split("T")[0];

    // Fetch attendance records and populate doctor details
    const attendance = await attendanceModel
      .find({ doctor_id: doctorId , date: today  })
      .populate("doctor_id", "name email specialization"); // Select relevant fields from Doctor model

    if (!attendance.length) {
      return res.status(404).json({ message: "No attendance records found for this doctor." });
    }

    res.status(200).json({attendance });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Server error while fetching attendance." });
  }
};


module.exports = { markAttendance, markCheckOut, getDoctorAttendance , getAttendance };
