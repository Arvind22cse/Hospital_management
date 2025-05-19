import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaUserShield, FaUserMd, FaArrowLeft, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import "./signin.css";

const Signin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userType, setUserType] = useState(
    location.state?.defaultUser || "Doctor"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (
        userType === "Admin" &&
        email === "admin@gmail.com" &&
        password === "123"
      ) {
        console.log("Admin Login Successful");
        setTimeout(() => {
          navigate("/admin");
        }, 1000);
        return;
      }

      const response = await axios.post(
        "http://localhost:3002/api/doctor-login",
        { email, password }
      );

      if (response.status === 200) {
        console.log("Doctor Login Successful:", response.data);
        localStorage.setItem("doctorId", response.data.doctorId);
        localStorage.setItem("doctorName", response.data.doctorName);
        setTimeout(() => {
          navigate("/doctor-dashboard");
        }, 1000);
      }
    } catch (error) {
      setIsLoading(false);
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
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>
        
        <div className="role-selection">
          <button
            className={`role-btn admin ${userType === "Admin" ? "active" : ""}`}
            onClick={() => setUserType("Admin")}
          >
            <FaUserShield className="role-icon" />
            Admin
          </button>
          <button
            className={`role-btn doctor ${userType === "Doctor" ? "active" : ""}`}
            onClick={() => setUserType("Doctor")}
          >
            <FaUserMd className="role-icon" />
            Doctor
          </button>
        </div>
        
        <div className="login-header">
          <div className={`login-icon ${userType.toLowerCase()}`}>
            {userType === "Admin" ? <FaUserShield /> : <FaUserMd />}
          </div>
          <h2>{userType} Login</h2>
        </div>
        
        {error && (
          <div className="error-message animate__animated animate__shakeX">
            {error}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          
          <button 
            type="submit" 
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <FaSignInAlt className="btn-icon" />
                Login
              </>
            )}
          </button>
          
          {userType === "Doctor" && (
            <button
              type="button"
              className="signup-btn"
              onClick={() => navigate("/signup")}
            >
              <FaUserPlus className="btn-icon" />
              Sign Up
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signin;