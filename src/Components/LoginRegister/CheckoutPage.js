import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const orderId = location.state?.orderId; // Sepet oluşturulurken backend'den dönen ID olmalı
  const totalAmount = cartItems.reduce((acc, item) => acc + Number(item.price), 0);

  const handleCashPayment = async () => {
    if (!orderId) {
      alert('Sipariş ID bulunamadı!');
      return;
    }

    const paymentData = {
      id: orderId,
      paymentMethod: 'Nakit',
      amount: totalAmount,
      paymentDate: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:8082/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        alert('Kapıda ödeme seçildi! Siparişiniz başarıyla oluşturuldu.');
        navigate('/success');
      } else {
        alert('Ödeme işlemi başarısız oldu.');
      }
    } catch (error) {
      console.error(error);
      alert('Sunucu hatası oluştu.');
    }
  };

  const handleCreditCard = () => {
    navigate('/credit-card', { state: { cartItems, orderId, totalAmount } });
  };

  return (
    <div className="checkout-form-container">
      <h2 style={{ color: 'red' }}>Ödeme Yöntemi</h2>

      <button onClick={handleCashPayment} className="pay-button">
        Kapıda Ödeme
      </button>

      <button onClick={handleCreditCard} className="pay-button">
        Kredi Kartı
      </button>
    </div>
  );
};

export default CheckoutPage;
