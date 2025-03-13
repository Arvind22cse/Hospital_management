import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorNavbar from "../DoctorNavbar";
import { ResponsiveContainer, Tooltip, Cell, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import "./DoctorDashboard.css";

const Doctordashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      
      const response = await axios.get(`http://localhost:3000/api/doctor-attendance?${queryParams}`, {
        withCredentials: true,
      });
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

  const chartData = attendance.map(record => ({
    date: record.date,
    status: record.check_out ? "Check-Out" : "Check-In",
  }));

  return (
    <div className="dashboard-container">
      <DoctorNavbar />
      <div className="dashboard-content">
        <h2 className="dashboard-title">Doctor Dashboard</h2>
        
        <div className="date-inputs">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={fetchAttendance} className="dashboard-button">Submit</button>
        </div>

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

        <div className="msg">
        {message && <p className="message">{message}</p>}
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Attendance Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="status" fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.status === "Check-Out" ? "#4CAF50" : "#FFBB28"} />
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
