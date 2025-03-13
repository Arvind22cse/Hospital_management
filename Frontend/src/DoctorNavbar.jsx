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
      <div className="doctor-profile" style={{"gap":"40px"}}>
        <img src={doctorAvatar || "default-avatar.png"} alt="Doctor Avatar" className="avatar" />
        <span>{doctorName}</span>
      </div>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  );
};

export default DoctorNavbar;
