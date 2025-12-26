
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { IoSearch } from 'react-icons/io5';
import { VscSettings } from "react-icons/vsc";
import { FiLogOut } from 'react-icons/fi'; // Чыгуу иконкасы

const Header = ({ onSearchChange }) => {
  const navigate = useNavigate();
  // Браузердин эсинен токенди жана колдонуучунун атын алуу
  const token = localStorage.getItem('authToken');
  const username = localStorage.getItem('username');

  // Чыгуу функциясы
  const handleLogout = () => {
    // Браузердин эсинен токенди жана колдонуучунун атын өчүрүү
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    alert("Сиз системадан ийгиликтүү чыктыңыз.");
    navigate('/login'); // "Кирүү" барагына багыттоо
    window.location.reload();
  };

  return (
    <header className="main-header">
      <div className="search-bar">
        <IoSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Тамак издөө..."
          onChange={(e) => onSearchChange(e.target.value)} 
        />
      </div>
      <div className="header-actions">
        <button className="filter-btn">
          <VscSettings /> Фильтр
        </button>

        {/* --- ШАРТТУУ КӨРСӨТҮҮ (Conditional Rendering) --- */}
        {token ? (
          // Эгер колдонуучу кирген болсо (токен бар болсо):
          <div className="user-profile">
            <img src={`https://i.pravatar.cc/40?u=${username}`} alt="User" />
            <span>{username}</span>
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut />
            </button>
          </div>
        ) : (
          // Эгер колдонуучу кире элек болсо (токен жок болсо):
          <Link to="/login" className="login-btn">Кирүү</Link>
        )}
      </div>
    </header>
  );
};
export default Header;