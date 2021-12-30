// Import de la lib React
import React, { useState } from 'react';

// Imports locaux
import './styles.scss';
import del from '../../../public/img/icons/delete.svg';
import speaker from '../../../public/img/icons/speaker.svg';

const Item = ({
  track,
  deleteTrack,
  setShowPlayTrack,
  setTrackInfos,
  setListening,
  setRunTimer,
  showVolume,
  setShowVolume,
  setShowNotification,
  setShowDeletedNotification,
  setDeletedNotification,
  setShowAddedNotification,
  setShowTooLongNotification
}) => {

  const altImg = "Image de l'album de " + track.artist;

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

  const deleteTrackFromPlaylist = () => {
    setShowTooLongNotification(false);
    setShowAddedNotification(false);
    setDeletedNotification(track.title + ' de ' + track.artist + ' a bien été supprimée de votre playlist');
    deleteTrack(track.id);
    setShowNotification(true);
    setShowDeletedNotification(true);
  };

  return (
    <section className="item-result">
      <img
        className="item-result-img"
        src={track.cover}
        alt={altImg}
      />
      <div className="item-result-track">
        <p className="item-result-track-artist">{track.artist}</p>
        <p className="item-result-track-title">{track.title}</p>
      </div>

      <div className="item-result-buttons">
        <img
          src={speaker}
          className="item-result-buttons-listen"
          alt="Ouvrir le lecteur"
          onClick={() => {
            showPlayer();
          }}
        />
        <img
          src={del}
          className="item-result-buttons-remove"
          onClick={() => {
            deleteTrackFromPlaylist();
          }}
        />
      </div>
    </section>
  );
};

export default Item;