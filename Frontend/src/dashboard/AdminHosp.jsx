import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Import icons
import './AdminHosp.css';
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
  const [showDetails, setShowDetails] = useState(false);

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
    // Set the selected hospital data to pre-fill the form
    setSelectedHospital(hospital);
    setNewHospital({
      name: hospital.name || '',
      location: hospital.location || '',
      type: hospital.type || '',
      contact_info: hospital.contact_info || '',
      services: hospital.services.join(', ') || '', // Assuming services are stored as an array
      facilities: hospital.facilities.join(', ') || '', // Assuming facilities are stored as an array
      alerts: hospital.alerts.join(', ') || '', // Assuming alerts are stored as an array
      additional_services: hospital.additional_services.join(', ') || '', // Assuming additional services are stored as an array
      basic_services: hospital.basic_services.join(', ') || '' // Assuming basic services are stored as an array
    });
    setIsAdding(true);
  };
  useEffect(() => {
    handleFilterChange();
  }, [locationFilter, serviceFilter]);
  

  const handleAdd = () => {
    setSelectedHospital(null);
    setIsAdding(true);
  };

  const handleFormChange = (e) => {
    setNewHospital({ ...newHospital, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedHospital) {
        // Update existing hospital
        await axios.put(`http://localhost:3000/api/admin/uphc/${selectedHospital._id}`, newHospital);
        alert("Hospital updated successfully!");
      } else {
        // Add new hospital
        await axios.post("http://localhost:3000/api/admin/add-phc", newHospital);
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
      <Admindashboard/>
      <div className='dashboard-wrapper'>
        <div className='left-section'>
          <div className='dashboard-container'>
            <h2>Hospitals</h2>

            <button className='add-btn' onClick={handleAdd}>
              <FaPlus /> Add Hospital
            </button>
<br /><br />
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
                  <button onClick={() => { setSelectedHospital(hospital); setShowDetails(true); }}>
  Read More
</button>

                  <div className='hospital-actions' style={{marginTop:'10px'}}>
                    <FaEdit id='edit' className='edit-icon' onClick={() => handleUpdate(hospital)} style={{width:'100px',cursor:'pointer'}}/>
                    <FaTrash className='delete-icon' onClick={() => handleDelete(hospital._id)} style={{width:'100px',cursor:'pointer'}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {showDetails && selectedHospital && (
  <div className="modal-overlay" onClick={() => setShowDetails(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={() => setShowDetails(false)}>X</button>
      <h2>{selectedHospital.name}</h2>
      <p><strong>Location:</strong> {selectedHospital.location}</p>
      <p><strong>Type:</strong> {selectedHospital.type}</p>
      <p><strong>Contact:</strong> {selectedHospital.contact_info}</p>
      <p><strong>Services:</strong> {selectedHospital.services.join(', ')}</p>
      <p><strong>Facilities:</strong> {selectedHospital.facilities.join(', ')}</p>
    </div>
  </div>
)}

        
        {isAdding && (
          <div 
            className='modal-overlay' 
            onClick={() => setIsAdding(false)} 
            style={{
              position: 'fixed',
              top: 70,  // Set the modal to show 100px down from the top
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10
            }}
          >
            <div 
              className='modal-content' 
              onClick={(e) => e.stopPropagation()} 
              style={{
                backgroundColor: '#fff',
                padding: '30px',
                width: '400px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                position: 'relative'
              }}
            >
              <button 
                className='close-btn' 
                onClick={() => setIsAdding(false)} 
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'red',
                  
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                X
              </button>
              <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>
                {selectedHospital ? "Update Hospital" : "Add Hospital"}
              </h2>
              <form className='form' onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
  <input
    type="text"
    name="name"
    className='form-input'
    placeholder="Hospital Name"
    value={newHospital.name}
    onChange={handleFormChange}
    required
    
  />
  <input
    type="text"
    name="location"
    className='form-input'
    placeholder="Location"
    value={newHospital.location}
    onChange={handleFormChange}
    required
  />
  <input
    type="text"
    name="type"
    className='form-input'
    placeholder="Type (e.g., PHC, Clinic)"
    value={newHospital.type}
    onChange={handleFormChange}
    required
  />
  <input
    type="text"
    name="contact_info"
    className='form-input'
    placeholder="Contact Info"
    value={newHospital.contact_info}
    onChange={handleFormChange}
    required
  />
  <input
    type="text"
    name="services"
    className='form-input'
    placeholder="Services (comma-separated)"
    value={newHospital.services}
    onChange={handleFormChange}
    required
  />
  <input
    type="text"
    name="facilities"
    className='form-input'
    placeholder="Facilities (comma-separated)"
    value={newHospital.facilities}
    onChange={handleFormChange}
    required
  />
  <input
    type="text"
    name="alerts"
    className='form-input'
    placeholder="Alerts (comma-separated)"
    value={newHospital.alerts}
    onChange={handleFormChange}
  />
  <input
    type="text"
    name="additional_services"
    className='form-input'
    placeholder="Additional Services (comma-separated)"
    value={newHospital.additional_services}
    onChange={handleFormChange}
  />
  <input
    type="text"
    name="basic_services"
    className='form-input'
    placeholder="Basic Services (comma-separated)"
    value={newHospital.basic_services}
    onChange={handleFormChange}
    required
  />
  <button
    type="submit"
    className='form-button'
    style={{
      backgroundColor: '#007BFF',
      color: 'white',
      padding: '12px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    }}
  >
    Save
  </button>
</form>

            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminHosp;
