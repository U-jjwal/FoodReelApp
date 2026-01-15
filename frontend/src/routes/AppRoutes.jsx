 import React from 'react'
 import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

 const AppRoutes = () => {
   return (
     <Router>
       <Routes>
         <Route path="/user/register" element={<UserRegister />} />
         <Route path="/user/login" element={<UserLogin />} />
         <Route path="/food-partner/register " element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
       </Routes>
     </Router>
   )
 }
 
 export default AppRoutes