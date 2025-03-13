import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Navbar from './Navbar.jsx'

import Signin from './login/Signin.jsx'
import Dasboard from './dashboard/Dasboard.jsx'
export default function App() {
  return (
    <div>
     <BrowserRouter>
     <Navbar/>
     <Routes>
      <Route path='/' element={<Dasboard/>}></Route>
      <Route path='/login' element={<Signin/>}></Route>
     </Routes>
     </BrowserRouter>

    </div>
  )
}
