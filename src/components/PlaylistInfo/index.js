// Import de la lib React
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// Imports locaux
import './styles.scss';
import cancel from '../../../public/img/icons/cancel.svg';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png';

const PlaylistInfo = ({ api, playlistLink, setShowDetails }) => {

  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [playlistImg, setPlaylistImg] = useState('');

  useEffect(() => {
    // Get the selected playlist
    api.get(`/playlist/${playlistLink}`)
      .then((res) => {
        setPlaylistName(res.data.name);
        setPlaylistDescription(res.data.description);
        setPlaylistImg(res.data.image);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="info">
      <div 
        className="behind"
        onClick={() => {
          setShowDetails(false);
        }}
      ></div>
      <div className="info-bloc">
        <section className="info-bloc-playlist">

          {playlistImg ? 
            (
              <img className="info-bloc-playlist-img" src={playlistImg} alt="Image de votre playlist" />
            ) : (
              <img className="info-bloc-playlist-img" src={imgDefault} alt="Image par défaut d'une playlist" />
            )
          }
          <div className="info-bloc-playlist-text">
            <p className="info-bloc-playlist-text-title">{playlistName}</p>
            <p className="info-bloc-playlist-text-description">{playlistDescription}</p>
          </div>

          <div className="info-bloc-playlist-close">
            <input
              type="image"
              src={cancel}
              className="info-bloc-playlist-close-button"
              onClick={() => {
                setShowDetails(false);
              }}
            />
          </div>
        </section>

        <section className="info-bloc-play">
          <NavLink
            exact to="/game"
            className="info-bloc-play-button"
            onClick={() => {
              localStorage.setItem('playlist_id', playlistLink);
            }}
          >
            JOUER
          </NavLink>
        </section>
      </div>
    </div>
  );
};

PlaylistInfo.propTypes = {
  playlistLink: PropTypes.number.isRequired,
  setShowDetails: PropTypes.func.isRequired
};

export default PlaylistInfo;