// Import de la lib React
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Loading from 'src/components/Loading';

// Imports locaux
import './styles.scss';
import edit from '../../../public/img/icons/edit.svg';
import plus from '../../../public/img/icons/plus.svg';
import del from '../../../public/img/icons/delete.svg';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png';
import PlaylistInfo from '../PlaylistInfo';

const UserPlaylists = ({ baseURL }) => {

  let history = useHistory();

  // Init axios requests
  const api = axios.create({
    baseURL: baseURL
  });

  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [playlistLink, setPlaylistLink] = useState('');
  const [filter, setFilter] = useState('');
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {

    const wasPlaying = localStorage.getItem('playlist_id');

    if (wasPlaying) {
      window.location.reload();
      localStorage.removeItem('playlist_id');
    };

    document.title = "MAJA - Mes playlist";

    const token = localStorage.getItem('token');

    api.get(`/user/playlists`, {
      headers: {
        authorization: token
      }
    })
      .then((res) => {
        setUserPlaylists(res.data);
        setShowLoading(false);
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
        api.get('/user/playlists', {
          headers: {
            Authorization: token
          }
        })
          .then((res) => {
            setUserPlaylists(res.data);
          })
          .catch((err) => {
            console.log(err.response);
          })
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return(
    <div className="user-playlist-container">

      { showLoading &&
        <Loading />
      }

      <div className="user-playlist-add">
        <input 
          className="user-playlist-add-logo"
          name="create"
          id="create"
          type="image"
          src={plus}
          onClick={() => {
            history.push({
              pathname: '/create'
            })
          }}
        />
        <label className="user-playlist-add-label" htmlFor="create">
          Créer une playlist
        </label>
      </div>

      <div className="user-playlist-search">
        <input
          className="user-playlist-search-input"
          type="text"
          placeholder="Filtrer - Rechercher une playlist"
          onChange={(event) => {
            setFilter(event.target.value);
          }}
        />
      </div>
      
      <ul className="user-playlist-cards">

      { userPlaylists &&
        userPlaylists.map(playlist => {
            
          const name = playlist.name.toLowerCase();
          const search = filter.toLowerCase();

          const blackStars= [];
          const whiteStars= [];
          for(let i=0; i<playlist.rating; i++){
            blackStars.push('+1');
          }
          for(let j=0; j<5-playlist.rating; j++){
            whiteStars.push('+1')
          }

          if( name.includes(search) ) {
            return (
              <li className="user-playlist-card" key={playlist.id}>
                <a onClick={() => {
                  setPlaylistLink(playlist.id);
                  setShowDetails(true);
                }}>
                  { playlist.image ? (
                    <img className="user-playlist-card-logo" src={playlist.image} alt="user-playlist placeholder" />
                    ) : (
                    <img className="user-playlist-card-logo" src={imgDefault} alt="user-playlist placeholder" />
                    )
                  }
                  <h2 className="user-playlist-card-title">{playlist.name}</h2>
                  <div>
                    { blackStars &&
                      blackStars.map(e=>{
                        return(
                          <em>&#9733;</em>
                        )
                      })
                    }
                    { whiteStars &&
                      whiteStars.map(e=>{
                        return(
                          <em>&#9734;</em>
                        )
                      })
                    }
                  </div>
                </a>
                
                <div className="user-playlist-options">
                  <input className="user-playlist-options-edit" type="image" src={edit} onClick={() => {
                    history.push({
                      pathname: '/update',
                      state: { playlist }
                    })
                  }}/>
                  
                  <input
                    className="user-playlist-options-delete"
                    type="image"
                    src={del}
                    onClick={() => {
                      deletePlaylist(playlist.id, playlist.user_id);
                      }}
                  />
                </div>
              </li>
            )
          }
        })}
          
      </ul>

      {showDetails &&
        <PlaylistInfo
          baseURL={baseURL}
          playlistLink={playlistLink}
          setShowDetails={setShowDetails}
        />
      }
    </div>
  );
};

export default UserPlaylists;
