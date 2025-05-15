import React, { useState } from 'react';
import axios from 'axios';
import './LoginRegister.css';
import { FaUserCircle, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const RestaurantLogin = ({ setIsLoggedIn }) => {
  const [action, setAction] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: ''
  });

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8082/api/restaurants/login', loginData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      navigate("/restaurant-home");
    } catch (err) {
      alert("Restoran girişi başarısız!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8082/api/restaurants/register', registerData);
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      setAction('login');
    } catch (err) {
      alert("Restoran kaydı başarısız!");
    }
  };

  return (
    <div className="auth-page restaurant">
      <div className={`wrapper ${action !== 'login' ? 'active' : ''}`}>
        
        {/* GİRİŞ */}
        <div className={`form-box login ${action === 'login' ? 'visible' : 'hidden'}`}>
          <form>
            <h2>Restoran Girişi</h2>
            <div className="input-box">
              <FaEnvelope className="icon" />
              <input
                type="text"
                placeholder="E-posta"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>
            <div className="input-box">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Şifre"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            <button type="button" onClick={handleLogin}>Giriş Yap</button>
            <div className="register-link">
              <p>Restoran hesabınız yok mu? <a href="#" onClick={() => setAction('register')}>Kayıt Ol</a></p>
              <p><a href="/">← Kullanıcı Girişine Dön</a></p>
            </div>
          </form>
        </div>

        {/* KAYIT */}
        <div className={`form-box register ${action === 'register' ? 'visible' : 'hidden'}`}>
          <form onSubmit={handleRegister}>
            <h2>Restoran Kaydı</h2>
            <div className="input-box"><FaUserCircle className="icon" /><input type="text" placeholder="Restoran İsmi" value={registerData.username} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} /></div>
            <div className="input-box"><FaEnvelope className="icon" /><input type="email" placeholder="E-posta" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} /></div>
            <div className="input-box"><FaLock className="icon" /><input type="password" placeholder="Şifre" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} /></div>
            <div className="input-box"><input type="text" placeholder="Adres" value={registerData.address} onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })} /></div>
            <div className="input-box"><input type="text" placeholder="Telefon Numarası" value={registerData.phoneNumber} onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })} /></div>
            <button type="submit">Kayıt Ol</button>
            <div className="register-link">
              <p>Zaten hesabınız var mı? <a href="#" onClick={() => setAction('login')}>Giriş Yap</a></p>
              <p><a href="/">← Kullanıcı Girişine Dön</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;
