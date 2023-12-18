import React, { useState, useEffect } from 'react';
import MainPage from './MainPage/MainPage';
import LoginPage from './Login/Login';
import RegisterPage from './Register/Register';  // Import the RegisterPage
import './App.css';
import axios from "axios";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegister, setIsRegister] = useState(false);  // Add this line

  // This effect runs when the component is mounted
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Replace '/check-token' with your protected endpoint
          const response = await axios.get('http://127.0.0.1:8000/auth/check-token', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);  // The empty array means this effect runs once when the component is mounted

  if (isLoading) {
    return <div>Loading...</div>;  // Replace this with your loading spinner or placeholder
  } else if (isLoggedIn) {
    return <MainPage onLogout={() => setIsLoggedIn(false)} />;
  } else if (isRegister) {
    return <RegisterPage onRegister={() => setIsLoggedIn(true)} goToLogin={() => setIsRegister(false)} />;
  } else {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} goToRegister={() => setIsRegister(true)} />;
  }
}

export default App;
