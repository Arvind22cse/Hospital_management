import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorNavbar.css"; // Add CSS for styling

const DoctorNavbar = () => {
  const navigate = useNavigate();

  const doctorName = localStorage.getItem("doctorName");
  const doctorAvatar = localStorage.getItem("doctorAvatar");

  const handleLogout = async () => {
    await axios.get("http://localhost:3000/api/doctor-logout");
    localStorage.clear();  // Clear stored doctor details
    navigate("/login");  // Redirect to login page
  };

  return (
    <nav className="doctor-navbar">
      <h2>Doctor Dashboard</h2>
      <div className="doctor-profile">
        <img src={doctorAvatar || "default-avatar.png"} alt="Doctor Avatar" className="avatar" />
        <span>{doctorName}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
