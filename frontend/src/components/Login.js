// frontend/src/components/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      username: username,
      password: password,
    };

    fetch('http://localhost:8000/api/accounts/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        // Эгер бэкендден ката келсе (мисалы, "логин же сырсөз туура эмес")
        throw new Error('Логин же сырсөз туура эмес.');
      }
    })
    .then(data => {
      console.log('Кирүү ийгиликтүү:', data);
      
      // Токенди жана колдонуучунун атын браузердин эсине сактоо
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', data.username);
      
      // Киргенден кийин дароо негизги бетке багыттоо
      navigate('/'); 
      // Баракчаны кайра жүктөө, ошондо Header жаңыланып, колдонуучунун аты чыгат
      window.location.reload(); 
    })
    .catch(error => {
      console.error('Кирүү катасы:', error);
      alert(error.message);
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Сайтка кирүү</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Колдонуучунун аты (логин)</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Логиниңизди жазыңыз" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Сырсөз</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Сырсөзүңүздү жазыңыз" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="auth-btn">Кирүү</button>
        </form>
        <p className="auth-switch">
          Аккаунтуңуз жокпу? <Link to="/register">Катталуу</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;