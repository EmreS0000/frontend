import React, { useState, useEffect } from 'react'; // useEffect ekledik

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import LoginRegister from './Components/LoginRegister/LoginRegister';
import MenuPage from './Components/LoginRegister/MenuPage';
import CheckoutPage from './Components/LoginRegister/CheckoutPage';
import CreditCardPage from './Components/LoginRegister/CreditCardPage';
import PaymentSuccessPage from './Components/LoginRegister/PaymentSuccessPage'; 
import RestaurantLogin from './Components/LoginRegister/RestaurantLogin';
import AddItem from './Components/LoginRegister/AddItem';
import RestaurantHome from './Components/LoginRegister/RestaurantHome';






function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userInfo, setUserInfo] = useState({}); 
 const [restaurantItems, setRestaurantItems] = useState(() => {
  const storedItems = localStorage.getItem('restaurantItems');
  return storedItems ? JSON.parse(storedItems) : [];
});
useEffect(() => {
  localStorage.setItem('restaurantItems', JSON.stringify(restaurantItems));
}, [restaurantItems]);



  return (
    <Router>
      <Routes>

        
        <Route 
          path="/" 
          element={
            isLoggedIn 
              ? <Navigate to="/menu" /> 
              : <LoginRegister setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} />
          } 
        />

     
        <Route 
          path="/menu" 
          element={
            isLoggedIn 
              ? <MenuPage userInfo={userInfo} /> 
              : <Navigate to="/" />
          } 
        />

        
        <Route 
          path="/payment" 
          element={
            isLoggedIn 
              ? <CheckoutPage /> 
              : <Navigate to="/" />
          } 
        />

       
        <Route 
          path="/credit-card" 
          element={
            isLoggedIn 
              ? <CreditCardPage /> 
              : <Navigate to="/" />
          } 
        />

        
        <Route 
          path="/success" 
          element={
            isLoggedIn 
              ? <PaymentSuccessPage userInfo={userInfo} /> 
              : <Navigate to="/" />
          } 
        />

        
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
        <Route
  path="/restaurant-home"
  element={<RestaurantHome items={restaurantItems} />}
/>

<Route
  path="/add-item"
  element={<AddItem setItems={setRestaurantItems} />}
/>

        <Route
         path="/restaurant-login"
          element={<RestaurantLogin setIsLoggedIn={setIsLoggedIn} />} />

      </Routes>
    </Router>
  );
}

export default App;
