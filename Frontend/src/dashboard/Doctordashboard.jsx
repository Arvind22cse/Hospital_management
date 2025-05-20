import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorNavbar from "../DoctorNavbar";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import "./DoctorDashboard.css";

const Doctordashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    fetchAttendance();
  }, []);
  const formatTo12Hour = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${paddedMinutes} ${ampm}`;
  };
  

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/getatten/${doctorId}`
      );
      console.log("Fetched Attendance Data:", response.data);
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const convertTimeToDecimal = (isoString) => {
    if (!isoString) return 0;
    const date = new Date(isoString);
    return date.getHours() + date.getMinutes() / 60;
  };
  

  const chartData = attendance.map((record) => ({
    date: record.date,
    checkIn: convertTimeToDecimal(record.check_in),
    checkOut: convertTimeToDecimal(record.check_out),
  }));

  return (
    <div className="dashboard-container">
      <DoctorNavbar />
      <div className="dashboard-content">
        <h2 className="dashboard-title">Doctor Dashboard</h2>

        <div className="dashboard-card yellow-card">
          <h3>Total Attendance</h3>
          <p className="attendance-count">{attendance.length}</p>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Attendance Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="date" />
              <YAxis
                domain={[0, 24]}
                tickCount={13}
                label={{
                  value: "Time (Hours)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
  content={({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const record = attendance.find((item) => item.date === label);
      return (
        <div className="custom-tooltip">
          <p><strong>Date:</strong> {label}</p>
          <p><strong>Check-In:</strong> {formatTo12Hour(record.check_in)}</p>
          <p><strong>Check-Out:</strong> {formatTo12Hour(record.check_out)}</p>
        </div>
      );
    }
    return null;
  }}
/>

              <Legend />
              <Bar dataKey="checkIn" name="Check-In Time">
                {chartData.map((entry, index) => (
                  <Cell key={`checkIn-${index}`} fill="#4CAF50" />
                ))}
              </Bar>
              <Bar dataKey="checkOut" name="Check-Out Time">
                {chartData.map((entry, index) => (
                  <Cell key={`checkOut-${index}`} fill="#2196F3" />
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
