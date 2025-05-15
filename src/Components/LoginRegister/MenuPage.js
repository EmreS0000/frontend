import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // Token her seferinde dinamik alınmalı (örneğin kullanıcı değişirse)
  const getAuthConfig = () => {
    const token = localStorage.getItem("token"); // veya sessionStorage
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    axios
      .get('http://localhost:8082/api/restaurants/getRestaurants', getAuthConfig())
      .then(res => setRestaurants(res.data))
      .catch(err => {
        console.error("Restoranları getirirken hata:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Yetkisiz giriş. Lütfen tekrar giriş yapın.");
        }
      });
  }, []);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    axios
      .get(`http://localhost:8082/api/menus/restaurant/${restaurant.id}/items`, getAuthConfig())
      .then(res => setMenuItems(res.data))
      .catch(err => {
        console.error("Menü verisi alınamadı:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Menüyü görüntülemek için yetkiniz yok.");
        }
      });
  };

  const handleBack = () => {
    setSelectedRestaurant(null);
    setMenuItems([]);
  };

  if (selectedRestaurant) {
    return (
      <div>
        <button onClick={handleBack}>← Geri Dön</button>
        <h1>{selectedRestaurant.userName}</h1>
        <img
          src={`https://via.placeholder.com/400x200?text=${selectedRestaurant.userName}`}
          alt={selectedRestaurant.userName}
        />
        <h2>Menü</h2>
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              {item.name} - ₺{item.price}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h1>Restoranlar</h1>
      <ul>
        {restaurants.map(r => (
          <li
            key={r.id}
            style={{ cursor: 'pointer', margin: '10px 0' }}
            onClick={() => handleRestaurantClick(r)}
          >
            {r.userName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuPage;
