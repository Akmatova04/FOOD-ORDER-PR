// frontend/src/components/PaymentDetails.js

import React from 'react';
import './PaymentDetails.css';
import { FaWhatsapp } from 'react-icons/fa';

const PaymentDetails = () => {
  // Сиздин WhatsApp номериңиз жана даяр билдирүү
  const whatsappNumber = '996990686854';
  const prefilledMessage = "Саламатсызбы, заказ боюнча жазып жатам. Бул менин төлөмүмдүн чеги.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledMessage)}`;

  return (
    <div className="payment-details-container">
      <h1>Төлөм маалыматы</h1>
      
      <div className="section">
        <h2>Төлөм жүргүзүү ыкмалары</h2>
        <p>Заказыңызды төмөнкү мобилдик капчыктар аркылуу QR кодду сканерлеп төлөсөңүз болот.</p>
        
        <div className="qr-codes-grid">
          {/* Бул жерге өзүңүздүн QR коддоруңуздун сүрөттөрүнүн аталышын жазыңыз */}
          {/* Сүрөттөр 'frontend/public/' папкасында болушу керек */}
          <div className="qr-card">
            <img src="/elsom_qr.png" alt="ЭЛСОМ QR коду" className="qr-image" />
            <h3 className="qr-title">ЭЛСОМ</h3>
            <p className="qr-instruction">ЭЛСОМ тиркемеси аркылуу сканерлеңиз</p>
          </div>
          
          <div className="qr-card">
            <img src="/megapay_qr.png" alt="MegaPay QR коду" className="qr-image" />
            <h3 className="qr-title">MegaPay</h3>
            <p className="qr-instruction">MegaPay тиркемеси аркылуу сканерлеңиз</p>
          </div>
        </div>
      </div>
      
      <div className="section">
        <h2>Маанилүү маалымат</h2>
        <p>Төлөмдү жүргүзгөндөн кийин, комментарийге заказыңыздын номерин жазууну унутпаңыз. Андан соң, төмөнкү баскычты басып, төлөмдүн чегин бизге WhatsApp аркылуу жөнөтүңүз.</p>
        
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="whatsapp-button"
        >
          <FaWhatsapp /> Чекти WhatsApp аркылуу жөнөтүү
        </a>
      </div>
    </div>
  );
};

export default PaymentDetails;