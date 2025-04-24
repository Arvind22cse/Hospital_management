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
  const [vaccines, setVaccines] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // Fetch hospitals data and related filters (location, services)
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/list-phc");
        setHospitals(response.data);
        setFilteredHospitals(response.data);

        const uniqueLocations = [...new Set(response.data.map(hospital => hospital.location))];
        const uniqueServices = [...new Set(response.data.flatMap(hospital => hospital.services))];

        setLocations(uniqueLocations);
        setServices(uniqueServices);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
      }
    };

    fetchHospitals();
  }, []);

  // Fetch vaccine updates
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/list-vac");
        setVaccines(response.data);
      } catch (err) {
        console.error("Error fetching vaccines:", err);
      }
    };

    fetchVaccines();
  }, []);

  useEffect(() => {
    const fetchDoctorAttendance = async () => {
      if (!selectedHospital?.doctors) return;
  
      const doctorAttendanceData = await Promise.all(
        selectedHospital.doctors.map(async (doctor) => {
          try {
            const response = await axios.get(`http://localhost:3000/api/getatten/${doctor._id}`);
            
            // Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split("T")[0];
            
            // Filter today's attendance records
            const todayAttendance = response.data.filter(att => 
              new Date(att.date).toISOString().split("T")[0] === today
            );
            
            // Find the most recent attendance record for today
            const latestRecord = todayAttendance.sort((a, b) => 
              new Date(b.check_in) - new Date(a.check_in)
            )[0];
  
            // Determine availability
            const isAvailable = latestRecord && 
                              latestRecord.check_in && 
                              !latestRecord.check_out;
  
            return { 
              doctorId: doctor._id, 
              attendance: latestRecord,
              available: isAvailable
            };
          } catch (error) {
            console.error(`Error fetching attendance for Doctor ${doctor._id}:`, error);
            return { doctorId: doctor._id, attendance: null, available: false };
          }
        })
      );
  
      setAttendance(doctorAttendanceData);
    };
  
    if (selectedHospital) {
      fetchDoctorAttendance();
      
      // Optional: Refresh every 5 minutes to get updated status
      const interval = setInterval(fetchDoctorAttendance, 300000);
      return () => clearInterval(interval);
    }
  }, [selectedHospital]);

  // Apply filters dynamically when `locationFilter` or `serviceFilter` changes
  useEffect(() => {
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
  }, [locationFilter, serviceFilter, hospitals]);

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
        <div className='row' style={{ marginTop: "50px" }}>
          <h1 style={{ marginLeft: "10%" }}>Vaccination Updates</h1>
          <div className='vaccine-cards-container'>
            {vaccines.length > 0 ? (
              vaccines.map((vaccine) => (
                <div key={vaccine._id} className='vaccine-card' style={{ backgroundColor: "#5e5e5d", marginTop: "20px", width: "90%", marginLeft: "10px" }}>
                  <h3 style={{ color: "white" }}>{vaccine.vaccine_name}</h3>
                  <p style={{ color: "white" }}><strong>Age Requirement:</strong> {vaccine.required_age}+</p>
                  <p style={{ color: "white" }}><strong>Location:</strong> {vaccine.location}</p>
                  <p style={{ color: "white" }}><strong>Date:</strong> {vaccine.from_date} - {vaccine.last_date}</p>
                  <p style={{ color: "white" }}><strong>Description:</strong> {vaccine.description}</p>
                  <button>Register</button>
                </div>
              ))
            ) : (
              <p style={{ marginLeft: "99px", marginTop: "50px" }}>No vaccine updates available</p>
            )}
          </div>
        </div>
      </div>

      {selectedHospital && (
        <div className='modal-overlay' onClick={() => setSelectedHospital(null)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <button className='close-btn' onClick={() => setSelectedHospital(null)}>X</button>
            
            <div className='hospital-detail-wrapper'>
              <div className='left-sec' style={{ marginLeft: "150px" }}>
                <h2>{selectedHospital.name}</h2>
                <p><strong>Location:</strong> {selectedHospital.location}</p>
                <p><strong>Type:</strong> {selectedHospital.type}</p>
                <p><strong>Contact:</strong> {selectedHospital.contact_info}</p>
                <p><strong>Services:</strong> {selectedHospital.services?.join(', ') || 'N/A'}</p>
                <p><strong>Facilities:</strong> {selectedHospital.facilities?.join(', ') || 'N/A'}</p>
              </div>
              
              <div className='right-sec' style={{ border: "1px solid black", padding: "10px" }}>
  <h3 style={{marginTop:"60px"}}>Doctors Available</h3>
  {selectedHospital.doctors?.length > 0 ? (
    <ul>
      {selectedHospital.doctors?.map((doctor, index) => {
        const doctorAttendanceEntry = attendance.find((entry) => entry.doctorId === doctor._id);
        const lastCheckIn = doctorAttendanceEntry?.attendance?.check_in 
          ? new Date(doctorAttendanceEntry.attendance.check_in).toLocaleTimeString()
          : null;
        
        return (
          <li key={index} style={{marginBottom: "15px"}}>
            <strong>{doctor.doctor_name}</strong> - {doctor.specialization}
            <br />
            📞 {doctor.phone} | ✉️ {doctor.doctor_email}
            <br />
            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
              <span
                style={{
                  color: doctorAttendanceEntry?.available ? "green" : "red",
                  fontWeight: "bold",
                  backgroundColor: doctorAttendanceEntry?.available ? "#d4f5d4" : "#f8d7da",
                  padding: "3px 8px",
                  borderRadius: "5px"
                }}
              >
                {doctorAttendanceEntry?.available ? "✅ Available" : "❌ Not Available"}
              </span>
              {lastCheckIn && (
                <span style={{fontSize: "0.8em", color: "#666"}}>
                  Last checked in: {lastCheckIn}
                </span>
              )}
            </div>
          </li>
        );
      })}
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