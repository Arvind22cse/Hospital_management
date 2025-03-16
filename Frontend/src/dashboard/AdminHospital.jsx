import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Import icons
import './Dashboard.css';
import Admindashboard from './Admindashboard';

function AdminHosp() {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newHospital, setNewHospital] = useState({
    name: '',
    location: '',
    type: '',
    contact_info: '',
    services: '',
    facilities: '',
    alerts: '',
    additional_services: '',
    basic_services: '',
  });

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/list-phc");
        const hospitalData = response.data;

        setHospitals(hospitalData);
        setFilteredHospitals(hospitalData);

        const uniqueLocations = [...new Set(hospitalData.map(hospital => hospital.location))];
        const uniqueServices = [...new Set(hospitalData.flatMap(hospital => hospital.services))];

        setLocations(uniqueLocations);
        setServices(uniqueServices);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
      }
    };
    fetchHospitals();
  }, []);

  const handleFilterChange = () => {
    let filteredData = hospitals;

    if (locationFilter) {
      filteredData = filteredData.filter((hospital) =>
        hospital.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (serviceFilter) {
      filteredData = filteredData.filter((hospital) =>
        hospital.services.some((service) =>
          service.toLowerCase().includes(serviceFilter.toLowerCase())
        )
      );
    }

    setFilteredHospitals(filteredData);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/dphc/${id}`);
      setHospitals(hospitals.filter(hospital => hospital._id !== id));
      setFilteredHospitals(filteredHospitals.filter(hospital => hospital._id !== id));

      alert("Hospital deleted successfully!");
    } catch (error) {
      console.error("Error deleting hospital:", error);
    }
  };

  const handleUpdate = (hospital) => {
    setSelectedHospital(hospital);
    setIsAdding(true);
  };

  const handleAdd = () => {
    setSelectedHospital(null);
    setIsAdding(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewHospital({ ...newHospital, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formattedData = {
      ...newHospital,
      services: newHospital.services.split(','),
      facilities: newHospital.facilities.split(','),
      alerts: newHospital.alerts.split(','),
      additional_services: newHospital.additional_services.split(','),
      basic_services: newHospital.basic_services.split(','),
    };

    try {
      if (selectedHospital) {
        // Update existing hospital
        await axios.put(`http://localhost:3000/api/hospitals/${selectedHospital._id}`, formattedData);
        alert("Hospital updated successfully!");
      } else {
        // Add new hospital
        await axios.post("http://localhost:3000/api/hospitals", formattedData);
        alert("Hospital added successfully!");
      }

      setIsAdding(false);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed!");
    }
  };

  return (
    <>
      <Admindashboard />
      <div className='dashboard-wrapper'>
        <div className='left-section'>
          <div className='dashboard-container'>
            <h2>Hospitals</h2>

            <button className='add-btn' onClick={handleAdd}>
              <FaPlus /> Add Hospital
            </button>

            <div className='filters'>
              <select className='filter-select' value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                <option value=''>Select Location</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>

              <select className='filter-select' value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
                <option value=''>Select Service</option>
                {services.map((service, index) => (
                  <option key={index} value={service}>{service}</option>
                ))}
              </select>

              <button onClick={handleFilterChange} className='filter-btn'>Apply Filters</button>
            </div>

            <div className='hospital-cards-container'>
              {filteredHospitals.map((hospital) => (
                <div key={hospital._id} className='hospital-card'>
                  <img 
                    src="https://img.freepik.com/free-vector/people-walking-sitting-hospital-building-city-clinic-glass-exterior-flat-vector-illustration-medical-help-emergency-architecture-healthcare-concept_74855-10130.jpg" 
                    alt={hospital.name} 
                    className='hospital-image'
                  />
                  <h3>{hospital.name}</h3>
                  <p>{hospital.location}</p>
                  <button onClick={() => setSelectedHospital(hospital)}>Read More</button>
                  <div className='hospital-actions'>
                    <FaEdit className='edit-icon' onClick={() => handleUpdate(hospital)} />
                    <FaTrash className='delete-icon' onClick={() => handleDelete(hospital._id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {isAdding && (
          <div className='modal-overlay' onClick={() => setIsAdding(false)}>
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
              <button className='close-btn' onClick={() => setIsAdding(false)}>X</button>
              <h2>{selectedHospital ? "Update Hospital" : "Add Hospital"}</h2>
              <form className='form' onSubmit={handleSubmit}>
                <input type="text" name="name" className='form-input' placeholder="Hospital Name" value={newHospital.name} onChange={handleFormChange} required />
                <input type="text" name="location" className='form-input' placeholder="Location" value={newHospital.location} onChange={handleFormChange} required />
                <input type="text" name="type" className='form-input' placeholder="Type (e.g., PHC, Clinic)" value={newHospital.type} onChange={handleFormChange} required />
                <input type="text" name="services" className='form-input' placeholder="Services (comma-separated)" value={newHospital.services} onChange={handleFormChange} required />
                <input type="text" name="contact_info" className='form-input' placeholder="Contact Info" value={newHospital.contact_info} onChange={handleFormChange} required />
                <input type="text" name="facilities" className='form-input' placeholder="Facilities (comma-separated)" value={newHospital.facilities} onChange={handleFormChange} required />
                <input type="text" name="alerts" className='form-input' placeholder="Alerts (comma-separated)" value={newHospital.alerts} onChange={handleFormChange} />
                <input type="text" name="additional_services" className='form-input' placeholder="Additional Services (comma-separated)" value={newHospital.additional_services} onChange={handleFormChange} />
                <input type="text" name="basic_services" className='form-input' placeholder="Basic Services (comma-separated)" value={newHospital.basic_services} onChange={handleFormChange} required />
                
                <button type="submit" className='form-button'>Save</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminHosp;
