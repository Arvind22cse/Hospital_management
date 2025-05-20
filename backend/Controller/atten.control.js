// In your location.controller.js or a similar file

const mongoose = require("mongoose");
const Attendance = require("../model/atten.model"); // Your attendance model

const postAttendance = async (req, res) => {
    try {
      const { doctorId, address } = req.body;
  
      if (!doctorId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
      }
  
      if (!address || !address.startsWith("Your current location:")) {
        return res.status(400).json({ message: "Invalid or missing location address." });
      }
  
      // const validAddress = "Your current location:\nPerundurai, Erode, Tamil Nadu, 638052, India";
  
      if (!address.includes("641001") &&!address.includes("Coimbatore") && !address.includes("Tamil Nadu")) {
        return res.status(403).json({ message: "Unauthorized location. Attendance not allowed." });
      }
      
  
      const date = new Date().toISOString().split("T")[0];
  
      // ✅ Check if there's already an open (incomplete) attendance for today
      const existingOpen = await Attendance.findOne({
        doctorId,
        date,
        isCompleted: false,
      });
  
      if (existingOpen) {
        return res.status(400).json({ message: "You already have an active check-in. Please check out first." });
      }
  
      const check_in = new Date();
  
      const newAttendance = new Attendance({
        doctorId,
        address,
        date,
        check_in,
      });
  
      await newAttendance.save();
  
      res.status(200).json({
        message: "Check-in successful",
        attendance: newAttendance,
      });
    } catch (err) {
      console.error("❌ Error in postAttendance:", err);
      res.status(500).json({ message: "Error marking attendance" });
    }
  };
  

  const postCheckOut = async (req, res) => {
    try {
      const { doctorId } = req.body;
      const date = new Date().toISOString().split("T")[0];
      const check_out = new Date();
  
      // ✅ Find the most recent incomplete attendance for today
      const existingAttendance = await Attendance.findOne({
        doctorId,
        date,
        isCompleted: false,
      }).sort({ check_in: -1 }); // Most recent open check-in
  
      if (!existingAttendance) {
        return res.status(400).json({ message: "No active check-in found for today." });
      }
  
      existingAttendance.check_out = check_out;
      existingAttendance.isCompleted = true;
  
      await existingAttendance.save();
  
      res.status(200).json({
        message: "Check-out successful",
        attendance: existingAttendance,
      });
    } catch (err) {
      console.error("❌ Error in postCheckOut:", err);
      res.status(500).json({ message: "Error marking check-out" });
    }
  };
  

// const getatten = async (req, res) => {
//     try {
//       const { doctorId } = req.params; // Get doctorId from URL params
//       const attendance = await Attendance.find({ doctorId }); // Find attendance for the specific doctor
//       if (!attendance || attendance.length === 0) {
//         return res.status(404).json({ message: "No attendance records found for this doctor" });
//       }
//       res.status(200).json(attendance);
//     } catch (err) {
//       console.log(err);
//       res.status(500).send("Error fetching attendance data");
//     }
//   };
  
const getatten = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const attendance = await Attendance.find({ doctorId }).sort({ date: 1 });

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({ message: "No attendance records found for this doctor" });
    }

    res.status(200).json(attendance);
  } catch (err) {
    console.log("❌ Error in getatten:", err);
    res.status(500).send("Error fetching attendance data");
  }
};

module.exports = { postAttendance ,getatten ,postCheckOut};
