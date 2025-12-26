import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaMinus, FaTrash, FaExclamationTriangle, FaStar, FaFire } from 'react-icons/fa'; 
import { Tooltip } from 'react-tooltip';
import 'react-confirm-alert/src/react-confirm-alert.css';

const MainContent = ({ searchTerm, isPosMode = false }) => { 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Популярдуу');
  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/').then(res => res.json()).then(setProducts).catch(console.error);
    fetch('http://127.0.0.1:8000/api/categories/').then(res => res.json()).then(setCategories).catch(console.error);
  }, []);

  const displayedProducts = useMemo(() => {
    let filtered = [...products];
    if (activeCategory === 'Популярдуу') {
        filtered = filtered.filter(p => p.is_popular);
    } else if (activeCategory) {
        filtered = filtered.filter(p => p.category === activeCategory);
    }
    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filtered;
  }, [products, activeCategory, searchTerm]);

  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    return Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  };
  
  const handleCategoryClick = (categoryName) => setActiveCategory(categoryName);
  
  const handleLike = (productId) => {
    fetch(`http://127.0.0.1:8000/api/products/${productId}/like/`, { method: 'PATCH' })
      .then(res => res.json())
      .then(data => setProducts(ps => ps.map(p => p.id === productId ? { ...p, likes_count: data.likes_count } : p)));
  };
  
  const addToCart = (product) => {
    setCartItems(curr => {
      const existing = curr.find(i => i.id === product.id);
      if (existing) return curr.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...curr, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, amount) => {
    setCartItems(curr => curr.map(item => 
      item.id === itemId ? { ...item, quantity: item.quantity + amount } : item
    ).filter(item => item.quantity > 0));
  };
  
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Корзина бош!"); return;
    }
    if (isPosMode) {
      proceedToOrder("Дүкөндөн алынды (Касса)");
    } else {
      const deliveryAddress = prompt("Сураныч, жеткирүү дарегиңизди жазыңыз:");
      if (deliveryAddress && deliveryAddress.trim() !== '') {
        proceedToOrder(deliveryAddress);
      } else {
        alert("Дарек жазылбагандыктан заказ жокко чыгарылды.");
      }
    }
  };


  const proceedToOrder = (deliveryAddress) => {
    const orderData = {
      delivery_address: deliveryAddress,
      order_type: isPosMode ? 'offline' : 'online',
      total_amount: subTotal.toFixed(2),

      items: cartItems.map(item => ({ 
          product_id: item.id, 
          quantity: item.quantity, 
          price: item.price 
      }))
    };

    fetch('http://127.0.0.1:8000/api/orders/create/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })
    .then(res => {
  
      if (!res.ok) {
        return res.json().then(errorData => Promise.reject(errorData));
      }
      return res.json();
    })
    .then(data => {
      if (!isPosMode) {
        alert(`Сиздин заказыңыз #${data.id} ийгиликтүү кабыл алынды!`);
      }

      setCartItems([]);
    })
    .catch(error => {
     
      console.error('Заказ түзүүдө ката кетти:', error);
     
      alert('Заказ түзүүдө ката кетти. Кененирээк маалыматты консолдон караңыз.');
    });
  };

  const subTotal = useMemo(() => cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0), [cartItems]);
  
  return (
    <>
      <div className="menu-section">
        <header>
          <h1>{isPosMode ? 'Касса Менюсу' : 'Меню'}</h1>
          <div className="category-buttons">
            <div className={`category-card ${activeCategory === 'Популярдуу' ? 'active' : ''}`} onClick={() => handleCategoryClick('Популярдуу')}>
              <FaFire className="category-icon" /><span>Популярдуу</span>
            </div>
            {categories.map(cat => (
              <div key={cat.id} className={`category-card ${activeCategory === cat.name ? 'active' : ''}`} onClick={() => handleCategoryClick(cat.name)}>
                {cat.image && <img src={cat.image} alt={cat.name} className="category-icon" />}<span>{cat.name}</span>
              </div>
            ))}
          </div>
        </header>
        <div className='product-list'>
          {displayedProducts.map(product => {
            const daysLeft = getDaysRemaining(product.expiry_date);
            return (
              <div key={product.id} className='product-card' onClick={isPosMode ? () => addToCart(product) : undefined}>
                {product.is_expired && <div className="product-status status-expired">Мөөнөтү өткөн</div>}
                {product.expires_soon && (
                  <div className="product-status status-soon" data-tooltip-id="expiry-tooltip" data-tooltip-content={`Мөөнөтү ${daysLeft} күндөн кийин бүтөт`}>
                    <FaExclamationTriangle /> Жакында өтөт
                  </div>
                )}
                <img src={product.image} alt={product.name} />
                <h2>{product.name}</h2>
                <p className='product-description'>{product.description}</p>
                <div className="card-footer">
                  <p className='price'>{parseFloat(product.price).toFixed(2)} KGS</p>
                  {!isPosMode && <div className="like-section" onClick={(e) => { e.stopPropagation(); handleLike(product.id); }}><FaStar className="like-icon" /><span>{product.likes_count}</span></div>}
                  {!isPosMode && <button className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }}><FaPlus size={12} /> Кошуу</button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="invoice-section">
        <h2>{isPosMode ? 'Касса' : 'Эсеп-дүмүрчөк'}</h2>
        <div className="cart-items-list">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className='item-details'>
                <div className='item-info'>
                    <span className="item-name">{item.name}</span>
                    <span className="item-price-small">{(parseFloat(item.price) * item.quantity).toFixed(2)} KGS</span>
                </div>
                <div className="item-controls">
                  <button className="control-btn" onClick={() => updateQuantity(item.id, -1)}><FaMinus /></button>
                  <span className="item-quantity">{item.quantity}</span>
                  <button className="control-btn" onClick={() => updateQuantity(item.id, 1)}><FaPlus /></button>
                  <button className="control-btn remove-btn" onClick={() => updateQuantity(item.id, -item.quantity)}><FaTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="payment-summary">
          <h3>Төлөмдүн жыйынтыгы</h3>
          <div className="summary-line total">
            <span>Акыркы төлөм</span>
            <span>{subTotal.toFixed(2)} KGS</span>
          </div>
        </div>
        <button 
          className={isPosMode ? "place-order-btn cash-payment-btn" : "place-order-btn"} 
          onClick={handlePlaceOrder}
        >
          {isPosMode ? 'Төлөм кабыл алынды' : 'Азыр Заказ Берүү'}
        </button>
      </div>
      
      <Tooltip id="expiry-tooltip" place="top" effect="solid" />
    </>
  );
};

export default MainContent;