import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { FaMapMarkerAlt, FaSearch, FaShoppingCart, FaUserCircle } from 'react-icons/fa';

const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const MenuPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [mapPosition, setMapPosition] = useState({ lat: 38.3552, lng: 38.3332 });
  const [addressNote, setAddressNote] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const savedAddresses = [
    'Malatya, Battalgazi, İnönü Üniversitesi',
    'Malatya, Yeşilyurt, Fahri Kayahan',
    'Malatya, Merkez, Turgut Temelli',
  ];

  const navigate = useNavigate();

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${token}` },
    };
  };

  useEffect(() => {
    axios
      .get('http://localhost:8082/api/restaurants/getRestaurants', getAuthConfig())
      .then((res) => setRestaurants(res.data))
      .catch((err) => {
        console.error("Restoran verisi alınamadı:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Yetkisiz giriş. Lütfen tekrar giriş yapın.");
        }
      });
  }, []);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    axios
      .get(`http://localhost:8082/api/menus/restaurant/${restaurant.id}/items`, getAuthConfig())
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error("Menü verisi alınamadı:", err));
  };

  const handleAddToCart = (item) => setCartItems(prev => [...prev, item]);
  const handleRemoveFromCart = (index) => setCartItems(prev => prev.filter((_, i) => i !== index));
  const toggleCart = () => setCartOpen(!cartOpen);
  const toggleLocation = () => setLocationOpen(!locationOpen);
  const goToPaymentPage = () => navigate('/payment', { state: { cartItems } });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapPosition(coords);
      });
    } else {
      alert("Tarayıcınız konum hizmetini desteklemiyor.");
    }
  };

  const handleBack = () => {
    setSelectedRestaurant(null);
    setMenuItems([]);
  };

  return (
    <div>
      {/* Üst Panel */}
      <div className="panel">
        <div className="location-container" onClick={toggleLocation} style={{ cursor: 'pointer' }}>
          <FaMapMarkerAlt size={20} style={{ marginRight: '5px' }} />
          <span>
            {selectedAddress
              ? `Adres: ${selectedAddress}`
              : `Konum: ${mapPosition.lat.toFixed(4)}, ${mapPosition.lng.toFixed(4)}`}
          </span>
        </div>

        <div className="search-container">
          <input type="text" placeholder="Yemek ara..." />
          <FaSearch size={20} style={{ marginLeft: '10px' }} />
        </div>

        <div className="profile-container">
          <div className="cart-container" onClick={toggleCart} style={{ cursor: 'pointer' }}>
            <FaShoppingCart size={30} />
            <span>{cartItems.length}</span>
          </div>
          <div className="profile-container">
            <FaUserCircle size={30} />
            <span>Zeynep</span>
          </div>
        </div>
      </div>

      {/* Konum Paneli */}
      {locationOpen && (
        <div className="location-panel">
          <h3>Konum Seç</h3>
          <button onClick={getCurrentLocation} className="pay-button">📍 Otomatik Konum Al</button>
          <MapContainer center={mapPosition} zoom={13} style={{ height: '200px', width: '100%', marginTop: '10px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={mapPosition} icon={L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", iconSize: [30, 30] })} />
            <LocationMarker setPosition={setMapPosition} />
          </MapContainer>

          <textarea
            value={addressNote}
            onChange={(e) => setAddressNote(e.target.value)}
            placeholder="Adres tarifi giriniz..."
            rows={3}
            style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '5px' }}
          />

          <div className="saved-addresses">
            <h3>Kayıtlı Adresler</h3>
            <ul>
              {savedAddresses.map((address, idx) => (
                <li
                  key={idx}
                  className={selectedAddress === address ? 'selected' : ''}
                  onClick={() => setSelectedAddress(address)}
                  style={{ cursor: 'pointer', padding: '5px 0' }}
                >
                  {address}
                </li>
              ))}
            </ul>
            {selectedAddress && (
              <div className="selected-address-display" style={{ marginTop: '5px' }}>
                Seçilen adres: <strong>{selectedAddress}</strong>
              </div>
            )}
          </div>

          <button onClick={toggleLocation} className="pay-button" style={{ marginTop: '15px' }}>Kapat</button>
        </div>
      )}

      {/* Sepet */}
      {cartOpen && (
        <div className="cart-modal">
          <h2>Sepetim</h2>
          {cartItems.length === 0 ? (
            <p>Sepetiniz boş.</p>
          ) : (
            <ul>
              {cartItems.map((item, index) => (
                <li key={index}>
                  {item.name} - ₺{item.price}
                  <button onClick={() => handleRemoveFromCart(index)}>Kaldır</button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={toggleCart}>Kapat</button>
          <button onClick={goToPaymentPage} className="pay-button">Ödemeye Git</button>
        </div>
      )}

      {/* İçerik */}
      <div className="page-content">
        {selectedRestaurant ? (
          <div>
            <button className="back-button" onClick={handleBack}>← Geri</button>
            <h2>{selectedRestaurant.userName}</h2>
            <img src={`https://via.placeholder.com/400x200?text=${selectedRestaurant.userName}`} alt={selectedRestaurant.userName} />
            <h3>Menü</h3>
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  {item.name} - ₺{item.price}
                  <button className="add-to-cart-button" onClick={() => handleAddToCart(item)}>🛒 Sepete Ekle</button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="restaurant-list">
            {restaurants.map((r) => (
              <div key={r.id} className="restaurant-card" onClick={() => handleRestaurantClick(r)}>
                <img src={`https://via.placeholder.com/250x160?text=${r.userName}`} alt={r.userName} />
                <h3>{r.userName}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
