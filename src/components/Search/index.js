import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './style.scss';

import PlaylistInfo from 'src/components/PlaylistInfo';
import Loading from 'src/components/Loading';

import searchImg from '../../../public/img/nav/search.svg';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png';

const Search = ({ baseURL }) => {

  const [showDetails, setShowDetails] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [playlists, setPlaylists] = useState(null);
  const [playlistLink, setPlaylistLink] = useState('');

  const api = axios.create({
    baseURL: baseURL 
  });

  useEffect(async() => {

    setShowLoading(true);

    const wasPlaying = localStorage.getItem('playlist_id');

    if (wasPlaying) {
      window.location.reload();
      localStorage.removeItem('playlist_id');
    };

    document.title = "MAJA - Rechercher une playlist";

    await api.get('/playlists')
      .then((res) => {
        setPlaylists(res.data);
        setShowLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  return (
    <section className="search">

      {showLoading &&
        <Loading />
      }

      <div className="search-header">

        <img src={searchImg} alt="Rechercher" className="search-header-img"/>

        <input
          className="search-header-input"
          type="text"
          placeholder="Filtrer - Rechercher une playlist"
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
        />

      </div>

      <hr />

      <div className="search-container">

        {playlists &&
          playlists.map(playlist => {
            
            const name = playlist.name.toLowerCase();
            const search = searchInput.toLowerCase();

            const blackStars = [];
            const whiteStars = [];

            for(let i=0; i<playlist.rating; i++){
              blackStars.push('+1');
            }

            for(let j=0; j<5-playlist.rating; j++){
              whiteStars.push('+1')
            }

            if ( name.includes(search) ) {
              return (

                <a className="search-container-playlist" key={playlist.id} onClick={() => {
                  setPlaylistLink(playlist.id);
                  setShowDetails(true);
                }}>

                  {playlist.image ? (
                    <img className="home-playlist-card-logo" src={playlist.image} alt="Image de la playlist" />
                  ) : (
                    <img className="home-playlist-card-logo" src={imgDefault} alt="Image par défaut d'une playlist" />
                  )}

                  <h2>{playlist.name}</h2>

                  <div> 
                    {blackStars && 
                      blackStars.map(e=>{
                        return(
                          <em>&#9733;</em>
                        );
                      })
                    }
                    {whiteStars && 
                      whiteStars.map(e=>{
                        return(
                          <em>&#9734;</em>
                        );
                      })
                    }          
                  </div>
                </a>
              )
            }
          })
        }

        {showDetails &&
          <PlaylistInfo
            baseURL={baseURL}
            playlistLink={playlistLink}
            setShowDetails={setShowDetails}
          />
        }
        
      </div>
    </section>
  );
};

Search.propTypes = {
  baseURL: PropTypes.string.isRequired
};

export default Search;
