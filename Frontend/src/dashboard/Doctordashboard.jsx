import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorNavbar from "../DoctorNavbar";
import { ResponsiveContainer, Tooltip, Cell, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";

const Doctordashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const doctorId = localStorage.getItem("doctorId");

  useEffect(() => {
    fetchAttendance();
  }, [startDate, endDate]); // Re-fetch when date filters change

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
      const response = await axios.post("http://localhost:3000/api/mark-checkout", { doctorId }, { withCredentials: true });
      setMessage(response.data.message);
      fetchAttendance();
    } catch (error) {
      setMessage("Error marking check-out");
    }
  };

  // Prepare data for chart
  const chartData = attendance.map(record => ({
    date: record.date,
    status: record.check_out ? 2 : 1, // 2 = Checked Out, 1 = Checked In Only
  }));

  return (
    <div className="p-4">
      <DoctorNavbar />
      <h2 className="text-xl font-bold">Doctor Dashboard</h2>

      <div className="flex gap-4 my-4">
        <button onClick={markAttendance} className="bg-blue-500 text-white px-4 py-2 rounded">
          Mark Attendance
        </button>
        <button onClick={markCheckOut} className="bg-green-500 text-white px-4 py-2 rounded">
          Mark Check-Out
        </button>
      </div>
      <p className="text-red-500">{message}</p>

      {/* Filtering Options */}
      <div className="flex gap-4 my-4">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />

        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <h3 className="text-lg font-semibold mt-6">Attendance Progress</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="status" fill="#8884d8">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.status === 2 ? "#82ca9d" : "#FFBB28"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Doctordashboard;
