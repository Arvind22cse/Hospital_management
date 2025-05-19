import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorNavbar.css"; // Add CSS for styling

const DoctorNavbar = () => {
  const navigate = useNavigate();

  const doctorName = localStorage.getItem("doctorName");
  const doctorAvatar = localStorage.getItem("doctorAvatar");

  const handleLogout = async () => {
    await axios.get("http://localhost:3002/api/doctor-logout");
    localStorage.clear();  // Clear stored doctor details
    navigate("/");  // Redirect to login page
  };

  return (
    <nav className="doctor-navbar">
      <div className="doctor-profile" style={{"gap":"40px"}}>
        <img src="https://t4.ftcdn.net/jpg/01/34/29/31/360_F_134293169_ymHT6Lufl0i94WzyE0NNMyDkiMCH9HWx.jpg"alt="Doctor Avatar" className="avatar" />
        <span>{doctorName}</span>
      </div>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </nav>
  );
};

export default DoctorNavbar;
