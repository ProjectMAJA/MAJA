// Import packages
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// Local imports
import './style.scss';
import del from '../../../public/img/icons/delete.svg';
import imgDefaultPlaylist from '../../../public/img/playlist/playlist-placeholder.png'
import imgDefaultUser from '../../../public/img/profil/default.png'

const Admin = ({ baseURL }) => {

  const [playlists, setPlaylists] = useState(null);
  const [playlistInput, setPlaylistInput] = useState('');
  const [users, setUsers] = useState(null);
  const [userInput, setUserInput] = useState('');
  
  // Init axios with our URL
  const api = axios.create({
    baseURL: baseURL
  });
  
  useEffect(() => {

    // Get playlists from database
    api.get('/playlists')
    .then((res) => {
      setPlaylists(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
    
    const token = localStorage.getItem('token');
    
    // Get users from database
    api.get('/users', {
      headers: {
        Authorization: token
      }
    })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      })
  }, []);

  const deletePlaylist = async (playlistID, userID) => {
    const token = localStorage.getItem('token');
 
    await api.delete(`/playlist`,
      {
      headers: {
        Authorization: token
      },
      data: {
        id: playlistID,
        user_id: userID
      }
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      })
  };

  const deleteUser = (id) => {
    const token = localStorage.getItem('token');

    api.delete(`/user/${id}`, {
      headers: {
        Authorization: token
      }
    })
      .then((res) => {
        console.log(res.data);
        api.get('/users', {
          headers: {
            Authorization: token
          }
        })
          .then((res) => {
            setUsers(res.data);
          })
          .catch((err) => {
            console.log(err);
          })
      })
      .catch((err) => {
        console.log(err);
      })
  };

  return (
    <div className="admin">
      <section className="admin-container">

        <h1>Playlists</h1>
        <hr />
        <input
          type="text"
          className="admin-container-input"
          placeholder="Rechercher une playlist"
          onChange={(event) => {
            setPlaylistInput(event.target.value);
          }}
        /> 

{ playlists &&
        playlists.map(playlist => {
          const title = playlist.name.toLowerCase();
          const search = playlistInput.toLowerCase();

          if ( title.includes(search) ) {
            return (
              <div key={playlist.id} className="admin-container-section">

                {playlist.image ? (
                            <img className="home-playlist-card-logo" src={playlist.image} alt="home-playlist placeholder" />
                          ) : (
                            <img className="home-playlist-card-logo" src={imgDefaultPlaylist} alt="home-playlist placeholder" />
                          )
                }
                <div className="admin-container-section-content">
                  <h2 className="admin-container-section-content-title"> {playlist.name} </h2>
                  <p className="admin-container-section-content-description"> {playlist.description} </p>
                </div>

                <input
                  type="image"
                  src={del}
                  className="admin-container-section-button"
                  onClick={() => {
                    deletePlaylist(playlist.id);
                  }}
                />
              </div>
            )
          }
        })
}
      </section>

      <section className="admin-container">

        <h1>Utilisateurs</h1>
        <hr />
        <input
          type="text"
          className="admin-container-input"
          placeholder="Rechercher un utilisateur"
          onChange={(event) => {
            setUserInput(event.target.value);
          }}
        /> 

{ users &&
        users.map(user => {
          const name = user.pseudo.toLowerCase();
          const search = userInput.toLocaleLowerCase();

          if ( name.includes(search) ) {
            return (
              <div key={user.id} className="admin-container-section">
                {user.avatar ? (
                            <img className="home-playlist-card-logo" src={user.avatar} alt="home-playlist placeholder" />
                          ) : (
                            <img className="home-playlist-card-logo" src={imgDefaultUser} alt="home-playlist placeholder" />
                          )
                }
                <div className="admin-container-section-content">
                  <h2 className="admin-container-section-content-title"> {user.pseudo} </h2>
                  <p className="admin-container-section-content-description"> {user.email} </p>
                </div>

                <input
                  type="image"
                  src={del}
                  className="admin-container-section-button"
                  onClick={() => {
                    deleteUser(user.id);
                  }}
                />
              </div>
            )
          }
        })
}
      </section>
    </div>
  )
};

Admin.propTypes = {
  baseURL: PropTypes.string.isRequired
};

export default Admin;



