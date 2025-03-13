import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);

  // Fetch hospital data from the API
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/list-phc");
        const hospitalData = response.data;

        setHospitals(hospitalData); // Set the hospitals data
        setFilteredHospitals(hospitalData); // Initialize filteredHospitals with all data

        // Extract unique locations and services
        const uniqueLocations = [...new Set(hospitalData.map(hospital => hospital.location))];
        const uniqueServices = [
          ...new Set(hospitalData.flatMap(hospital => hospital.services))
        ];

        setLocations(uniqueLocations); // Set the unique locations for the dropdown
        setServices(uniqueServices);   // Set the unique services for the dropdown
      } catch (err) {
        console.error("Error fetching hospitals:", err);
      }
    };
    fetchHospitals();
  }, []);

  // Handle filter changes
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

  // Handle location filter change
  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
  };

  // Handle services filter change
  const handleServiceChange = (e) => {
    setServiceFilter(e.target.value);
  };

  return (
    <div className='dashboard-wrapper'>
      <div className='left-section'>
        <div className="dashboard-container">
          <h2>Hospitals Near You</h2>

          {/* Filter Section */}
          <div className="filters" style={{ marginTop: "100px" }}>
            <select
              className="filter-select"
              value={locationFilter}
              onChange={handleLocationChange}
            >
              <option value="">Select Location</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={serviceFilter}
              onChange={handleServiceChange}
            >
              <option value="">Select Service</option>
              {services.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <button onClick={handleFilterChange} className="filter-btn">
              Apply Filters
            </button>
          </div>

          {/* Hospital Cards */}
          <div className="hospital-cards-container">
            {filteredHospitals.map((hospital) => (
              <div key={hospital.id} className="hospital-card">
                <img
                  src="https://img.freepik.com/free-vector/people-walking-sitting-hospital-building-city-clinic-glass-exterior-flat-vector-illustration-medical-help-emergency-architecture-healthcare-concept_74855-10130.jpg"
                  alt={hospital.name}
                  className="hospital-image"
                />
                <h3>{hospital.name}</h3>
                <p>{hospital.location}</p>
                <p>Services: {hospital.services.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className='right-section'>
        <div className='row' style={{marginTop:"100px" }}>
          <h1 style={{marginLeft:"90px" }}>Vaccine</h1>
          <p style={{marginLeft:"99px",marginTop:"50px" }}>comming soon.....</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
