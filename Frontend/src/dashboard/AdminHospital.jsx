import React, { useState } from "react";
import axios from "axios";
import "./AdminHospital.css";
import Admindashboard from "./Admindashboard";

function AdminHospital() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "",
    services: "",
    doctors: "",
    contact_info: "",
    facilities: "",
    alerts: "",
    additional_services: "",
    basic_services: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formattedData = {
      ...formData,
      services: formData.services.split(","),
      doctors: formData.doctors.split(","),
      facilities: formData.facilities.split(","),
      alerts: formData.alerts.split(","),
      additional_services: formData.additional_services.split(","),
      basic_services: formData.basic_services.split(","),
    };

    try {
      
      await axios.post("http://localhost:3000/api/add-phc", formattedData);
      alert("Data successfully submitted!");
      setFormData({
        name: "",
        location: "",
        type: "",
        services: "",
        doctors: "",
        contact_info: "",
        facilities: "",
        alerts: "",
        additional_services: "",
        basic_services: "",
      });
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Submission failed!");
    }
  };

  return (
    <>
    <Admindashboard/>
    <div className="body-container" >
       
      <div className="form-container">
        <h2 className="form-title">Hospital Registration</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input type="text" name="name" className="form-input" placeholder="Hospital Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="location" className="form-input" placeholder="Location" value={formData.location} onChange={handleChange} required />
          <input type="text" name="type" className="form-input" placeholder="Type (e.g., PHC, Clinic)" value={formData.type} onChange={handleChange} required />
          <input type="text" name="services" className="form-input" placeholder="Services (comma-separated)" value={formData.services} onChange={handleChange} required />
          <input type="text" name="doctors" className="form-input" placeholder="Doctors (comma-separated IDs)" value={formData.doctors} onChange={handleChange} required />
          <input type="text" name="contact_info" className="form-input" placeholder="Contact Info" value={formData.contact_info} onChange={handleChange} required />
          <input type="text" name="facilities" className="form-input" placeholder="Facilities (comma-separated)" value={formData.facilities} onChange={handleChange} required />
          <input type="text" name="alerts" className="form-input" placeholder="Alerts (comma-separated)" value={formData.alerts} onChange={handleChange} />
          <input type="text" name="additional_services" className="form-input" placeholder="Additional Services (comma-separated)" value={formData.additional_services} onChange={handleChange} />
          <input type="text" name="basic_services" className="form-input" placeholder="Basic Services (comma-separated)" value={formData.basic_services} onChange={handleChange} required />
          
          <button type="submit" className="form-button">Submit</button>
        </form>
      </div>
    </div>
    </>
  );
}

export default AdminHospital;
