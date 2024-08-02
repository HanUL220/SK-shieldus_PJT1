import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import ContactUs from './components/ContactUs';
import BoardPreview from './components/BoardPreview';
import BoardList from './Board/BoardList';
import BoardWrite from './Board/BoardWrite';
import BoardDetail from './Board/BoardDetail';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // 페이지를 새로고침하거나 브라우저를 닫았다가 다시 열더라도 로그인 상태와 사용자 이름을 유지
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    if (storedLoginStatus === 'true' && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  return (
    <Router>
      <div className="App">
        <Header isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/blog' element={<BoardList isLoggedIn={isLoggedIn} />} />
          <Route path='/write' element={<BoardWrite />} />
          <Route path='/detail/:boardIdx' element={<BoardDetail username={username} />} />
          <Route path="/preview/:boardIdx/:fileIdx" element={<BoardPreview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;