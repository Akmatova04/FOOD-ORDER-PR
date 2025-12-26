// frontend/src/components/Feedback.js
import React, { useState, useEffect } from 'react';
import './Feedback.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  // Пикирлерди серверден жүктөө
  useEffect(() => {
    fetch('https://food-order-backend.onrender.com/api/feedback/')
      .then(res => res.json())
      .then(data => setFeedbackList(data))
      .catch(err => console.error("Пикирлерди жүктөөдө ката:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newFeedback = { name, text };

    fetch('http://127.0.0.1:8000/api/feedback/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeedback)
    })
    .then(res => res.ok ? res.json() : Promise.reject('Пикир жөнөтүүдө ката кетти'))
    .then(savedFeedback => {

        setFeedbackList([savedFeedback, ...feedbackList]);
        confirmAlert({ title: 'Рахмат!', message: 'Сиздин пикириңиз кабыл алынды.', buttons: [{ label: 'Макул' }] });
        setName('');
        setText('');
    })
    .catch(error => alert(error));
  };

  return (
    <div className="feedback-page-grid">
      {/* Пикирлердин тизмеси */}
      <div className="feedback-list-container">
        <h1>Кардарлардын пикирлери</h1>
        <div className="feedback-list">
          {feedbackList.length > 0 ? feedbackList.map(fb => (
            <div key={fb.id} className="feedback-item">
              <p className="feedback-text">"{fb.text}"</p>
              <div className="feedback-footer">
                <span className="feedback-author">- {fb.name}</span>
                <span className="feedback-date">
                  {new Date(fb.created_at).toLocaleDateString('ky-KG')}
                </span>
              </div>
            </div>
          )) : <p>Азырынча пикирлер жок. Биринчи болуп сиз калтырыңыз!</p>}
        </div>
      </div>
      
  
      <div className="feedback-form-container">
        <h1>Сын-пикириңизди калтырыңыз</h1>
        <p>Биздин кызматтарды жакшыртууга жардам бериңиз.</p>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="name">Сиздин атыңыз</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="feedback">Сиздин пикириңиз</label>
            <textarea id="feedback" rows="6" value={text} onChange={e => setText(e.target.value)} required></textarea>
          </div>
          <button type="submit" className="submit-btn">Жөнөтүү</button>
        </form>
      </div>
    </div>
  );
};
export default Feedback;