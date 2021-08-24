// Import de la lib React
import React from 'react';
import PropTypes from 'prop-types';

// Imports NPM

// Imports locaux
import './styles.scss';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png';

const Playlist = ({ title, playlists, setPlaylistLink, setShowDetails }) => {
  return(    
    <div className="home-playlist-row">
      <h1>{title}</h1>
            <div className="home-playlist-cards">
              {playlists &&
                playlists.map(playlist=> {
                  const blackStars= [];
                  const whiteStars= [];
                  for(let i=0; i<playlist.rating; i++){
                    blackStars.push('+1');
                  }
                  for(let j=0; j<5-playlist.rating; j++){
                    whiteStars.push('+1')
                  }
                  return (
                    <div className="home-playlist-card" key={playlist.id}>
                      <a id={playlist.id} onClick={() => {
                        setPlaylistLink(playlist.id);
                        setShowDetails(true);
                      }}>
                        
                          {playlist.image ? (
                            <img className="home-playlist-card-logo" src={playlist.image} alt="home-playlist placeholder" />
                          ) : (
                            <img className="home-playlist-card-logo" src={imgDefault} alt="home-playlist placeholder" />
                          )
                          }
                          <h2>{playlist.name}</h2>
                          <div> 
                                  {blackStars && 
                                    blackStars.map(e=>{
                                      return(
                                        <em>&#9733;</em>
                                      )
                                    })
                                  }
                                  {whiteStars && 
                                    whiteStars.map(e=>{
                                      return(
                                        <em>&#9734;</em>
                                      )
                                    })
                                  }          
                                </div>
                        
                      </a>
                    </div>
                  )
                })
              }
            </div>
        </div>
  )
};

Playlist.propTypes = {
  title: PropTypes.string.isRequired,
  setPlaylistLink: PropTypes.func.isRequired,
  setShowDetails: PropTypes.func.isRequired
};

export default Playlist;
