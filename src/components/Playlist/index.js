// Import de la lib React
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

// Imports locaux
import './styles.scss';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png';
import arrow from '../../../public/img/icons/arrow.png';

const Playlist = ({ title, playlists, setPlaylistLink, setShowDetails }) => {

  const [playlistWidth, setPlaylistWidth] = useState(null);
  const [rightArrow, setRightArrow] = useState(false);
  const [leftArrow, setLeftArrow] = useState(false);
  const [userWidth, setUserWidth] = useState(null);
  const [scroll, setScroll] = useState(0);

  const rowCards = useRef(0);
  const rowContainer = useRef(0);

  useEffect(() => {

    // Get the client witdh
    const width = document.body.clientWidth;
    setUserWidth(width);

    // Get the number of playlists for every row;
    const length = playlists.length;

    // Number of playlist * their own width (in px);
    const divWidth = (length * 190) + 320;

    // If a playlist row is larger than the client's navigator, 
    if ( divWidth > width) {
      // We show the arrow for the horizontal scroll
      setRightArrow(true);
    };
  }, []);
  
  const scrollToRight = () => {
    
    console.log(rowContainer.current.offsetWidth)
    console.log(rowCards.current.offsetWidth)
    
    const newScroll = scroll + userWidth/2;
    setScroll(scroll + userWidth/2);
    
    console.log()

    rowCards.current.style.transform = `translateX(-${newScroll}px)`;

    setLeftArrow(true);
  };

  const scrollToLeft = () => {
    
    const newScroll = scroll + userWidth/2;
    setScroll(scroll + userWidth/2);
    
    rowCards.current.style.transform = `translateX(${newScroll}px)`;


  };

  return(
    <div className="home-playlist-row" ref={rowContainer}>
        
      { rightArrow &&
        <div className="home-playlist-cards-blur">
          <img
            src={arrow}
            alt="Flèche pour faire défiler les playlists"
            className="home-playlist-cards-blur-arrow"
            onClick={scrollToRight}
          />
        </div>
      }
      { leftArrow &&
        <div className="home-playlist-cards-leftblur">
          <img
            src={arrow}
            alt="Flèche pour faire défiler les playlists"
            className="home-playlist-cards-leftblur-arrow"
            onClick={scrollToLeft}
          />
        </div>
      }

      <h1 className="home-playlist-row-title">{title}</h1>

      <ul className="home-playlist-cards" ref={rowCards}>
        { playlists &&
          playlists.map(playlist=> {

            const altImg = "Image de la playlist " + playlist.name;
            const blackStars= [];
            const whiteStars= [];

            for(let i=0; i<playlist.rating; i++){
              blackStars.push('+1');
            }
            for(let j=0; j<5-playlist.rating; j++){
              whiteStars.push('+1')
            }

            return (
              <li className="home-playlist-card" key={Math.random()}>
                <a id={playlist.id} onClick={() => {
                  setPlaylistLink(playlist.id);
                  setShowDetails(true);
                }}>
                        
                  { playlist.image ? (
                    <img className="home-playlist-card-logo" src={playlist.image} alt={altImg} />
                      ) : (
                    <img className="home-playlist-card-logo" src={imgDefault} alt="Image par défaut d'une playlist" />
                    )
                  }
                  <h2>{playlist.name}</h2>
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
              </li>
            )
          })
        }
      </ul>
    </div>
  )


};

Playlist.propTypes = {
  title: PropTypes.string.isRequired,
  setPlaylistLink: PropTypes.func.isRequired,
  setShowDetails: PropTypes.func.isRequired
};

export default Playlist;
