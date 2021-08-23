// Import de la lib React
import React, { useEffect, useState } from 'react';
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
        
        <div className="info-bloc-img">
          <img src={playlistImg} className="info-bloc-img-playlist"/>
        </div>

        <div className="info-bloc-right">
          <div className="info-bloc-right-top">
            <h1 className="info-bloc-right-top-title"> {playlistName} </h1>
    
            <div className="info-bloc-right-top-close">
              <input
                type="image"
                src={cancel}
                className="info-bloc-right-top-close-button" 
                onClick={() => {
                  setShowDetails(false);
                }}
              />
            </div>
          </div>
  
          <div className="info-bloc-right-bottom">
            <div className="info-bloc-right-bottom-description">
              <p>
                {playlistDescription}
              </p>
            </div>
    
            <div className="info-bloc-right-bottom-button">
              <a
                href="/game"
                className="info-bloc-right-bottom-button-link"
                onClick={() => {
                  localStorage.setItem('playlist_id', playlistLink);
                }}
              >
                <span>JOUER</span>
              </a>
            </div>
          </div>
        </div>
        
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
