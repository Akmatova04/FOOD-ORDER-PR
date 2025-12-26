// frontend/src/App.js

import React, { useState } from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom'; 

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MainContent from './components/MainContent';
import OrderHistory from './components/OrderHistory';
import PaymentDetails from './components/PaymentDetails';
import Feedback from './components/Feedback';
import Gallery from './components/Gallery';
import Login from './components/Login';
import Register from './components/Register';

const NotFound = () => <h1 style={{textAlign: 'center', marginTop: '50px'}}>404 - Баракча табылган жок</h1>;

const FoodOrderPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
      <Header onSearchChange={setSearchTerm} />
      <div className="main-content-grid">
        <MainContent searchTerm={searchTerm} /> 
      </div>
    </>
  );
};

function App() {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/register'];
  const showLayout = !noLayoutRoutes.includes(location.pathname);

  return (
    <div className={showLayout ? "app-container" : "auth-wrapper"}> 
      {showLayout && <Sidebar />}
      <main className={showLayout ? "main-content" : ""}>
        <Routes>
          <Route path="/" element={<Dashboard />} /> 
          <Route path="/food-order" element={<FoodOrderPage />} /> 
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/payments" element={<PaymentDetails />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;