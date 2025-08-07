// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import RegisterPage from './components/RegisterPage'; // benzer şekilde yazılacak
import HomePage from './components/HomePage';

function App() {
  const handleLogin = async ({ email, password, remember }) => {
    // API ile login işlemi yap, token'ı sakla ve yönlendir
    // localStorage.setItem('token', token) gibi
    navigate('/');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<AuthPage title="Hesabınıza Giriş Yapın" onSubmit={handleLogin} />}
        />
        <Route
          path="/register"
          element={<AuthPage title="Hesap Oluştur" onSubmit={handleRegister} />}
        />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
