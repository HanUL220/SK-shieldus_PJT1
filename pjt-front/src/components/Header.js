import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../assets/images/logo.png';

const Header = ({ isLoggedIn, onLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <header className="header">
      <nav className="nav container-nav">
        <Link to="/" className="nav__logo">
          <img src={logo} alt="Logo" className="nav__logo-img" />
        </Link>
        <div className={`nav__menu ${menuVisible ? 'show-menu' : ''}`} id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item">
              <Link to="/" className="nav__link">
                <span>Home</span>
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/blog" className="nav__link">
                <span>Blog</span>
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/contactus" className="nav__link">
                <span>Contact Us</span>
              </Link>
            </li>
            {isLoggedIn ? (
              <li className="nav__item">
                <span className="nav__link" onClick={onLogout}>
                  <span>Logout</span>
                </span>
              </li>
            ) : (
              <li className="nav__item">
                <Link to="/login" className="nav__link">
                  <span>Login</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;