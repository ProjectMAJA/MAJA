// Import de la lib React
import React from 'react';

// Imports locaux
import './styles.scss'

const TrackSearchResult = ({ track, chooseTrack, addNewTrack }) => {

  function addNewTrack() {
    chooseTrack(track);
  }

  return (
    <div className="search-result" onClick={addNewTrack}>
      <img className="search-result-img" src={track.cover} alt="Image Deezer de la chanson" />
      <div className="search-result-info">
        <div className="search-result-info-artist">{track.artist}</div>
        <div className="search-result-info-title">{track.title}</div>
      </div>
    </div>
  )
};

export default TrackSearchResult;
