// Packages
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// Components
import Modal from 'src/components/Menu/Modal';

// Styles
import './style.scss';

// Images
import logo from '../../../public/img/nav/logo.svg';
import avatar from '../../../public/img/nav/avatar.svg';
import glasses from '../../../public/img/nav/glasses.svg';
import logout from '../../../public/img/nav/logout.svg';
import search from '../../../public/img/nav/search.svg';
import musicalnote from '../../../public/img/nav/musical-note.svg';
import admin from '../../../public/img/nav/admin.svg';
import deezer from '../../../public/img/footer/deezer.jpg';

const Menu = ({ baseURL, logged, isAdmin, setLogged, setIsAdmin }) => {

  const [showModal, setShowModal] = useState(false);

  return (
    <section className="menu">

      <nav className="menu-buttons">

        <NavLink exact to="/" activeClassName="navActive" className="menu-logo">
          <img src={logo} alt="Logo du site" className="menu-logo-img"/>
        </NavLink>

        <div className="menu-buttons-item">
          <img src={search} alt="Rechercher" className="menu-buttons-logo nav-closed"/>
          <NavLink exact to="/search" activeClassName="navActive" className="menu-buttons-link nav-open">
          <img src={search} alt="Rechercher" className="menu-buttons-logo"/>
            <p className="menu-buttons-name">Rechercher</p>
          </NavLink>
        </div>
{!logged && (         
        <div className="menu-buttons-item">
          <img src={avatar} alt="Connexion" className="menu-buttons-logo nav-closed"/>
          <NavLink
            exact to="#"
            activeClassName="navActive"
            className="menu-buttons-link nav-open"
            onClick={() => {
              setShowModal(true);
            }}
          >
          <img src={avatar} alt="Connexion" className="menu-buttons-logo"/>
            <p className="menu-buttons-name">Connexion</p>
          </NavLink>
        </div>
)}
{logged && (
        <div className="menu-buttons-item">
          <img src={avatar} alt="Profil" className="menu-buttons-logo nav-closed"/>
          <NavLink exact to="/user" activeClassName="navActive" className="menu-buttons-link nav-open">
          <img src={avatar} alt="Profil" className="menu-buttons-logo"/>
            <p className="menu-buttons-name">Profil</p>
          </NavLink>
        </div>
)}
{logged && (
        <div className="menu-buttons-item">
          <img src={musicalnote} alt="Playlists" className="menu-buttons-logo nav-closed"/>
          <NavLink exact to="/user/playlists" activeClassName="navActive" className="menu-buttons-link nav-open">
          <img src={musicalnote} alt="Playlists" className="menu-buttons-logo"/>
            <p className="menu-buttons-name">Playlists</p>
          </NavLink>
        </div>
)}
{isAdmin && (
        <div className="menu-buttons-item">
          <img src={admin} alt="Administration" className="menu-buttons-logo nav-closed"/>
          <NavLink exact to="/admin" activeClassName="navActive" className="menu-buttons-link nav-open">
          <img src={admin} alt="Administration" className="menu-buttons-logo"/>
            <p className="menu-buttons-name">Administration</p>
          </NavLink>
        </div>
)} 
        <div className="menu-buttons-item team">
          <img src={glasses} alt="L'équipe" className="menu-buttons-logo nav-closed"/>
          <NavLink exact to="/team" activeClassName="navActive" className="menu-buttons-link nav-open">
          <img src={glasses} alt="L'équipe" className="menu-buttons-logo"/>
            <p className="menu-buttons-name">L'équipe</p>
          </NavLink>
        </div>

{logged && (
        <div className="menu-buttons-item">
          <img src={logout} alt="Déconnexion" className="menu-buttons-logo nav-closed"/>
          <NavLink 
            exact to="/"
            className="menu-buttons-link nav-open"
            activeClassName="navActive"
            onClick={() => {
              localStorage.clear();
              setLogged(false);
            }}
          >
          <img src={logout} alt="Déconnexion" className="menu-buttons-logo"/>
            <p className="menu-buttons-name">Déconnexion</p>
          </NavLink>
        </div>
)}
      </nav>

      <a 
        href="https://www.deezer.com/"
        className="menu-deezer"
        target="_blank"
        rel="noreferrer"
      >

        <img src={deezer} className="menu-deezer-logo" alt="Deezer" />
      </a>

{showModal && (
      <Modal baseURL={baseURL} setShowModal={setShowModal} setLogged={setLogged} setIsAdmin={setIsAdmin} />
)}

    </section>
  )
};

Menu.propTypes = {
  baseURL: PropTypes.string.isRequired,
  logged: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  setLogged: PropTypes.func.isRequired,
  setIsAdmin: PropTypes.func.isRequired
};

export default Menu;
