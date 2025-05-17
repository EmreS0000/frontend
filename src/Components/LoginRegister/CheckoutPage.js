import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  const token = localStorage.getItem('token');
  const totalAmount = cartItems.reduce((acc, item) => acc + Number(item.price), 0);

  const handlePayment = async (method) => {
    if (!cartItems.length) {
      alert("Sepet boş!");
      return;
    }

    const orderData = {
      order: cartItems.map((item) => ({
        productName: item.name,
        quantity: 1,
        price: item.price,
      })),
      paymentMethod: method, // "Nakit" veya "Kredi Kartı"
      amount: totalAmount,
      paymentDate: new Date().toISOString(),
    };

    try {
      const response = await axios.post(
        'http://localhost:8082/api/orders/create',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Sipariş başarıyla oluşturuldu!');
        navigate('/success');
      } else {
        alert('Sipariş oluşturulamadı.');
      }
    } catch (error) {
      console.error('Sipariş hatası:', error);
      alert('Sunucu hatası!');
    }
  };

  return (
    <div className="checkout-form-container">
      <h2 style={{ color: 'red' }}>Ödeme Yöntemi</h2>

      <button onClick={() => handlePayment('Nakit')} className="pay-button">
        Kapıda Ödeme
      </button>

      <button onClick={() => handlePayment('Kredi Kartı')} className="pay-button">
        Kredi Kartı ile Ödeme
      </button>
    </div>
  );
};

export default CheckoutPage;
