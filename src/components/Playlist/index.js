// Import de la lib React
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

// Imports locaux
import './styles.scss';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png';
import arrow from '../../../public/img/icons/arrow.png';

const Playlist = ({ title, playlists, setPlaylistLink, setShowDetails }) => {

  const [rightArrow, setRightArrow] = useState(false);
  const [leftArrow, setLeftArrow] = useState(false);
  const [positionScroll, setPositionScroll] = useState(0);

  const rowCards = useRef(0);
  const rowContainer = useRef(0);

  useEffect(() => {

    // Get the client witdh
    const userWidth = document.body.clientWidth;

    // Get the number of playlists for every row;
    const length = playlists.length;

    // Number of playlist * their own width (in px);
    const rowWidth = (length * 190) + 320;

    // If a playlist row is larger than the client's navigator, 
    if ( rowWidth > userWidth) {
      // We show the arrow for the horizontal scroll
      setRightArrow(true);
    };
  }, []);

  useEffect(() => {
    // If user came back to original playlist on the scroll,
    if (positionScroll === 0) {
      // We hide the left arrow & show right arrow
      setLeftArrow(false);
    };

    const userWidth = document.body.clientWidth;

    // The margin left is 320 pixels
    // And a card playlist width is 190 pixels
    const userWidthCapacity = Math.floor((userWidth - 320) / 190);

    // If the position goes too far, we hide the right arrow
    if (positionScroll >= playlists.length - userWidthCapacity) {
      setRightArrow(false);
    };
    // We check it every time user change de position with the arrows
  }, [positionScroll]);
  
  const scrollToRight = () => {
    const userWidth = document.body.clientWidth;
    const userWidthCapacity = Math.floor((userWidth - 320) / 190);
    
    let newScroll = 0;

    const playlistsLeft = playlists.length - (userWidthCapacity + positionScroll);
    
    if (playlistsLeft <= userWidthCapacity) {
      newScroll = positionScroll + playlistsLeft;
    } else {
      newScroll = positionScroll + ((Math.ceil((userWidth - 320) / 190)) -2);
    };
    
    // Save the new position of the scrolling row
    setPositionScroll(newScroll);

    // We set the scroll CSS with the width of a playlist card
    rowCards.current.style.transform = `translateX(-${newScroll * 190}px)`;

    // We show the left arrow
    if (leftArrow === false) {
      setLeftArrow(true);
    };
  };

  const scrollToLeft = () => {
    const userWidth = document.body.clientWidth;
    const userWidthCapacity = Math.floor((userWidth - 320) / 190);

    let newScroll = 0;

    if (positionScroll <= userWidthCapacity) {
      newScroll = 0;
    } else {
      newScroll = positionScroll - ((Math.ceil((userWidth - 320) / 190)) -2);
    };

    setPositionScroll(newScroll);
    rowCards.current.style.transform = `translateX(-${newScroll * 190}px)`;

    if(rightArrow === false) {
      setRightArrow(true);
    };
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
            };
            for(let j=0; j<5-playlist.rating; j++){
              whiteStars.push('+1');
            };

            return (
              <li className="home-playlist-card" key={Math.random()}>
                <a onClick={() => {
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
                        );
                      })
                    }
                    { whiteStars && 
                      whiteStars.map(e=>{
                        return(
                          <em>&#9734;</em>
                        );
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
  );
};

Playlist.propTypes = {
  title: PropTypes.string.isRequired,
  setPlaylistLink: PropTypes.func.isRequired,
  setShowDetails: PropTypes.func.isRequired
};

export default Playlist;
