import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Admindashboard from './Admindashboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [phcs, setPhcs] = useState([]);
  const [selectedPhc, setSelectedPhc] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch doctors and PHCs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [doctorsRes, phcsRes] = await Promise.all([
          axios.get('http://localhost:3002/api/list-doctor'),
          axios.get('http://localhost:3002/api/list-phc')
        ]);
        setDoctors(doctorsRes.data);
        setPhcs(phcsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle PHC selection for each doctor
  const handlePhcChange = (doctorId, phcId) => {
    setSelectedPhc(prevState => ({ ...prevState, [doctorId]: phcId }));
  };

  // Add doctor to PHC
  const addDoctorToPhc = async (doctor) => {
    if (!selectedPhc[doctor._id]) {
      toast.warning('Please select a PHC');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3002/api/add-doctor-phc', {
        doctor_name: doctor.doctor_name,
        doctor_email: doctor.doctor_email,
        name: selectedPhc[doctor._id],
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error adding doctor to PHC:', error);
      toast.error('Failed to add doctor to PHC');
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => 
    doctor.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.doctor_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <Admindashboard />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Admindashboard />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="container-fluid px-4 py-3 mt-5 pt-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <h2 className="mb-3 mb-md-0">Manage Doctors</h2>
          <div className="w-100 w-md-50">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search doctors by name, specialization or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-people-fill fs-1 text-muted"></i>
            <p className="fs-5 mt-3">No doctors found</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4" >
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="col" style={{ marginBottom: "20px" }}>
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">{doctor.doctor_name}</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-envelope me-2"></i>
                        <span>{doctor.doctor_email}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-briefcase me-2"></i>
                        <span>{doctor.specialization}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor={`phc-select-${doctor._id}`} className="form-label">
                        Assign to PHC:
                      </label>
                      <select
                        id={`phc-select-${doctor._id}`}
                        className="form-select"
                        value={selectedPhc[doctor._id] || ''}
                        onChange={(e) => handlePhcChange(doctor._id, e.target.value)}
                      >
                        <option value="">Select PHC</option>
                        {phcs.map((phc) => (
                          <option key={phc._id} value={phc.name}>{phc.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent">
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => addDoctorToPhc(doctor)}
                      disabled={!selectedPhc[doctor._id]}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Assign to PHC
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDoctor;