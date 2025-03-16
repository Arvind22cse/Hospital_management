import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Signin from './login/Signin.jsx';
import Dasboard from './dashboard/Dasboard.jsx';
import Doctordashboard from './dashboard/Doctordashboard.jsx';
import Signup from './login/Signup.jsx';
import Admindashboard from './dashboard/Admindashboard.jsx';
import AdminDoctor from './dashboard/AdminDoctor.jsx';
import AdminHospital from './dashboard/AdminHospital.jsx';
import AdminVaccine from './dashboard/AdminVaccine.jsx';
import AdminHosp from './dashboard/AdminHosp.jsx';

function Layout() {
  const location = useLocation();
  
  return (
    <div>
      {/* Show Navbar only on Dashboard (/) */}
      {location.pathname === '/' && <Navbar />}
      
      <Routes>
        
        <Route path="/" element={<Dasboard />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/doctor-dashboard" element={<Doctordashboard />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/admin" element={<Admindashboard/>}/>
        <Route path="/admindoctor" element={<AdminDoctor/>} />
        <Route path="/adminhospital" element={<AdminHospital/>}/>
        <Route path="/adminvaccine" element={<AdminVaccine/>}/>
        <Route path='/adminhosp' element={<AdminHosp/>}/>

      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
