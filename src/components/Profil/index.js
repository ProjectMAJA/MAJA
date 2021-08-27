// Import de la lib React
import React, { useEffect, useState } from 'react';

// Imports NPM
import PropTypes from 'prop-types';
import axios from 'axios';

// Imports locaux
import imgDefault from '../../../public/img/profil/default.png';
import './styles.scss';

const Profil = ({ baseURL }) => {

  // DOM state
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorPassword, setShowErrorPassword] = useState(false);
  const [showErrorPseudo, setShowErrorPseudo] = useState(false);
  const [showErrorMail, setShowErrorMail] = useState(false);

  // State values
  const [userID, setUserID] = useState();
  const [pseudo, setPseudo] = useState('');
  const [mail, setMail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChange, setPasswordChange] = useState(false);

  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: baseURL
  });

  useEffect(() => {

    const wasPlaying = localStorage.getItem('playlist_id');

    if (wasPlaying) {
      window.location.reload();
      localStorage.removeItem('playlist_id');
    };


    document.title = "MAJA - Mon profil";

    // Get user informations with his token
    api.get('/user', {
      headers: {
        Authorization: token
      }
    })
      .then((res) => {
        // And set them in state
        setUserID(res.data.id);
        setPseudo(res.data.pseudo);
        setMail(res.data.email);
        setAvatar(res.data.avatar);
        setPassword(res.data.password);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  const handleSubmit = () => {

    setShowErrorMail(false);
    setShowErrorPassword(false);
    setShowErrorPseudo(false);

    let canBeSend = true;

    if (passwordChange) {
      
      if (password === confirmPassword) {
        canBeSend = true;
      } else {
        canBeSend = false;
        setShowErrorPassword(true);
      };
    };

    if ( canBeSend ) {
      api.post(`/user`, {
        pseudo: pseudo,
        email: mail,
        password: password,
        avatar: avatar,
      }, {
        headers: {
          Authorization: token
        }
      })
        .then((res) => {
          console.log(res.data);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data === `duplicate key value violates unique constraint \"user_pseudo_key\"`) {
            setShowErrorPseudo(true);
          }
          if (err.response.data === `duplicate key value violates unique constraint "user_email_key"`) {
            setShowErrorMail(true);
          }
        });

    }
  };

  const deleteAccount = () => {

    // Clear the local storage
    localStorage.clear();

    // Delete user from database
    api.delete(`/user/${userID}`, {
      headers: {
        Authorization: token
      }
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  return (
      <div className="profil">
        <div className="profil-header">
          <div className="profil-header-left">
            <img 
              src={ avatar!=null ? avatar : imgDefault}
              className="profil-header-avatar"
            />
          </div>
            <div className="profil-header-right">
              <h2>{pseudo}</h2>
          </div>
        </div>

        <div className="profil-info">
          <h3 className="profil-info-title">Modifier mes informations</h3>
          <hr />
            <input
              className="profil-info-form-input"
              type="text"
              placeholder={pseudo}
              onChange={(event) => {
                setPseudo(event.target.value);
              }}
            />
            <input
              className="profil-info-form-input"
              type="text"
              placeholder={mail}
              onChange={(event) => {
                setImage(event.target.value);
              }}
            />
            <input
              className="profil-info-form-input"
              type="text"
              placeholder={avatar ? avatar : 'URL de votre image'}
              onChange={(event) => {
                setAvatar(event.target.value);
              }}
            />
            <input
              className="profil-info-form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Nouveau mot de passe"
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordChange(true);
              }}
            />
            <input
              className="profil-info-form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Confirmer le nouveau mot de passe"
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setPasswordChange(true);
              }}
            />


                <label className="profil-info-form-check">
                  <input
                    type="checkbox"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                  Voir le mot de passe
                </label>


            { showErrorPassword &&
              <p className="error">Les deux mots de passe ne correspondent pas</p>
            }
            { showErrorMail &&
              <p className="error">Cette adresse email est déjà utilisée sur notre site</p>
            }
            { showErrorPseudo &&
              <p className="error">Ce pseudo est déjà pris</p>
            }
            <input
              className="profil-info-form-button"
              type="button"
              value="Enregistrer les modifications"
              onClick={() => {
                handleSubmit();
              }}
            />
        </div>

        <div className="profil-info-delete">

          <a 
            href='/'
            className="profil-info-delete-button"
            onClick={() => {
              deleteAccount();
            }}>
              Supprimer mon compte
          </a>
          
        </div>

      </div>
  )
};

Profil.propTypes = {
  baseURL: PropTypes.string.isRequired
};

export default Profil;




