import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddItem.css';

const AddItem = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Salad');
  const [price, setPrice] = useState('');
  const [restaurantId, setRestaurantId] = useState(null);

  // Sayfa yüklendiğinde restoran profilini al ve ID'yi set et
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Token bulunamadı. Lütfen giriş yapın.");
      navigate('/login'); // veya login sayfan
      return;
    }

    axios.get('http://localhost:8082/api/restaurants/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setRestaurantId(res.data.id);
    })
    .catch(err => {
      console.error("Restoran profili alınamadı", err);
      alert("Restoran profili alınamadı.");
    });
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!restaurantId) {
      alert('Restoran bilgisi alınamadı.');
      return;
    }

    const newItem = {
      name: productName,
      description: description,
      price: parseFloat(price),
      // image veya category backend'e gönderilmiyorsa dahil etme
    };

    axios.post(`http://localhost:8082/api/menus/restaurant/${restaurantId}/addItem`, newItem, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('Ürün eklendi');
      navigate('/restaurant-home');
    })
    .catch(err => {
      alert('Ürün eklenirken hata oluştu');
      console.error(err);
    });
  };

  return (
    <div className="add-item-container">
      <h2>Ürün Ekle</h2>
      <form onSubmit={handleSubmit} className="add-item-form">
        <label>Görsel Yükle:</label>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        {image && <img src={image} alt="Ürün Önizleme" className="preview-image" />}

        <label>Ürün Adı:</label>
        <input type="text" value={productName} onChange={e => setProductName(e.target.value)} required />

        <label>Açıklama:</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />

        <label>Kategori:</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="Salad">Salad</option>
          <option value="Pizza">Pizza</option>
          <option value="Burger">Burger</option>
        </select>

        <label>Fiyat (₺):</label>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />

        <button type="submit" className="submit-btn">Ekle</button>
      </form>
    </div>
  );
};

export default AddItem;
