import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  useEffect(() => {
    // Kullanıcı bilgilerini getir
    axios.get('/api/users/me')
      .then(res => setForm(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.put('/api/users/update', form)
      .then(() => alert('Bilgiler güncellendi'))
      .catch(err => alert('Hata oluştu'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/loginregister');
  };

  return (
    <div className="profile-modal">
      <h3>Profil Bilgileri</h3>
      <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Ad Soyad" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="E-posta" />
      <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Telefon Numarası" />
      <input name="password" value={form.password} onChange={handleChange} placeholder="Yeni Şifre" type="password" />

      <button onClick={handleSave}>Kaydet</button>
      <button onClick={handleLogout}>Çıkış Yap</button>
      <button onClick={onClose}>Kapat</button>
    </div>
  );
};

export default ProfileMenu;
