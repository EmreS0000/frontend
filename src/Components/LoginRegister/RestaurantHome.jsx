import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RestaurantHome.css';

const RestaurantHome = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // navigate('/restaurant-login');
        return;
      }

      try {
        const profileRes = await axios.get('http://localhost:8082/api/restaurants/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const restaurantData = profileRes.data;
        setRestaurant(restaurantData);
        setFormData({
          email: restaurantData.email || '',
          phone: restaurantData.phone || '',
          address: restaurantData.address || '',
          password: '',
        });

        const itemsRes = await axios.get(`http://localhost:8082/api/menus/restaurant/${restaurantData.id}/items`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(itemsRes.data);

        const ordersRes = await axios.get('http://localhost:8082/api/orders/getAllOrders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(ordersRes.data);

      } catch (err) {
        console.error('API hatası:', err);

        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          // navigate('/restaurant-login');
        } else {
          alert("Sunucuya bağlanılamıyor. Lütfen tekrar deneyin.");
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleProfileChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    axios.put('http://localhost:8082/api/restaurants/profile', formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      alert('Profil güncellendi');
    })
    .catch(err => {
      alert('Profil güncelleme başarısız');
      console.error(err);
    });
  };

  if (!restaurant) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="restaurant-home-container">
      <div className="menu-section">
        <h3>Mevcut Menü</h3>
        <button onClick={() => navigate('/add-item')} className="add-item-btn">+ Yeni Menü Ekle</button>
        {items.length === 0 ? (
          <p>Henüz ürün yok.</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="menu-item">
              <strong>{item.name}</strong> - ₺{item.price}
            </div>
          ))
        )}
      </div>

      <div className="profile-section">
        <h3>Restoran Profili</h3>
        <form onSubmit={handleProfileSubmit} className="profile-form">
          <input name="email" placeholder="Email" value={formData.email} onChange={handleProfileChange} />
          <input name="phone" placeholder="Telefon" value={formData.phone} onChange={handleProfileChange} />
          <input name="address" placeholder="Adres" value={formData.address} onChange={handleProfileChange} />
          <input name="password" type="password" placeholder="Yeni Şifre" value={formData.password} onChange={handleProfileChange} />
          <button type="submit" className="update-btn">Güncelle</button>
        </form>
      </div>

      <div className="orders-section">
        <h3>Gelen Siparişler</h3>
        {orders.length === 0 ? (
          <p>Henüz sipariş yok.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <strong>{order.user?.email || "Bilinmeyen Müşteri"}</strong>: {order.ordersList?.map(item => item.productName).join(', ')} - ₺{order.totalPrice}
            </div>
          ))
        )}
      </div>

      <div className="image-upload-section">
        <h3>Restoran Resmi</h3>
        <input type="file" accept="image/*" />
      </div>
    </div>
  );
};

export default RestaurantHome;
