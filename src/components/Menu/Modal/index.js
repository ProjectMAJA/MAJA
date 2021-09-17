import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './style.scss';
import cancel from '../../../../public/img/icons/cancel.svg';

const Modal = ({ baseURL, setShowModal, setLogged, setIsAdmin }) => {

  const [showSignInForm, setShowSignInForm] = useState(true);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorSamePass, setShowErrorSamePass] = useState(false);
  const [showErrorIncomplete, setShowErrorIncomplete] = useState(false);
  const [showErrorPseudoTaken, setShowErrorPseudoTaken] = useState(false);
  const [showErrorMailTaken, setShowErrorMailTaken] = useState(false);
  const [showErrorWrongId, setShowErrorWrongId] = useState(false);

  const api = axios.create({ 
    baseURL: baseURL
  });

  const signInSubmit = (obj) => {
    api.post('/login', {
      pseudo: obj.pseudo.value,
      password: obj.password.value
    })
      .then((res) => {
        setLogged(true);
        setShowModal(false);
        localStorage.setItem('token', `bearer ${res.data.access_token}`);
        localStorage.setItem('refresh_token', `bearer ${res.data.refresh_token}`);
        if (res.data.isadmin === true) {
          setIsAdmin(true);
        };
        // window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setShowErrorWrongId(true);
      });
  };

  const signUpSubmit = (obj) => {
    // Reset error messages
    setShowErrorSamePass(false);
    setShowErrorPseudoTaken(false);
    setShowErrorMailTaken(false);
    setShowErrorIncomplete(false);

    if (obj.pseudo.value && obj.email.value && obj.password.value) {
      // Check if password & password's confirmation are the same
      if (obj.password.value === obj.confirmpassword.value) {

        // If true, send to back
        api.post('/user', {
          pseudo: obj.pseudo.value,
          email: obj.email.value,
          password: obj.password.value
        })
          .then((res) => {
            setLogged(true);
            setShowModal(false);
            // Set the tokens in the localStorage
            localStorage.setItem('token', `bearer ${res.data.access_token}`);
            localStorage.setItem('refresh_token', `bearer ${res.data.refresh_token}`);
            window.location.reload();
          })
          .catch((err) => {
            if (err.response.data === `duplicate key value violates unique constraint "user_pseudo_key"`) {
              setShowErrorPseudoTaken(true);
            } else if (err.response.data === `duplicate key value violates unique constraint "user_email_key"`) {
              setShowErrorMailTaken(true);
            };
          });
      } else {
        // If false, show error message
        setShowErrorSamePass(true);
      };
    } else {
      setShowErrorIncomplete(true);
    };
  };
  
  const selectSignInForm = () => {
    if (showSignUpForm) {
      setShowSignUpForm(false);
      setShowSignInForm(true);
    };
  };

  const selectSignUpForm = () => {
    if (showSignInForm) {
      setShowSignInForm(false);
      setShowSignUpForm(true);
    };
  };

  const showPass = () => {
    setShowPassword(!showPassword);
  };

  return (
      // If it's true, render the modal
      <section className="modal">
        <div className="modal-display">
 
          <section className="modal-display-buttons">
            <button
              className={ showSignInForm ? "modal-display-buttons-item selected" : "modal-display-buttons-item"}
              onClick={() => {
                selectSignInForm();
              }}
            >
              Se connecter
            </button>

            <button
              className={ showSignUpForm ? "modal-display-buttons-item selected" : "modal-display-buttons-item"}
              onClick={() => {
                selectSignUpForm();
              }}
            >
              S'inscrire
            </button>

            <div
              onClick={() => {
                setShowModal(false);
              }} className="modal-display-buttons-close"
            >
              <input
                type="image"
                src={cancel} 
                className="modal-display-buttons-close-button"
              />
            </div>
          </section>

          <section>
{ showSignInForm &&
            <form
              className="modal-display-form"
              onSubmit={(event) => {
                event.preventDefault();
                signInSubmit(event.target);
              }}
            >
              <input
                name="pseudo"
                className="modal-display-form-input"
                type="text"
                placeholder="Pseudo"
              />
              <input 
                name="password"
                className="modal-display-form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
              />
              <div className="modal-display-form-input">
                <label className="modal-display-form-check">
                  <input
                    className="modal-display-form-check"
                    type="checkbox"
                    onClick={showPass}
                  />
                  Voir le mot de passe
                </label>
              </div>
{ showErrorWrongId &&
              <span className="error">
                Cet identifiant ou ce mot de passe ne correspondent pas
              </span>
}

              <button
                className="modal-display-form-button"
                type="submit"
              >
                Connexion
              </button>

            </form>
}
            
{ showSignUpForm &&
            <form
              className="modal-display-form"
              onSubmit={(event) => {
                event.preventDefault();
                signUpSubmit(event.target);
              }}
            >
              <input
                name="pseudo"
                className="modal-display-form-input"
                type="text"
                placeholder="Pseudo"
              />
              <input
                name="email"
                className="modal-display-form-input"
                type="email"
                placeholder="Adresse email"
              />
              <input
                name="password"
                className="modal-display-form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
              />
              <input
                name="confirmpassword"
                className="modal-display-form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Confirmez votre mot de passe"
              />
{ showErrorIncomplete &&
              <span className="error">
                Veuillez remplir tous les champs
              </span>
}              
{ showErrorMailTaken &&
              <span className="error">
                Cet email est déjà enregistré sur notre site
              </span>
}
{ showErrorPseudoTaken &&
              <span className="error">
                Ce pseudo est déjà pris
              </span>
}
{ showErrorSamePass &&
              <span className="error">
                Les deux mots de passe ne correspondent pas
              </span>
}
              <div className="modal-display-form-input">
                <label className="modal-display-form-check">
                  <input
                    className="modal-display-form-check"
                    type="checkbox"
                    onClick={showPass}
                  />
                  Voir le mot de passe
                </label>
              </div>
              <button
                className="modal-display-form-button"
                type="submit"
              >
                S'inscrire
              </button>
            </form>
}
          </section>
        </div>
      </section>
  );
};

Modal.propTypes = {
  baseURL: PropTypes.string.isRequired,
  setShowModal: PropTypes.func.isRequired,
  setLogged: PropTypes.func.isRequired,
  setIsAdmin: PropTypes.func.isRequired
};

export default Modal;
