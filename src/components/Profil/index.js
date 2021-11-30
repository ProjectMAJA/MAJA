// Import de la lib React
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Loading from 'src/components/Loading';
import ConfirmModal from '../ConfirmModal';

// Imports locaux
import imgDefault from '../../../public/img/profil/default.png';
import './styles.scss';

const Profil = ({ api, setLogged }) => {

  let history = useHistory();

  // DOM state
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorPassword, setShowErrorPassword] = useState(false);
  const [showErrorPseudo, setShowErrorPseudo] = useState(false);
  const [showErrorMail, setShowErrorMail] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // State values
  const [userID, setUserID] = useState();
  const [pseudo, setPseudo] = useState('');
  const [mail, setMail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChange, setPasswordChange] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(async () => {
    const wasPlaying = localStorage.getItem('playlist_id');

    if (wasPlaying) {
      window.location.reload();
      localStorage.removeItem('playlist_id');
    };

    document.title = "MAJA - Mon profil";

    // Get user informations with his token
    await api.get('/user')
      .then((res) => {
        // And set them in state
        setUserID(res.data.id);
        setPseudo(res.data.pseudo);
        setMail(res.data.email);
        setAvatar(res.data.avatar);
        setPassword(res.data.password);
        setShowLoading(false);
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (confirm === true) {
      deleteAccount();
    };
  }, [confirm]);

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

    if (canBeSend) {
      api.post(`/user`, {
        pseudo: pseudo,
        email: mail,
        password: password,
        avatar: avatar,
      })
        .then((res) => {
          localStorage.setItem('token', `bearer ${res.data.access_token}`);
          localStorage.setItem('refresh_token', `bearer ${res.data.refresh_token}`);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data === `duplicate key value violates unique constraint \"user_pseudo_key\"`) {
            setShowErrorPseudo(true);
          };
          if (err.response.data === `duplicate key value violates unique constraint "user_email_key"`) {
            setShowErrorMail(true);
          };
        });
    };
  };

  const deleteAccount = () => {
    // Clear the local storage
    localStorage.clear();

    // Delete user from database
    api.delete(`/user/${userID}`)
      .then((res) => {
        console.log(res.data);
        setLogged(false);
        history.push({
          pathname: '/'
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="profil">

      { showLoading &&
        <Loading />
      }

      <section className="profil-container"> 
        <div className="profil-header">
            <img 
              src={ avatar!=null ? avatar : imgDefault }
              className="profil-header-avatar"
            />
              <h2 className="profil-header-pseudo">{pseudo}</h2>
          </div>

        <div className="profil-info">
          <h3 className="profil-info-title">Modifier mes informations</h3>
          <hr />
            <p className="profil-info-item">Pseudo</p>
            { showErrorPseudo &&
              <p className="error">Ce pseudo est déjà pris</p>
            }
            <input
              className="profil-info-form-input"
              type="text"
              placeholder={pseudo}
              onChange={(event) => {
                setPseudo(event.target.value);
              }}
            />
            <p className="profil-info-item">Adresse mail</p>
            { showErrorMail &&
              <p className="error">Cette adresse email est déjà utilisée sur notre site</p>
            }
            <input
              className="profil-info-form-input"
              type="text"
              placeholder={mail}
              onChange={(event) => {
                setMail(event.target.value);
              }}
            />
            <p className="profil-info-item">URL de votre avatar</p>
            <input
              className="profil-info-form-input"
              type="text"
              placeholder={avatar ? avatar : 'URL de votre image'}
              onChange={(event) => {
                setAvatar(event.target.value);
              }}
            />
            <p className="profil-info-item">Mot de passe</p>
            { showErrorPassword &&
              <p className="error">Les deux mots de passe ne correspondent pas</p>
            }
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
                    className="profil-info-form-check-input"
                    type="checkbox"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                  Voir le mot de passe
                </label>

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

          <button 
            exact to='/'
            className="profil-info-delete-button"
            onClick={() => {
              setShowConfirmModal(true);
            }}>
              Supprimer mon compte
          </button>
          
        </div>
      </section>

      {showConfirmModal &&
        <ConfirmModal
          setShowConfirmModal={setShowConfirmModal}
          setConfirm={setConfirm}
          text='Voulez vous vraiment supprimer votre compte ?'
          span='Toutes les données et les playlists associées à ce compte seront perdues'
        />
      }
    </div>
  );
};

export default Profil;