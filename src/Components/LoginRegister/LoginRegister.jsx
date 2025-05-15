import React, { useState } from 'react';
import axios from 'axios';
import './LoginRegister.css';
import { FaUserCircle, FaLock, FaEnvelope } from "react-icons/fa";

const LoginRegister = ({ setIsLoggedIn }) => {
  const [action, setAction] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', username: '', password: '' });
  const [errors, setErrors] = useState({});

  const validateFields = (fields) => {
    const newErrors = {};
    for (const key in fields) {
      if (!fields[key]) {
        newErrors[key] = true;
      }
    }
    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validateFields(loginData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await axios.post('http://localhost:8082/api/users/login', loginData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
    } catch (err) {
      alert("Giriş başarısız! Bilgilerinizi kontrol edin.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields(registerData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      await axios.post('http://localhost:8082/api/users/register', registerData);
      alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      setAction('login');
    } catch (err) {
      alert("Kayıt başarısız! Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="auth-page">
      <div className={`wrapper ${action !== 'login' ? 'active' : ''}`}>

        {/* Login */}
        <div className={`form-box login ${action === 'login' ? 'visible' : 'hidden'}`}>
          <form>
            <h2>SöyleGelsin</h2>
            <div className={`input-box ${errors.email ? 'error' : ''}`}>
              <FaEnvelope className='icon' />
              <input
                type="text"
                placeholder='E-posta'
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>
            <div className={`input-box ${errors.password ? 'error' : ''}`}>
              <FaLock className='icon' />
              <input
                type="password"
                placeholder='Şifre'
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            <div className="remember-forgot">
              <label><input type="checkbox" />Beni Hatırla</label>
              <a href="#" onClick={() => setAction('forgot')}>Parolamı Unuttum</a>
            </div>
            <button type="button" onClick={handleLogin}>Giriş Yap</button>
            <div className="register-link">
              <p>Hala kayıt olmadın mı? <a href="#" onClick={() => setAction('register')}>Kayıt Ol</a></p>
              <p>Restoran sahibi misin? <a href="/restaurant-login">Restoran Girişi Yap</a></p>
            </div>
          </form>
        </div>

        {/* Register */}
        <div className={`form-box register ${action === 'register' ? 'visible' : 'hidden'}`}>
          <form onSubmit={handleRegister}>
            <h2>Kayıt Ol</h2>
            <div className={`input-box ${errors.email ? 'error' : ''}`}>
              <FaEnvelope className='icon' />
              <input
                type="text"
                placeholder='E-posta Adresi'
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>
            <div className={`input-box ${errors.username ? 'error' : ''}`}>
              <FaUserCircle className='icon' />
              <input
                type="text"
                placeholder='Kullanıcı İsmi'
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              />
            </div>
            <div className={`input-box ${errors.password ? 'error' : ''}`}>
              <FaLock className='icon' />
              <input
                type="password"
                placeholder='Şifre'
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
            </div>
            <div className="remember-forgot">
              <label><input type="checkbox" />Kampanyalardan haberdar olmak istiyorum</label>
            </div>
            <button type="submit">Kayıt Ol</button>
            <div className="register-link">
              <p>Hesabım var mı? <a href="#" onClick={() => setAction('login')}>Giriş Yap</a></p>
              <p>Restoran sahibi misin? <a href="/restaurant-login">Restoran Girişi Yap</a></p>
            </div>
          </form>
        </div>

        {/* Forgot */}
        <div className={`form-box forgot ${action === 'forgot' ? 'visible' : 'hidden'}`}>
          <form>
            <h1>Şifremi Unuttum</h1>
            <div className="input-box">
              <FaEnvelope className='icon' />
              <input type="text" placeholder='E-posta Adresi' required />
            </div>
            <button type="submit">Şifre Sıfırla</button>
            <div className="register-link">
              <p>Giriş yapmak ister misin? <a href="#" onClick={() => setAction('login')}>Giriş Yap</a></p>
              <p>Hesabın yok mu? <a href="#" onClick={() => setAction('register')}>Kayıt Ol</a></p>
              <p>Restoran sahibi misin? <a href="/restaurant-login">Restoran Girişi Yap</a></p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LoginRegister;
