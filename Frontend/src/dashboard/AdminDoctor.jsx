import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Admindashboard from './Admindashboard';

function AdminDoctor() {
  const [doctors, setDoctors] = useState([]);
  const [phcs, setPhcs] = useState([]);
  const [selectedPhc, setSelectedPhc] = useState({});

  // Fetch doctors
  useEffect(() => {
    axios.get('http://localhost:3000/api/list-doctor')
      .then(response => setDoctors(response.data))
      .catch(error => console.error('Error fetching doctors:', error));
  }, []);

  // Fetch PHCs
  useEffect(() => {
    axios.get('http://localhost:3000/api/list-phc')
      .then(response => setPhcs(response.data))
      .catch(error => console.error('Error fetching PHCs:', error));
  }, []);

  // Handle PHC selection for each doctor
  const handlePhcChange = (doctorId, phcId) => {
    setSelectedPhc(prevState => ({ ...prevState, [doctorId]: phcId }));
  };

  // Add doctor to PHC
  const addDoctorToPhc = async (doctor) => {
    if (!selectedPhc[doctor._id]) {
      alert('Please select a PHC');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/api/add-doctor-phc', {
        doctor_name: doctor.doctor_name,
        doctor_email: doctor.doctor_email,
        name: selectedPhc[doctor._id],
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error adding doctor to PHC:', error);
      alert('Failed to add doctor');
    }
  };

  return (
    <div>
      <Admindashboard />
      <h2 className="text-center mt-4">Manage Doctors</h2>
      <div className="container d-flex flex-wrap gap-3 justify-content-center" >
        {doctors.map((doctor) => (
          <div key={doctor._id} className="card p-3 shadow" style={{ width: '18rem' ,marginLeft:"30px"}}>
            <h5>{doctor.doctor_name}</h5>
            <p>Email: {doctor.doctor_email}</p>
            <p>Specialization: {doctor.specialization}</p>
            <select
              className="form-select mb-2"
              value={selectedPhc[doctor._id] || ''}
              onChange={(e) => handlePhcChange(doctor._id, e.target.value)}
            >
              <option value="">Select PHC</option>
              {phcs.map((phc) => (
                <option key={phc._id} value={phc.name}>{phc.name}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={() => addDoctorToPhc(doctor)}>
              Add Doctor to PHC
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDoctor;
