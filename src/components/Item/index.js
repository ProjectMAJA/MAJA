// Import de la lib React
import React from 'react';

// Imports NPM

// Imports locaux
import './styles.scss';
import del from '../../../public/img/icons/delete.svg';

const Item = ({ track, key, deleteTrack }) => {

  return (
    <div key={key} className="item-result">
      <img className="item-result-img" src={track.cover} alt="" />
      <div className="item-result-right">
        <div className="item-result-track">
          <h3>{track.artist}</h3>
          <h3>{track.title}</h3>
        </div>
        <input
          type="image"
          src={del}
          className="item-result-remove"
          onClick={() => {
            deleteTrack(track.id);
          }}
        />
      </div>
    </div>
  );
}


export default Item;
