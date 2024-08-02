import React from 'react';
import '../styles/ContactUs.css';

const ContactUs = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-info">
          <h3>AAA</h3>
          <p>대표: 강민수 | 사업자등록번호: 000-00-00000</p>
          <p>주소: 서울특별시 xx구</p>
          <p>이메일: email@gmail.com</p>
        </div>
        <div className="footer-links">
          <a href="#">개인정보처리방침</a>
          <a href="#">이용약관</a>
          <a href="">KR</a>
        </div>
      </div>
    </footer>
  );
};

export default ContactUs;