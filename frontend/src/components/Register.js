// frontend/src/components/Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      alert("Сырсөздөр дал келген жок!");
      return;
    }

    const registerData = {
      username: username,
      password: password,
    };

    // 1-КАДАМ: Каттоо API'син чакыруу
    fetch('https://food-order-backend.onrender.com/api/accounts/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    })
    .then(response => {
      if (response.ok) {
        // Каттоо ийгиликтүү болсо, эч нерсе кылбай, кийинки кадамга өтөбүз
        return response.json();
      } else {
        return response.json().then(err => { 
          throw new Error(err.username?.[0] || 'Каттоодо ката кетти.'); 
        });
      }
    })
    .then(data => {
      console.log('Каттоо ийгиликтүү:', data);
      
      // 2-КАДАМ: Автоматтык түрдө "Кирүү" (Login) API'син чакыруу
      const loginData = { username, password };
      return fetch('http://127.0.0.1:8000/api/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Катталды, бирок автоматтык кирүүдө ката кетти.');
        }
    })
    .then(data => {
        console.log('Автоматтык кирүү ийгиликтүү:', data);
        
        // 3-КАДАМ: Токенди сактап, негизги бетке багыттоо
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', data.username);
        
        navigate('/'); // Дароо негизги бетке багыттоо
        window.location.reload();
    })
    .catch(error => {
      console.error('Процессте ката кетти:', error);
      alert(error.message);
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Катталуу</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Колдонуучунун аты (логин)</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Ойлоп тапкан логинди жазыңыз" 
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
              placeholder="Кеминде 8 белгиден турсун" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password2">Сырсөздү кайталаңыз</label>
            <input 
              type="password" 
              id="password2" 
              placeholder="Сырсөздү кайра жазыңыз"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-btn">Катталуу</button>
        </form>
        <p className="auth-switch">
          Аккаунтуңуз барбы? <Link to="/login">Кирүү</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;