// Import de la lib React
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

// Imports locaux
import './styles.scss';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png';
import downArrow from '../../../public/img/icons/downArrow.png';
import save from '../../../public/img/playlist/save.svg';
import deleteImg from '../../../public/img/icons/delete.svg';

import TrackSearchResult from '../TrackSearchResult';
import Item from '../Item';
import Notification from '../Notification';
import PlayTrack from '../PlayTrack';
import Timer from '../Timer';
import Volume from '../Game/Volume';
import DeleteModal from '../DeleteModal';

const PlaylistCreate = ({ api }) => {

  let history = useHistory();

  {/* useState pour l'accordéon */}
  const [toggle, setToggle] = useState(false);
  {/* useState pour la barre de recherche */}
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const [searchResults, setSearchResults] = useState([]);
  {/* useState pour sélectionner la musique */}
  const [selectedTrack, setSelectedTrack] = useState([]);
  {/* useState pour afficher les musiques d'une playlist */}
  
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [playlistImg, setPlaylistImg] = useState('');

  const [runTimer, setRunTimer] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [musicVolume, setMusicVolume] = useState(20);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentTrack, setCurrentTrack] = useState(null);

  const [showNotification, setShowNotification] = useState(false);
  const [showTooLongNotification, setShowTooLongNotification] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [showDeletedNotification, setShowDeletedNotification] = useState(false);
  const [addedNotification, setAddedNotification] = useState(false);
  const [deletedNotification, setDeletedNotification] = useState(false);

  const [showPlayTrack, setShowPlayTrack] = useState(false);
  const [showTooLongDesc, setShowTooLongDesc] = useState(false);
  const [showTooLongName, setShowTooLongName] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [playlistOrUser, setPlaylistOrUser] = useState("cette playlist");
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);
  const [trackInfos, setTrackInfos] = useState([]);
  const [listening, setListening] = useState(false);

  const [deezerIds, setDeezerIds] = useState([]);

  const songArrow = useRef(null);

  const toggleState = () => {
    setToggle(!toggle);
    if(toggle) {
      songArrow.current.style.transform = "rotate(0deg)";
    } else {
      songArrow.current.style.transform = "rotate(180deg)";
    };
  };

  useEffect(() => {
    document.title = "MAJA - Créer une playlist";

    return () => {
      DZ.player.pause();
    };
  }, []);

  // useEffect that fetches data from Deezer API
  useEffect(() => {
    if (search != '') {
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
                  preview: track.preview
                };
              };
            };
          })
        );
      });
    }
  }, [search]);

  useEffect(() => {
    if (confirmDelete === true) {
      history.push({
        pathname: '/user/playlists',
      });
    };
  }, [confirmDelete]);

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

      await api.post('/playlist', {
        name: playlistName,
        description: playlistDesc,
        image: playlistImg,
        deezer_ids: deezerIds
      })
        .then((res) => {
          history.push({
            pathname: '/user/playlists'
          });
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      setShowAddedNotification(false);
      setShowDeletedNotification(false);
      setShowNotification(true);
      setShowTooLongNotification(true);
    };
  };

  const deleteTrack = (id) => {

    const newTracks = selectedTrack.filter(track => track.id != id);
    setSelectedTrack(newTracks);

    const newIDs = deezerIds.filter(deezerId => deezerId != id);
    setDeezerIds(newIDs);
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

  // This function toggle the listening, user can play or pause a selected track, and he can play another track
  const listenTrack = (id) => {
    
    if (runTimer === true) {
      setRunTimer(false);
    };

    if (listening === true) {
      setListening(false);
      setRunTimer(false);
      DZ.player.pause();
    } else {
      setListening(true);
      setRunTimer(true);

      // Check if the previous (that was the current at his time) is the same that the actual track
      // User can just set pause and replay the same song, s
      // In this case, we reset the timeLeft to 30 seconds
      if (currentTrack !== id) {
        setTimeLeft(30);
        DZ.player.playTracks([id], 0, 30);
        setCurrentTrack(id);
      } else {
        if (timeLeft <= 0) {
          setTimeLeft(30);
          DZ.player.playTracks([id], 0, 30);
        } else {
          DZ.player.play();
        };
      };
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

      <section className="playlist-update-songs">
        <button
          onClick={toggleState}
          className="playlist-update-songs-button">
          <img
            className="playlist-update-songs-button-img"
            src={downArrow} 
            alt="Ajouter / Supprimer des musiques"
            ref={songArrow}
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
                  setFilter(event.target.value);
                }}
                value={filter}
                placeholder="Rechercher une musique"
              />
              <ul className="playlist-update-songs-list-search-list">
                {selectedTrack.map(song => {
                  if (song) {
                    const filt = filter.toLowerCase();
                    const title = song.title.toLowerCase();
                    const artist = song.artist.toLowerCase();

                    if (title.includes(filt) || artist.includes(filt)) {
                      return (
                        <li 
                          className="playlist-update-songs-list-search-list-item"
                          key={song.id}
                        >
                          <Item
                            track={song}
                            deleteTrack={deleteTrack}
                            setShowPlayTrack={setShowPlayTrack}
                            setTrackInfos={setTrackInfos}
                            setListening={setListening}
                            setRunTimer={setRunTimer}
                            showVolume={showVolume}
                            setShowVolume={setShowVolume}
                            setShowNotification={setShowNotification}
                            setShowDeletedNotification={setShowDeletedNotification}
                            setDeletedNotification={setDeletedNotification}
                            setShowAddedNotification={setShowAddedNotification}
                            setShowTooLongNotification={setShowTooLongNotification}
                          />
                        </li>
                      );
                    };
                  };
                })}
              </ul>
            </section>

            <section className="playlist-update-songs-list-search">
              <p className="playlist-update-songs-list-search-title">Ajouter une musique</p>
              <hr />
              <input 
                className="playlist-update-songs-list-search-input" 
                type="search"
                value={search}
                placeholder="Rechercher sur Deezer"
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
              />
              <ul className="playlist-update-songs-list-search-list">
                {searchResults.map(track => {
                  // If there is a track, we render it
                  if (track) {
                    // If the track is already on the songs list of the playlist,
                    if (deezerIds.includes(track.id)) {
                      // We return and don't render it.
                      return;
                    } else {
                      return (
                        <li 
                          className="playlist-update-songs-list-search-list-item"
                          key={track.id}
                        >
                          <TrackSearchResult
                            track={track}
                            chooseTrack={chooseTrack}
                            addNewTrack={addNewTrack}
                            setShowPlayTrack={setShowPlayTrack}
                            setTrackInfos={setTrackInfos}
                            setListening={setListening}
                            setRunTimer={setRunTimer}
                            showVolume={showVolume}
                            setShowVolume={setShowVolume}
                            setShowNotification={setShowNotification}
                            setShowAddedNotification={setShowAddedNotification}
                            setAddedNotification={setAddedNotification}
                            setShowDeletedNotification={setShowDeletedNotification}
                            setShowTooLongNotification={setShowTooLongNotification}
                          />
                        </li>
                      );
                    };
                  };
                })}
              </ul>
            </section>
          </div>     
        }
      </section>

      <section className="playlist-update-buttons">
          <button 
            className="playlist-update-buttons-save" 
            onClick={(event) => {
              event.preventDefault();
              savePlaylist();
            }}
          >
            <img
              className="playlist-update-buttons-img"
              src={save}
              alt="Bouton de sauvegarde"
            />
            Sauvegarder
          </button>

          <button
            className="playlist-update-buttons-delete"
            onClick={() => {
              setShowDeleteConfirm(true);
            }}
          >
            <img
              className="playlist-update-buttons-img"
              src={deleteImg}
              alt="Bouton d'annulation"
            />
            Annuler
          </button>
      </section>

      {showDeleteConfirm &&
        <DeleteModal
          setShowDeleteConfirm={setShowDeleteConfirm}
          setConfirmDelete={setConfirmDelete}
          setConfirmDeleteUser={setConfirmDeleteUser}
          playlistOrUser={playlistOrUser}
        />
      }

      {showPlayTrack &&
        <PlayTrack
          trackInfos={trackInfos}
          listening={listening}
          listenTrack={listenTrack}
        />
      }

      {showVolume &&
        <Volume
          musicVolume={musicVolume}
          setMusicVolume={setMusicVolume}
        />
      }

      {runTimer &&
        <Timer
          setListening={setListening}
          setRunTimer={setRunTimer}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
        />
      }


      { showNotification &&
        showAddedNotification && 
          <Notification
            setShowNotification={setShowNotification}
          >
            {addedNotification}
          </Notification>
      }

      { showNotification &&
        showDeletedNotification && 
          <Notification
            setShowNotification={setShowNotification}
          >
            {deletedNotification}
          </Notification>
      }

      {showNotification &&
        showTooLongNotification &&
        <Notification
          setShowNotification={setShowNotification}
        >
          Votre playlist doit contenir au minimum 10 musiques pour être enregistrée.
        </Notification>
      }
    </div>
  );
};

export default PlaylistCreate;