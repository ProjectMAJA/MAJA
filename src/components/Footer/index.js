// Import de la lib React
import React from 'react';

// Imports NPM

// Imports locaux
import './styles.scss';
import logo from '../../../public/img/nav/logo.svg';
import oclock from '../../../public/img/footer/oclock.png';

const Footer = () => (
  <div className="footer-container">
    <div className="footer-container-top">
      <div className="footer-container-logo">
        <img src={logo} alt="logo de MAJA" />
        <span>MAJA</span>
      </div>
      <div className="footer-container-about">
        <h5>à propos</h5>
        <ul>
          <li>lorem ipsum</li>
          <li>lorem ipsum</li>
        </ul>
      </div>
      <div className="footer-container-info">
        <h5>où nous trouver</h5>
        <ul>
          <li>lorem ipsum</li>
          <li>lorem ipsum</li>
        </ul>
      </div>
    </div>
    <div className="footer-container-bottom">
      <img src={oclock} alt="logo d'oclock" />
      <h6>2021 - MAJA</h6>
    </div>
  </div>
);

export default Footer;
