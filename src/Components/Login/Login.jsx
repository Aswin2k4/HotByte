import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { Logo } from '../../assets';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ message: '', show: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Basic validation
      if (!credentials.email || !credentials.password) {
        throw new Error('Please fill in all fields');
      }

      // Email validation
      if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
        throw new Error('Please enter a valid email address');
      }

      // API call would go here
      // const response = await userLoginAPICall(credentials);
      // For demo purposes, we'll simulate a successful login
      setTimeout(() => {
        // On successful login
        sessionStorage.setItem('user', JSON.stringify({ email: credentials.email }));
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      setError({ message: err.message, show: true });
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closeError = () => {
    setError(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="bg-animation">
        {[...Array(3)].map((_, i) => (
          <div key={`bubble-${i+1}`} className={`bubble bubble-${i+1}`} />
        ))}
      </div>

      {/* Login Card */}
      <div className="login-card">
        <div className="logo">
          <img 
            src={Logo} 
            alt="HotByte Logo" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-logo.png'; // Fallback image
            }}
          />
        </div>
        
        <h2>Login to HotByte</h2>
        <p>Get access to your orders, offers, and more!</p>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <input 
              type="email" 
              name="email"
              placeholder="Enter Email" 
              required 
              value={credentials.email}
              onChange={handleChange}
              autoComplete="username"
            />
            <FaEnvelope className="icon" />
          </div>
          
          <div className="input-group">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Enter Password" 
              required 
              value={credentials.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <FaLock className="icon" />
            <button 
              type="button" 
              className="toggle-password" 
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="footer-links">
          <a href="/forgot-password">Forgot Password?</a>
          <span>•</span>
          <a href="/signup">New User? Sign Up</a>
        </div>
      </div>

      {/* Error Popup */}
      {error.show && (
        <div className="popup">
          <div className="popup-content">
            <button 
              className="close-btn" 
              onClick={closeError}
              aria-label="Close error message"
            >
              <FaTimes />
            </button>
            <p>{error.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;