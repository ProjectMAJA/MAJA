// Import de la lib React
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// Imports NPM
import axios from 'axios';

// Imports locaux
import './styles.scss';
import cancel from '../../../public/img/icons/cancel.svg';

const PlaylistInfo = ({ baseURL, playlistLink, setShowDetails }) => {

  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [playlistImg, setPlaylistImg] = useState('');

  // Set number of tracks
  const nbOfTracks = 10;

  // Init axios requests
  const api = axios.create({
    baseURL: baseURL
  });

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
      <div className="info-bloc">
        <section className="info-bloc-playlist">

          <img 
            src={playlistImg}
            className="info-bloc-playlist-img"
            alt="Image de la playlist"
          />

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
  )
};
  
PlaylistInfo.propTypes = {
  baseURL: PropTypes.string.isRequired,
  playlistLink: PropTypes.number.isRequired,
  setShowDetails: PropTypes.func.isRequired
};
  
export default PlaylistInfo;
