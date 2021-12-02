import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Volume = ({ musicVolume, setMusicVolume }) => {

  const volumeUp = () => {
    if (musicVolume < 100) {
      setMusicVolume(musicVolume + 5);
      DZ.player.setVolume(musicVolume + 5);
    } else {
      return;
    };
  };

  const volumeDown = () => {
    if (musicVolume > 0) {
      setMusicVolume(musicVolume - 5);
      DZ.player.setVolume(musicVolume - 5);
    } else {
      return;
    };
  };

  return (
    <section className="volume">

      <p className="volume-value">Volume : {musicVolume}</p>

      <button 
        className="volume-button"
        onClick={() => {
          volumeDown();
        }}
      >
        -
      </button>

      <button 
        className="volume-button"
        onClick={() => {
          volumeUp();
        }}
      >
        +
      </button>
    </section>
  );
};

Volume.propTypes = {
  musicVolume: PropTypes.number.isRequired,
  setMusicVolume: PropTypes.func.isRequired
};

export default Volume;