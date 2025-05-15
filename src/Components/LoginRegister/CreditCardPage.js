import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreditCardPage.css';

const CreditCardPage = () => {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('CARD'); // veya 'CASH'
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [amount, setAmount] = useState(''); // Tutar girişi
  const [orderId, setOrderId] = useState(''); // Ödeme yapılacak siparişin ID'si

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expireDate = `${expiryMonth.padStart(2, '0')}/${expiryYear}`;
    const paymentDate = new Date().toISOString(); // Backend LocalDateTime için uyumlu format

    const paymentData = {
      id: orderId,
      paymentMethod,
      cardHolderName: paymentMethod === 'CARD' ? nameOnCard : null,
      cardNumber: paymentMethod === 'CARD' ? cardNumber : null,
      expireDate: paymentMethod === 'CARD' ? expireDate : null,
      cvv: paymentMethod === 'CARD' ? cvv : null,
      paymentDate,
      amount
    };

    try {
      await axios.post('http://localhost:8082/api/payments', paymentData);
      navigate('/success');
    } catch (error) {
      console.error('Ödeme başarısız:', error);
      alert('Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="credit-card-page">
      <h2>Ödeme Bilgileri</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Sipariş ID</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Tutar (₺)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Ödeme Yöntemi</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="CARD">Kredi Kartı</option>
            <option value="CASH">Nakit</option>
          </select>
        </div>

        {paymentMethod === 'CARD' && (
          <>
            <div className="input-group">
              <label>Kart Numarası</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength="16"
                required
              />
            </div>

            <div className="input-group">
              <label>Son Kullanma Tarihi</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} required>
                  <option value="">Ay</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} required>
                  <option value="">Yıl</option>
                  {Array.from({ length: 10 }, (_, i) => 2025 + i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                maxLength="3"
                required
              />
            </div>

            <div className="input-group">
              <label>Kart Üzerindeki İsim</label>
              <input
                type="text"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="submit-btn">Ödeme Yap</button>
      </form>
    </div>
  );
};

export default CreditCardPage;
