// Import de la lib React
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';

// Imports NPM
import axios from 'axios';

// Imports locaux
import './styles.scss';
import TrackSearchResult from '../TrackSearchResult';
import Item from '../Item';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png';
import settings from '../../../public/img/profil/settings.svg';

const PlaylistUpdate = ({ baseURL }) => {

  let history = useHistory();

  const location = useLocation();

  const api = axios.create({
    baseURL: baseURL
  });

  {/* useState pour l'accordéon */}
  const [toggle, setToggle] = useState(false);
  {/* useState pour la barre de recherche */}
  
  const [search, setSearch] = useState('');
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

  const [deezerIds, setDeezerIds] = useState([]);

  const toggleState = () => {
    setToggle(!toggle);
  }

  // useEffect that gets playlist info
  useEffect(() => {

    if (DZ.player.isPlaying()) {
      DZ.player.setMute(true);
    };

    document.title = "MAJA - Éditer une playlist";

    setPlaylistID(location.state.playlist.id);
    setUserID(location.state.playlist.user_id);
    setPlaylistName(location.state.playlist.name);
    setPlaylistDesc(location.state.playlist.description);
    setPlaylistImg(location.state.playlist.image);
    setDeezerIds(location.state.playlist.deezer_ids);
    displayTracks(location.state.playlist.deezer_ids);
  }, [])

  function displayTracks(tracksId) {
    const fetchedTracks = [];

    tracksId.map(trackId => {

      DZ.api(`/track/${trackId}`, (res) => {

        fetchedTracks.push({
          id: res.id,
          artist: res.artist.name,
          title : res.title,
          track: res.link,
          cover: res.album.cover_medium,
          preview: res.preview,
        })
      })
    })
      
      setSelectedTrack(fetchedTracks);
  };

  useEffect(() => {
    if (!search) return setSearchResults([]);

    let cancel = false

    DZ.api('/search?q=' + search, (res) => {
      console.log(res);
      
      if (cancel) return;

      setSearchResults(
        res.data.map(track => {

          if (track.readable) {
            return {
              id: track.id,
              artist: track.artist.name,
              title : track.title,
              track: track.link,
              cover: track.album.cover_medium,
              preview: track.preview,
            }
          }
          return;
        })
      )
    })

    return() => cancel = true
  }, [search]);

  function chooseTrack(track) {
    const tracks = [...selectedTrack, track];
  
    setSelectedTrack(tracks);
    setSearch('');

    const newIDs = [...deezerIds, track.id];
    setDeezerIds(newIDs);
  };
 
  function addNewTrack() {
    chooseTrack(track);
  };

  async function savePlaylist() {

    const token = localStorage.getItem('token');

    console.log("deezerIds dans  : ", deezerIds);

    await api.post('/playlist', {
      id: playlistID,
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

      <div className="playlist-update">

        <div className="playlist-update-header">
          <h1 className="playlist-update-header-name">{playlistName}</h1>
          <p className="playlist-update-header-desc">{playlistDesc}</p>
        </div>

        <div className="playlist-update-accord-container">
          <div className="playlist-update-accord visible">


            <section className="playlist-update-img">
              {playlistImg ? (
                <img className="playlist-update-img-content" src={playlistImg} alt="playlist-placeholder" />
              ) : (
                <img className="playlist-update-img-content" src={imgDefault} alt="playlist-placeholder" />
              )}
              <input
                className="playlist-update-img-link"
                type="text"
                placeholder="URL de l'image"
                onChange={(event) => {
                  setPlaylistImg(event.target.value);
                }}
              />
            </section>

            <section className="playlist-update-info">
              <label className="playlist-update-name">
                Changer le nom
                <input
                  type="text"
                  className="playlist-update-name-input"
                  placeholder={playlistName} 
                  onChange={(event) => {
                    changeName(event.target.value);
                  }}
                />
              </label>
              {showTooLongName &&
                <p className="too_long">Le nom doit faire 30 caractères au maximum</p>
              }
            
              <label className="playlist-update-desc">
                Changer la description
                <input
                  type="textarea"
                  className="playlist-update-desc-input"
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
            
            <button
            onClick={toggleState}
             className="playlist-update-settings-button">
              <img className="playlist-update-settings" src={settings} alt="" />
            </button> 
          </div>
  
          {/* accordéon qui se déplie */}
          <div className="playlist-update-accord animated">
            <div className="playlist-update-accord-header">
                <input 
                  className="playlist-update-accord-header-search" 
                  type="search"
                  onChange={e=>setSearch(e.target.value)} 
                  value={search}
                  placeholder="Rechercher sur Deezer"
                />
            </div>
            <div className="playlist-update-accord-result">
              {searchResults.map(track => (
                <TrackSearchResult track={track} key={track.track} chooseTrack={chooseTrack} addNewTrack={addNewTrack} />
              ))}
            </div>
            <div className="playlist-update-existing-tracks">
              {}
            </div>


            { toggle &&
            <div className="playlist-update-accord-body">          
              {selectedTrack.map(song => (
                  <Item track={song} key={song.track} deleteTrack={deleteTrack} />
                ))}
                
            </div>
            }
            <div>

                <input
                  className="playlist-update-delete"
                  type="button"
                  value="Supprimer cette playlist"
                  onClick={() => {
                    deletePlaylist();
                    history.push({
                      pathname: '/user/playlists'
                    })
                  }}
                />
                <button className="playlist-update-save" onClick={(event) => {
                  event.preventDefault();
                  savePlaylist();
                }}>
                  Sauvegarder
                </button>


            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

PlaylistUpdate.propTypes = {
  baseURL: PropTypes.string.isRequired
};

export default PlaylistUpdate;


