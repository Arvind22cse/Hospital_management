import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./login.css";

const Signin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userType, setUserType] = useState(location.state?.defaultUser || "Doctor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`Logging in as ${userType} with Email:`, email);
    // Perform authentication logic here
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
        
        <form className="login-form" onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="login-btn">Login</button>
          {userType === "Doctor" && (
            <button className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signin;
