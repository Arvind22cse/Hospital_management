import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";  // Import axios
import "./login.css";

const Signin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userType, setUserType] = useState(location.state?.defaultUser || "Doctor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");
  
  //   try {
  //     const response = await axios.post("http://localhost:3000/api/doctor-login", { email, password });
  
  //     if (response.status === 200) {
  //       console.log("Login Successful:", response.data);
  
  //       // Store doctor details in localStorage
  //       localStorage.setItem("doctorId", response.data.doctorId);
  //       localStorage.setItem("doctorName", response.data.doctorName);

  //       console.log(response.data.doctorId)
  
  //       navigate("/doctor-dashboard");
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       setError(error.response.data.message);
  //     } else {
  //       setError("Something went wrong. Please try again.");
  //     }
  //   }
  // };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    if (userType === "Admin" && email === "admin@gmail.com" && password === "123") {
      console.log("Admin Login Successful");
      navigate("/admindoctor"); // Redirect to admin dashboard
      return;
    }
  else{
    
  }
    try {
      const response = await axios.post("http://localhost:3002/api/doctor-login", { email, password });
  
      if (response.status === 200) {
        console.log("Doctor Login Successful:", response.data);
  
        // Store doctor details in localStorage
        localStorage.setItem("doctorId", response.data.doctorId);
        localStorage.setItem("doctorName", response.data.doctorName);
  
        navigate("/doctor-dashboard"); // Redirect to doctor dashboard
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="role-selection">
          <button className={`role-btn ${userType === "Admin" ? "active" : ""}`} onClick={() => setUserType("Admin")}>
            Admin
          </button>
          <button className={`role-btn ${userType === "Doctor" ? "active" : ""}`} onClick={() => setUserType("Doctor")}>
            Doctor
          </button>
        </div>

        <h2>{userType} Login</h2>

        {error && <p className="error-message">{error}</p>} {/* Display error if login fails */}

        <form className="login-form" onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="login-btn">Login</button>
          {userType === "Doctor" && (
            <button type="button" className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signin;
