// Packages
import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
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
import contact from '../../../public/img/nav/contact.svg';
import deezer from '../../../public/img/footer/deezer.jpg';

const Menu = ({ api, logged, isAdmin, setLogged, setIsAdmin }) => {

  let history = useHistory();

  const [showModal, setShowModal] = useState(false);

  const disconnect = () => {
    localStorage.clear();
    setLogged(false);
    setIsAdmin(false);
    history.push({
      pathname: '/'
    });
  };

  return (
    <section className="menu">
      <nav className="menu-buttons">

        <NavLink exact to="/" className="menu-logo" activeClassName="navActive">
          <img src={logo} alt="Logo du site" className="menu-logo-img"/>
        </NavLink>

        <NavLink exact to="/search" activeClassName="navActive" className="menu-buttons-link">
          <img src={search} alt="Rechercher" className="menu-buttons-logo"/>
          <p className="menu-buttons-name">Rechercher</p>
        </NavLink>
{!logged && (
        <NavLink
          exact to="#"
          className="menu-buttons-link"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <img src={avatar} alt="Connexion" className="menu-buttons-logo"/>
          <p className="menu-buttons-name">Connexion</p>
        </NavLink>
)}
{logged && (
        <NavLink exact to="/user" activeClassName="navActive" className="menu-buttons-link">
          <img src={avatar} alt="Profil" className="menu-buttons-logo"/>
          <p className="menu-buttons-name">Profil</p>
        </NavLink>
)}
{logged && (
        <NavLink exact to="/user/playlists" activeClassName="navActive" className="menu-buttons-link">
          <img src={musicalnote} alt="Playlists" className="menu-buttons-logo"/>
          <p className="menu-buttons-name">Playlists</p>
        </NavLink>
)}
{isAdmin && (
        <NavLink exact to="/admin" activeClassName="navActive" className="menu-buttons-link">
          <img src={admin} alt="Administration" className="menu-buttons-logo"/>
          <p className="menu-buttons-name">Administration</p>
        </NavLink>
)}
        <NavLink exact to="/team" activeClassName="navActive" className="menu-buttons-link">
          <img src={glasses} alt="L'équipe" className="menu-buttons-logo" />
          <p className="menu-buttons-name">L'équipe</p>
        </NavLink>

        <NavLink exact to="/contact" activeClassName="navActive" className="menu-buttons-link">
          <img src={contact} alt="Contact" className="menu-buttons-logo"/>
          <p className="menu-buttons-name">Contact</p>
        </NavLink>
{logged && (
        <NavLink 
          exact to="/"
          className="menu-buttons-link"
          onClick={() => {
            disconnect();
          }}
        >
          <img src={logout} alt="Déconnexion" className="menu-buttons-logo"/>
          <p className="menu-buttons-name">Déconnexion</p>
        </NavLink>
)}
      </nav>
      <section className="menu-deezer">
        <a 
          href="https://deezerbrand.com/"
          className="menu-deezer-link"
          target="_blank"
          rel="noreferrer"
        >
          <p className="menu-deezer-text">Powered by</p>
          <img src={deezer} className="menu-deezer-logo" alt="Logo de Deezer" />
        </a>
      </section>

{showModal && (
      <Modal 
        api={api}
        setShowModal={setShowModal}
        setLogged={setLogged}
        setIsAdmin={setIsAdmin}
      />
)}
    </section>
  );
};

Menu.propTypes = {
  logged: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  setLogged: PropTypes.func.isRequired,
  setIsAdmin: PropTypes.func.isRequired
};

export default Menu;