import React from 'react';

import './style.scss';

import play from '../../../public/img/icons/play.svg';
import pause from '../../../public/img/icons/pause.svg';

const PlayTrack = ({ trackInfos, listening, listenTrack }) => {

  return (
    <section className='player'>
      <img
        className="player-image"
        src={trackInfos.cover}
        alt="Image Deezer de la chanson"
      />

      <div className="player-infos">
        <p className="player-infos-name">{trackInfos.artist}</p>
        <p className="player-infos-title">{trackInfos.title}</p>
      </div>

      <img
        src={listening ? pause : play}
        className="player-button"
        alt="Écouter cette musique"
        onClick={() => {
          listenTrack(trackInfos.id);
        }}
      />
    </section>
  );
};

export default PlayTrack;