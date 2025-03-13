import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Navbar from './Navbar.jsx'

import Signin from './login/Signin.jsx'
import Dasboard from './dashboard/Dasboard.jsx'
import Doctordashboard from './dashboard/Doctordashboard.jsx'
export default function App() {
  return (
    <div>
     <BrowserRouter>
     {/* <Navbar/> */}
     <Routes>
      <Route path='/' element={<Dasboard/>}></Route>
      <Route path='/login' element={<Signin/>}></Route>
      <Route path='/doctor-dashboard' element={<Doctordashboard/>}/>
     </Routes>
     </BrowserRouter>

    </div>
  )
}
