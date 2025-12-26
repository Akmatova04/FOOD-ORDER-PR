// frontend/src/components/Gallery.js

import React, { useState, useEffect } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/gallery/')
      .then(res => res.json())
      .then(data => {
        setGalleryItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Галереяны жүктөөдө ката:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Галерея жүктөлүүдө...</h2>;
  }

  if (galleryItems.length === 0) {
    return (
        <div className="gallery-container">
            <h1>Фуршет жана Банкеттер</h1>
            <p>Азырынча бул жерде сүрөт же видео жок. Сураныч, админ-панелден кошуңуз.</p>
        </div>
    );
  }

  return (
    <div className="gallery-container">
      <h1>Фуршет жана Банкеттер</h1>
      <p>Биздин мурунку иштерибизден сүрөттөр жана видеолор. Биз сиздин ар бир майрамыңызды унутулгус кылууга даярбыз!</p>
      
      <div className="gallery-grid">
        {galleryItems.map((item) => (
          <div key={item.id} className="gallery-card">
            <div className="media-container">
              {/* =========================================================================
                  === АКЫРКЫ ОҢДОО: Текшерүүнү 'Сүрөт' эмес, 'image' деп өзгөрттүк ===
                  ========================================================================= */}
              {item.item_type === 'image' && item.image ? (
                <img src={item.image} alt={item.title} />
              ) : item.item_type === 'video' && item.video ? (
                <video controls>
                  <source src={item.video} type="video/mp4" />
                  Сиздин браузериңиз видеону колдобойт.
                </video>
              ) : (
                <div className="media-placeholder">Сүрөт/видео жок</div>
              )}
            </div>
            <h3 className="gallery-item-title">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;