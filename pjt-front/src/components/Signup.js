import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Signup.css';
import '../styles/LoginCommonStyles.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // 폼 제출 방지 (페이지 새로고침 방지 / JS로 데이터 처리 가능)

    if (password !== passwordConfirm) {
      alert('패스워드가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/joinProc', {
        username,
        password,
        passwordConfirm,
        name,
        email
      });
      console.log('Signup successful:', response.data);
      alert('회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login'); // 가입 성공 후 로그인 페이지로 리다이렉션
    } catch (error) {
      console.error('Signup failed:', error.response ? error.response.data : error.message);
      alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="signup-container">
      <div className="login-form">
        <h2 className="login-title">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">ID</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required // HTML 자동 유효성 검사
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required // HTML 자동 유효성 검사
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="passwordConfirm"
              className="form-control"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required // HTML 자동 유효성 검사
            />
          </div>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required // HTML 자동 유효성 검사
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required // HTML 자동 유효성 검사
            />
          </div>
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
        <div className="form-group">
          <Link to="/login" className="forgot-password">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;