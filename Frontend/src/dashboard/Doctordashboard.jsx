import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorNavbar from "../DoctorNavbar";
import { ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";
import "./DoctorDashboard.css";

const Doctordashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState("");
  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const doctorId = localStorage.getItem("doctorId");
      const response = await axios.get(`http://localhost:3000/api/doctor-attendance?doctorId=${doctorId}`, {
        withCredentials: true,
      });
      console.log("Fetched Attendance Data:", response.data);
      setAttendance(response.data.attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };
  
  
  const markAttendance = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/mark-attendance", { doctorId });
      setMessage(response.data.message);
      fetchAttendance();
    } catch (error) {
      setMessage("Error marking attendance");
    }
  };

  const markCheckOut = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/mark-checkout", { doctorId });
      setMessage(response.data.message);
      fetchAttendance();
    } catch (error) {
      setMessage("Error marking check-out");
    }
  };

  const convertTimeToDecimal = (timeStr) => {
    if (!timeStr) return 0; // If no time, return 0
    const [time, modifier] = timeStr.split(" "); // Split time and AM/PM
    let [hours, minutes] = time.split(":").map(Number); // Split hours and minutes
  
    if (modifier === "PM" && hours !== 12) hours += 12; // Convert PM to 24-hour format
    if (modifier === "AM" && hours === 12) hours = 0; // Convert 12 AM to 0
  
    return hours + minutes / 60; // Convert minutes to decimal
  };
  
  // Convert attendance data for the chart
  const chartData = attendance.map(record => ({
    date: record.date,
    checkIn: convertTimeToDecimal(record.check_in),
    checkOut: convertTimeToDecimal(record.check_out),
  }));
  
  

  return (
    <div className="dashboard-container">
      <DoctorNavbar />
      <div className="dashboard-content">
        <h2 className="dashboard-title">Doctor Dashboard</h2>
        
        <div className="dashboard-grid">
          <div className="dashboard-card blue-card">
            <h3>Mark Attendance</h3>
            <button onClick={markAttendance} className="dashboard-button">Check-In</button>
          </div>
          
          <div className="dashboard-card green-card">
            <h3>Mark Check-Out</h3>
            <button onClick={markCheckOut} className="dashboard-button">Check-Out</button>
          </div>

          <div className="dashboard-card yellow-card">
            <h3>Total Attendance</h3>
            <p className="attendance-count">{attendance.length}</p>
          </div>
        </div>

        {message && <p className="message">{message}</p>}

        <div className="chart-container">
          <h3 className="chart-title">Attendance Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <XAxis dataKey="date" />
    <YAxis domain={[0, 24]} tickCount={13} label={{ value: "Time (Hours)", angle: -90, position: "insideLeft" }} />
    <Tooltip formatter={(value) => `${Math.floor(value)}:${Math.round((value % 1) * 60).toString().padStart(2, '0')}`} />
    <Legend />
    <Bar dataKey="checkIn" fill="#82ca9d" name="Check-In Time">
      {chartData.map((entry, index) => (
        <Cell key={`checkIn-${index}`} fill="#4CAF50" /> // Green for Check-In
      ))}
    </Bar>
    <Bar dataKey="checkOut" fill="#8884d8" name="Check-Out Time">
      {chartData.map((entry, index) => (
        <Cell key={`checkOut-${index}`} fill="#2196F3" /> // Blue for Check-Out
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

        </div>
      </div>
    </div>
  );
};

export default Doctordashboard;
