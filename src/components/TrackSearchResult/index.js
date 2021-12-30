// Import de la lib React
import React, { useState } from 'react';

// Imports locaux
import './styles.scss'

import speaker from '../../../public/img/icons/speaker.svg';
import add from '../../../public/img/icons/add.svg';

const TrackSearchResult = ({ 
  track,
  chooseTrack,
  addNewTrack,
  setShowPlayTrack,
  setTrackInfos,
  setListening,
  setRunTimer,
  showVolume,
  setShowVolume,
  setShowNotification,
  setShowAddedNotification,
  setAddedNotification,
  setShowDeletedNotification,
  setShowTooLongNotification
}) => {

  function addNewTrack() {
    chooseTrack(track);
  };

  const showPlayer = () => {
    DZ.player.pause();
    setListening(false);
    setTrackInfos(track);
    setShowPlayTrack(true);
    setRunTimer(false);

    if (showVolume === false) {
      setShowVolume(true);
    };
  };

  const addTrackToPlaylist = () => {
    setShowTooLongNotification(false);
    setShowDeletedNotification(false);
    setAddedNotification(track.title + ' de ' + track.artist + ' a bien été ajoutée à votre playlist');
    addNewTrack();
    setShowNotification(true);
    setShowAddedNotification(true);
  };

  return (
    <section className="search-result">
      <img
        className="search-result-img"
        src={track.cover}
        alt="Image Deezer de la chanson"
      />

      <div className="search-result-info">
        <div className="search-result-info-artist">{track.artist}</div>
        <div className="search-result-info-title">{track.title}</div>
      </div>

      <div className="search-result-buttons">
        <img
          src={speaker}
          className="search-result-buttons-listen"
          alt="Ouvrir le lecteur"
          onClick={() => {
            showPlayer();
          }}
        />
        <img
          src={add}
          className="search-result-buttons-add"
          alt="Ajouter cette musique à la playlist"
          onClick={() => {
            addTrackToPlaylist();
          }}
        />
      </div>
    </section>
  );
};

export default TrackSearchResult;