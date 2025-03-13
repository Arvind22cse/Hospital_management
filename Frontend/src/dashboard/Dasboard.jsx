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
  const [selectedHospital, setSelectedHospital] = useState(null);

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

  return (
    <div className='dashboard-wrapper'>
      <div className='left-section'>
        <div className='dashboard-container'>
          <h2>Hospitals Near You</h2>

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
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className='right-section'>
        <div className='row' style={{ marginTop: "100px" }}>
          <h1 style={{ marginLeft: "90px" }}>Vaccine</h1>
          <p style={{ marginLeft: "99px", marginTop: "50px" }}>Coming soon...</p>
        </div>
      </div>
      
      {selectedHospital && (
        <div className='modal-overlay' onClick={() => setSelectedHospital(null)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button className='close-btn' onClick={() => setSelectedHospital(null)}>X</button>
            <div className='hospital-detail-wrapper'>
              {/* Left Section: Hospital Details */}
              <div className='left-sec' style={{marginLeft:"150px"}}>
                <h2>{selectedHospital.name}</h2>
                <p style={{padding:"5px"}}><strong>Location:</strong> {selectedHospital.location}</p>
                <p style={{padding:"5px"}}><strong>Type:</strong> {selectedHospital.type}</p>
                <p style={{padding:"5px"}}><strong>Contact:</strong> {selectedHospital.contact_info}</p>
                <p style={{padding:"5px"}}><strong>Services:</strong> {selectedHospital.services?.join(', ') || 'N/A'}</p>
                <p style={{padding:"5px"}}><strong>Facilities:</strong> {selectedHospital.facilities?.join(', ') || 'N/A'}</p>
                
              </div>

              {/* Right Section: Doctors */}
              <div className='right-sec' style={{border:"1px solid black"}}>
              <h3 style={{marginTop:"100px"}}>Doctors Available</h3>
                {selectedHospital.doctors?.length > 0 ? (
                  <ul style={{marginTop:"10px"}}>
                    {selectedHospital.doctors.map((doctor, index) => (
                      <li key={index} style={{listStyle:"none"}}>
                        <strong>{doctor.doctor_name}</strong> - {doctor.specialization}
                        <br />
                        📞 {doctor.phone} | ✉️ {doctor.doctor_email}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No doctors available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
