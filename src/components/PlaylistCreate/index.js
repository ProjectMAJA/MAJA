// Import de la lib React
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

// Imports NPM
import axios from 'axios';

// Imports locaux
import './styles.scss';
import TrackSearchResult from '../TrackSearchResult';
import Item from '../Item';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png';
import downArrow from '../../../public/img/icons/downArrow.png';

const PlaylistCreate = ({ baseURL }) => {

  let history = useHistory();

  const api = axios.create({
    baseURL: baseURL
  });

  {/* useState pour l'accordéon */}
  const [toggle, setToggle] = useState(false);
  {/* useState pour la barre de recherche */}
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const [searchResults, setSearchResults] = useState([]);
  {/* useState pour sélectionner la musique */}
  const [selectedTrack, setSelectedTrack] = useState([]);
  {/* useState pour afficher les musiques d'une playlist */}

  const [playlistID, setPlaylistID] = useState(null);
  const [userID, setUserID] = useState(null);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [playlistImg, setPlaylistImg] = useState('');

  const [showTooLongDesc, setShowTooLongDesc] = useState(false);
  const [showTooLongName, setShowTooLongName] = useState(false);
  const [showTenSongMinMessage, setShowTenSongMinMessage] = useState(false);

  const [deezerIds, setDeezerIds] = useState([]);

  const toggleState = () => {
    setToggle(!toggle);
  }

  useEffect(() => {
    document.title = "MAJA - Créer une playlist";
  }, []);

  // useEffect that fetches data from Deezer API
  useEffect(() => {

    DZ.api('/search?q=' + search, (res) => {
      
      setSearchResults(
        res.data.map(track => {
          if (track.readable) {
            if ( deezerIds.includes(track.id) ) {
              return;
            } else {

              return {
                id: track.id,
                artist: track.artist.name,
                title : track.title,
                track: track.link,
                cover: track.album.cover_medium,
                preview: track.preview,
              };
            };
          };
        })
      );
    });

  }, [search]);

  function chooseTrack(track) {
    const tracks = [...selectedTrack, track];
    setSelectedTrack(tracks);

    const newIDs = [...deezerIds, track.id];
    setDeezerIds(newIDs);
  };
  function addNewTrack() {
    chooseTrack(track);
  };

  async function savePlaylist() {

    if (deezerIds.length >= 10) {

      const token = localStorage.getItem('token');

      await api.post('/playlist', {
        name: playlistName,
        description: playlistDesc,
        image: playlistImg,
        deezer_ids: deezerIds
      },{
        headers: {
          Authorization: token
        }
      })
        .then((res) => {
          history.push({
            pathname: '/user/playlists',
          })
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        })
    } else {
      setShowTenSongMinMessage(true);
    };
  };

  const deleteTrack = (id) => {

    const newTracks = selectedTrack.filter(track => track.id != id);
    setSelectedTrack(newTracks);

    const newIDs = deezerIds.filter(deezerId => deezerId != id);
    setDeezerIds(newIDs);
  };

  const deletePlaylist = async () => {
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
      });
  };

  const changeName = (newName) => {
    if (newName.length > 30) {
      setShowTooLongName(true);
    } else {
      setPlaylistName(newName);
    };
  };

  const changeDesc = (newDesc) => {
    if (newDesc.length > 100) {
      setShowTooLongDesc(true);
    } else {
      setPlaylistDesc(newDesc);
    };
  };

  return (
    <div className="playlist-update">

      <div className="playlist-update-header">
        <h1 className="playlist-update-header-name">{playlistName}</h1>
        <p className="playlist-update-header-desc">{playlistDesc}</p>
      </div>

      <div className="playlist-update-container">

        <section className="playlist-update-container-img">
          {playlistImg ? (
            <img className="playlist-update-container-img-content" src={playlistImg} alt="Image de votre playlist" />
          ) : (
            <img className="playlist-update-container-img-content" src={imgDefault} alt="Image par défaut d'une playlist" />
          )}
          <p>Changer l'image</p>
          <input
            className="playlist-update-container-img-link"
            type="text"
            placeholder="URL de l'image"
            onChange={(event) => {
              setPlaylistImg(event.target.value);
            }}
          />
        </section>

        <section className="playlist-update-container-info">
            <label className="playlist-update-container-info-name">
              Changer le nom
              <input
                type="text"
                className="playlist-update-container-info-name-input"
                placeholder={playlistName} 
                onChange={(event) => {
                  changeName(event.target.value);
                }}
              />
            </label>
            {showTooLongName &&
              <p className="too_long">Le nom doit faire 30 caractères au maximum</p>
            }
          
            <label className="playlist-update-container-info-desc">
              Changer la description
              <input
                type="text"
                className="playlist-update-container-info-desc-input"
                placeholder={playlistDesc}
                onChange={(event) => {
                  changeDesc(event.target.value);
                }}
              />
            </label>
            {showTooLongDesc &&
              <p className="too_long">Votre description doit faire 100 caractères au maximum</p>
            }
          </section>
          
      </div>

      {showTenSongMinMessage &&
        <p className="playlist-update-error"> Votre playlist doit contenir au minimum 10 musiques pour être enregistrée. </p>
      }

      <section className="playlist-update-songs">

        <button
          onClick={toggleState}
          className="playlist-update-songs-button">
          <img 
            className="playlist-update-songs-button-img"
            src={downArrow} 
            alt="Ajouter / Supprimer des musiques"
          />
          <p className="playlist-update-songs-button-label">Ajouter / Supprimer des musiques</p>
        </button>
          
        { toggle &&

          <div className="playlist-update-songs-list">

            <section className="playlist-update-songs-list-tracks"> 

              <p className="playlist-update-songs-list-tracks-title">Musiques de votre playlist</p>
              <hr />
              <input 
                className="playlist-update-songs-list-search-input" 
                type="search"
                onChange={(event) => {
                  setFilter(event.target.value)
                }}
                value={filter}
                placeholder="Rechercher une musique"
              />
              {selectedTrack.map(song => {
                if (song) {
                  const filt = filter.toLowerCase();
                  const title = song.title.toLowerCase();
                  const artist = song.artist.toLowerCase();

                  if (title.includes(filt) || artist.includes(filt)) {
                    return (
                      <Item
                        track={song}
                        key={song.track}
                        deleteTrack={deleteTrack}
                      />
                    )
                  } 
                }
              })}
            </section>

            <section className="playlist-update-songs-list-search">

              <p className="playlist-update-songs-list-search-title">Ajouter une musique</p>
              <hr />
              <input 
                className="playlist-update-songs-list-search-input" 
                type="search"
                onChange={e=>setSearch(e.target.value)} 
                value={search}
                placeholder="Rechercher sur Deezer"
              />
              {searchResults.map(track => {
                // If there is a track, we render it
                if (track) {
                  // If the track is already on the songs list of the playlist,
                  if (deezerIds.includes(track.id)) {
                    // We return and don't render it.
                    return;
                  } else {
                    return (
                      <TrackSearchResult
                        track={track}
                        chooseTrack={chooseTrack}
                        addNewTrack={addNewTrack}
                      />
                    )
                  }
                }
              })}
            </section>

          </div>     
        }

        {showTenSongMinMessage &&
          <p className="playlist-update-error"> Votre playlist doit contenir au minimum 10 musiques pour être enregistrée. </p>
        }
      </section>

      <section className="playlist-update-buttons">

          <button className="playlist-update-buttons-save" onClick={(event) => {
            event.preventDefault();
            savePlaylist();
          }}>
            Sauvegarder
          </button>

          <input
            className="playlist-update-buttons-delete"
            type="button"
            value="Supprimer cette playlist"
            onClick={() => {
              deletePlaylist();
              history.push({
                pathname: '/user/playlists'
              })
            }}
          />

      </section>
    
    </div>
  );
};

PlaylistCreate.propTypes = {
  baseURL: PropTypes.string.isRequired
};

export default PlaylistCreate;
