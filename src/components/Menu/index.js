// Packages
import React, { useState } from 'react';
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

      <a href="/">
        <img src={logo} alt="Logo" className="menu-logo" />
      </a>

      <nav className="menu-buttons">

        <div className="menu-buttons-item">
          <img src={search} alt="Rechercher" className="menu-buttons-logo nav-closed"/>
          <a href="/search" className="menu-buttons-link nav-open">
          <img src={search} alt="Rechercher" className="menu-buttons-logo"/>
            Rechercher
          </a>
        </div>
{!logged && (         
        <div className="menu-buttons-item">
          <img src={avatar} alt="Connexion" className="menu-buttons-logo nav-closed"/>
          <a
            href="#"
            className="menu-buttons-link nav-open"
            onClick={() => {
              setShowModal(true);
            }}
          >
          <img src={avatar} alt="Connexion" className="menu-buttons-logo"/>
            Connexion
          </a>
        </div>
)}
{logged && (
        <div className="menu-buttons-item">
          <img src={avatar} alt="Profil" className="menu-buttons-logo nav-closed"/>
          <a href="/user" className="menu-buttons-link nav-open">
          <img src={avatar} alt="Profil" className="menu-buttons-logo"/>
            Profil
          </a>
        </div>
)}
{logged && (
        <div className="menu-buttons-item">
          <img src={musicalnote} alt="Playlists" className="menu-buttons-logo nav-closed"/>
          <a href="/user/playlists" className="menu-buttons-link nav-open">
          <img src={musicalnote} alt="Playlists" className="menu-buttons-logo"/>
            Playlists
          </a>
        </div>
)}
{isAdmin && (
        <div className="menu-buttons-item">
          <img src={admin} alt="Administration" className="menu-buttons-logo nav-closed"/>
          <a href="/admin" className="menu-buttons-link nav-open">
          <img src={admin} alt="Administration" className="menu-buttons-logo"/>
            Administration
          </a>
        </div>
)} 
        <div className="menu-buttons-item">
          <img src={glasses} alt="L'équipe" className="menu-buttons-logo nav-closed"/>
          <a href="/team" className="menu-buttons-link nav-open">
          <img src={glasses} alt="L'équipe" className="menu-buttons-logo"/>
            L'équipe
          </a>
        </div>

{logged && (
        <div className="menu-buttons-item">
          <img src={logout} alt="Déconnexion" className="menu-buttons-logo nav-closed"/>
          <a 
            href="/"
            className="menu-buttons-link nav-open"
            onClick={() => {
              localStorage.clear();
              setLogged(false);
            }}
          >
          <img src={logout} alt="Déconnexion" className="menu-buttons-logo"/>
            Déconnexion
          </a>
        </div>
)}
      </nav>

      <a href="/" className="menu-deezer">

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
