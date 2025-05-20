import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, X, ChevronRight, VoteIcon as Vaccine, Calendar, Info, User, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch hospitals data and related filters (location, services)
  useEffect(() => {
    const fetchHospitals = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:3002/api/list-phc");
        setHospitals(response.data);
        setFilteredHospitals(response.data);

        const uniqueLocations = [...new Set(response.data.map(hospital => hospital.location))];
        const uniqueServices = [...new Set(response.data.flatMap(hospital => hospital.services))];

        setLocations(uniqueLocations);
        setServices(uniqueServices);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  // Fetch vaccine updates
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/list-vac");
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
            const response = await axios.get(`http://localhost:3002/api/getatten/${doctor._id}`);
            
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
      
      // Refresh every 5 minutes to get updated status
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
    <div className="dashboard-wrapper">
      <div className="left-section">
        <div className="dashboard-container">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="dashboard-title"
          >
            Hospitals Near You
          </motion.h2>

          <motion.div 
            className="filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="filter-group">
              <select 
                className="filter-select" 
                value={locationFilter} 
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              
              <select 
                className="filter-select" 
                value={serviceFilter} 
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="">All Services</option>
                {services.map((service, index) => (
                  <option key={index} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </motion.div>

          <div className="hospital-cards-container">
            <AnimatePresence>
              {isLoading ? (
                Array(6).fill(0).map((_, index) => (
                  <motion.div 
                    key={`skeleton-${index}`}
                    className="hospital-card skeleton"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="skeleton-image"></div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-button"></div>
                  </motion.div>
                ))
              ) : (
                filteredHospitals.map((hospital, index) => (
                  <motion.div 
                    key={hospital._id}
                    className="hospital-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ 
                      y: -10, 
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="card-image-container">
                      <img
                        src="https://img.freepik.com/free-vector/people-walking-sitting-hospital-building-city-clinic-glass-exterior-flat-vector-illustration-medical-help-emergency-architecture-healthcare-concept_74855-10130.jpg"
                        alt={hospital.name}
                        className="hospital-image"
                      />
                      <div className="card-overlay">
                        <span className="hospital-type">{hospital.type || 'Hospital'}</span>
                      </div>
                    </div>
                    <h3 className="hospital-name">{hospital.name}</h3>
                    <p className="hospital-location">
                      <MapPin size={14} className="location-icon" />
                      {hospital.location}
                    </p>
                    <button 
                      className="view-details-btn"
                      onClick={() => setSelectedHospital(hospital)}
                    >
                      View Details
                      <ChevronRight size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            
            {!isLoading && filteredHospitals.length === 0 && (
              <motion.div 
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p>No hospitals match your filters. Try adjusting your criteria.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="right-section">
        <motion.div 
          className="vaccine-updates"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="section-title">
            <Vaccine className="section-icon" />
            Vaccination Updates
          </h2>
          
          <div className="vaccine-cards-container">
            <AnimatePresence>
              {vaccines.length > 0 ? (
                vaccines.map((vaccine, index) => (
                  <motion.div 
                    key={vaccine._id} 
                    className="vaccine-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className="vaccine-header">
                      <h3>{vaccine.vaccine_name}</h3>
                      <span className="age-badge">{vaccine.required_age}+ years</span>
                    </div>
                    <div className="vaccine-details">
                      <p className="vaccine-info">
                        <MapPin size={14} className="info-icon" />
                        {vaccine.location}
                      </p>
                      <p className="vaccine-info">
                        <Calendar size={14} className="info-icon" />
                        {vaccine.from_date} - {vaccine.last_date}
                      </p>
                      <p className="vaccine-description">{vaccine.description}</p>
                    </div>
                   
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="no-vaccines"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p>No vaccine updates available at this time</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedHospital && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedHospital(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="close-btn"
                onClick={() => setSelectedHospital(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              
              <div className="hospital-detail-wrapper">
                <div className="left-sec">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="hospital-detail-title">{selectedHospital.name}</h2>
                    
                    <div className="hospital-info-grid">
                      <div className="info-item">
                        <MapPin className="info-icon" />
                        <div>
                          <h4>Location</h4>
                          <p>{selectedHospital.location}</p>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <Info className="info-icon" />
                        <div>
                          <h4>Type</h4>
                          <p>{selectedHospital.type || 'General Hospital'}</p>
                        </div>
                      </div>
                      
                      <div className="info-item">
                        <Phone className="info-icon" />
                        <div>
                          <h4>Contact</h4>
                          <p>{selectedHospital.contact_info || 'Not available'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="services-section">
                      <h3>Services</h3>
                      <div className="tags-container">
                        {selectedHospital.services?.map((service, index) => (
                          <span key={index} className="service-tag">{service}</span>
                        )) || <p>No services listed</p>}
                      </div>
                    </div>
                    
                    <div className="facilities-section">
                      <h3>Facilities</h3>
                      <div className="tags-container">
                        {selectedHospital.facilities?.map((facility, index) => (
                          <span key={index} className="facility-tag">{facility}</span>
                        )) || <p>No facilities listed</p>}
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="right-sec">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <h3 className="doctors-title">
                      <User className="section-icon" />
                      Doctors Available
                    </h3>
                    
                    {selectedHospital.doctors?.length > 0 ? (
                      <ul className="doctors-list">
                        {selectedHospital.doctors?.map((doctor, index) => {
                          const doctorAttendanceEntry = attendance.find((entry) => entry.doctorId === doctor._id);
                          const lastCheckIn = doctorAttendanceEntry?.attendance?.check_in 
                            ? new Date(doctorAttendanceEntry.attendance.check_in).toLocaleTimeString()
                            : null;
                          
                          return (
                            <motion.li 
                              key={index} 
                              className="doctor-item"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                            >
                              <div className="doctor-header">
                                <h4 className="doctor-name">{doctor.doctor_name}</h4>
                                <span className="doctor-specialty">{doctor.specialization}</span>
                              </div>
                              
                              <div className="doctor-contact">
                                <span className="contact-item">
                                  <Phone size={14} />
                                  {doctor.phone}
                                </span>
                                <span className="contact-item">
                                  <span className="email-icon">✉️</span>
                                  {doctor.doctor_email}
                                </span>
                              </div>
                              
                              <div className="availability-section">
                                <div className={`availability-badge ${doctorAttendanceEntry?.available ? 'available' : 'unavailable'}`}>
                                  {doctorAttendanceEntry?.available ? (
                                    <>
                                      <CheckCircle size={16} />
                                      <span>Available</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle size={16} />
                                      <span>Not Available</span>
                                    </>
                                  )}
                                </div>
                                
                                {lastCheckIn && (
                                  <div className="last-checkin">
                                    <Clock size={14} />
                                    <span>Last checked in: {lastCheckIn}</span>
                                  </div>
                                )}
                              </div>
                            </motion.li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="no-doctors">No doctors available at this time</p>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
