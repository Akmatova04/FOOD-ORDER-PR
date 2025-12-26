// frontend/src/components/Sidebar.js

import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { IoFastFoodOutline } from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";
import { GoChecklist } from "react-icons/go";
import { LuMessageSquare } from "react-icons/lu";
import { MdOutlinePayments } from "react-icons/md";
import { FaImages } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo-text">"Даяр" улуттук дасторкон</h1>
      </div>
      <ul className="nav-menu">
        <li><NavLink end to="/" className="nav-link"><MdDashboard /> Башкаруу тактасы</NavLink></li>
        <li><NavLink to="/food-order" className="nav-link"><IoFastFoodOutline /> Тамак-аш заказ</NavLink></li>
        <li><NavLink to="/feedback" className="nav-link"><VscFeedback /> Сын-пикир</NavLink></li>

        <li><NavLink to="/order-history" className="nav-link"><GoChecklist /> Заказдар таржымалы</NavLink></li>
        <li><NavLink to="/payments" className="nav-link"><MdOutlinePayments /> Төлөм маалыматы</NavLink></li>
        <li><NavLink to="/gallery" className="nav-link"><FaImages /> Фуршет</NavLink></li>
      </ul>
      <div className="how-to-order-card">
        <h4>Кантип заказ берсе болот?</h4>
        <p>Биздин сайттан заказ берүү — бул сапатка, ылдамдыкка жана даамга болгон ишеним..</p>
      </div>
    </nav>
  );
};

export default Sidebar;