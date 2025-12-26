import React, { useState, useEffect } from 'react';
import './OrderHistory.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Бул функция компонент жүктөлгөндө заказдарды серверден сурайт
  const fetchOrders = () => {
    setLoading(true);
    // Даректи туураладык: жергиликтүү сервер жана /api/orders/
    fetch('http://127.0.0.1:8000/api/orders/')
      .then(response => response.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Заказдар таржымалын алууда ката:", error);
        setLoading(false);
      });
  };

  // Компонент биринчи жолу көрсөтүлгөндө заказдарды жүктөө үчүн
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = (orderId) => {
    confirmAlert({
      title: 'Иш-аракетти ырастаңыз',
      message: 'Бул заказдан баш тарта турганыңызга ишенесизби?',
      buttons: [
        {
          label: 'Ооба, баш тартуу',
          onClick: () => proceedToCancel(orderId)
        },
        {
          label: 'Жок'
        }
      ],
      overlayClassName: "confirm-overlay"
    });
  };

  const proceedToCancel = (orderId) => {
    fetch(`http://127.0.0.1:8000/api/orders/${orderId}/cancel/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.error || 'Белгисиз ката') });
      }
      return response.json();
    })
    .then(updatedOrder => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
    })
    .catch(error => {
      console.error("Заказдан баш тартууда ката:", error);
      alert(`Ката: ${error.message}`);
    });
  };

  const getStatusInKyrgyz = (status) => {
    switch (status) {
      case 'pending': return 'Күтүүдө';
      case 'processing': return 'Аткарылууда';
      case 'delivered': return 'Жеткирилди';
      case 'cancelled': return 'Баш тартылды';
      case 'expired': return 'Мөөнөтү өттү';
      default: return status;
    }
  };

  if (loading) {
    return <h2 className="loading-text">Маалыматтар жүктөлүүдө...</h2>;
  }

  if (orders.length === 0) {
    return <h2 className="loading-text">Сизде азырынча заказдар жок.</h2>;
  }

  return (
    <div className="order-history-container">
      <h1>Заказдар таржымалы</h1>
      <table className="history-table">
        <thead>
          <tr>
            <th>Заказ №</th>
            <th>Датасы</th>
            <th>Товарлар</th>
            <th>Жалпы суммасы</th>
            <th>Статусу</th>
            <th>Аракет</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>№{order.id}</td>
              <td>{new Date(order.order_date).toLocaleDateString('ky-KG', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
              <td>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item.quantity} x {item.product ? item.product.name : 'Белгисиз товар'}</li>
                  ))}
                </ul>
              </td>
              <td>{parseFloat(order.total_amount).toFixed(2)} KGS</td>
              <td>
                <span className={`status-badge status-${order.status}`}>{getStatusInKyrgyz(order.status)}</span>
              </td>
              <td>
                {order.status === 'pending' && (
                  <button className="cancel-btn" onClick={() => handleCancelOrder(order.id)}>Баш тартуу</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;