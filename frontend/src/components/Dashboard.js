// frontend/src/components/Dashboard.js (КАРДАР ҮЧҮН ЖАҢЫЛАНДЫ)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Шилтеме түзүү үчүн
import './Dashboard.css'; 
import { FaStar } from 'react-icons/fa';

const Dashboard = () => {
  // Эң популярдуу товарды көрсөтүү үчүн API'ден маалымат алабыз
  const [popularItem, setPopularItem] = useState(null);

  useEffect(() => {
    // Биз мурда түзгөн статистика API'син колдонобуз
    fetch('https://food-order-backend.onrender.com/api/orders/dashboard-stats/')
      .then(response => response.json())
      .then(data => {
        setPopularItem(data.most_popular_item);
      })
      .catch(error => console.error("Статистиканы алууда ката:", error));
  }, []);

  return (
    <div className="dashboard-customer-view">

      <div className="welcome-banner">
        <img src="/logo.png" alt="Даяр улуттук дасторкон" className="main-logo" />
        <div className="welcome-text">
          <h1>"Даяр" улуттук дасторконуна кош келиңиз!</h1>
          <p>Даамдуу жана сапаттуу улуттук тамак-аштардын кеңири түрү.</p>
          <Link to="/food-order" className="action-button">
            Менюну көрүү
          </Link>
        </div>
      </div>

   
      <div className="dashboard-grid">
        <div className="info-card popular-item-card">
          <h3><FaStar /> Күндүн эң популярдуу тамагы</h3>
          {popularItem ? (
            <p className="popular-item-name">{popularItem}</p>
          ) : (
            <p>Жүктөлүүдө...</p>
          )}
          <p className="card-description">Биздин кардарлардын сүймөнчүгүнө ээ болгон даам!</p>
        </div>
        
        <div className="info-card promo-card">
          <h3>Атайын сунуш!</h3>
          <p className="promo-title">Эки самса алсаңыз, үчүнчүсү бекер!</p>
          <p className="card-description">Акция ушул жуманын аягына чейин гана уланат. Жетишип калыңыз!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;