import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doctor_name: "",
    doctor_email: "",
    password: "",
    phone: "+91", // Default prefix
    specialization: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "phone") {
      // Ensure +91 remains at the start
      if (!value.startsWith("+91")) {
        value = "+91" + value.replace(/[^0-9]/g, "").slice(2); // Keep only numbers after +91
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:3002/api/add-doctor", formData);
      console.log("Signup Successful", response.data);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Doctor Signup</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="signup-form" onSubmit={handleSignup}>
          <input
            type="text"
            name="doctor_name"
            placeholder="Full Name"
            value={formData.doctor_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="doctor_email"
            placeholder="Email"
            value={formData.doctor_email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-btn">Sign Up</button>
          <p className="redirect-login">
            Already have an account? 
            <span onClick={() => navigate("/login")} className="login-link"> Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
