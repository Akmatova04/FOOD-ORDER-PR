

import React from 'react';
import './Contact.css'; // Бул CSS файлды кийинки кадамда түзөбүз
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Биз менен байланыш</h1>
      
      <div className="contact-grid">
        {/* Сол бөлүк: Маалыматтар */}
        <div className="contact-info">
          <h2>"Даяр" улуттук дасторкон</h2>
          <p>Дайыма жаңы, даамдуу жана сапаттуу тамак-аштар.</p>
          
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <div>
              <strong>Дарегибиз:</strong>
              <span>Ош шаары, Курманжан Датка көчөсү, 215</span>
            </div>
          </div>
          
          <div className="info-item">
            <FaPhone className="info-icon" />
            <div>
              <strong>Телефон:</strong>
              <span>+996 990 686 854</span>
            </div>
          </div>
          
          <div className="info-item">
            <FaClock className="info-icon" />
            <div>
              <strong>Иштөө убактысы:</strong>
              <span>Дүйшөмбү - Жекшемби, 09:00 - 22:00</span>
            </div>
          </div>
        </div>
        
        {/* Оң бөлүк: Карта */}
        <div className="contact-map">
          {/* Google Maps'тен алынган "Embed a map" коду */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2937.161421298458!2d72.781602315451!3d40.529999979352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bdad83b3734617%3A0x275e777f1f41b4a0!2z0JzQtdC20LTRg9C90LDRgNCw0YLQtdC8!5e0!3m2!1sen!2skg!4v1668581634785!5m2!1sen!2skg" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Биздин дарек"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;