// Import de la lib React
import React, { useState, useEffect } from 'react';

// Imports NPM

// Imports locaux
import './styles.scss'

const TrackSearchResult = ({ track, chooseTrack, addNewTrack }) => {


    function addNewTrack() {
      chooseTrack(track);
    }
     {/* 
    const addTracks = [...addTrack, newTrack];
    setAddTrack(addTracks)
  */}

  return (
  <div className="search-result" onClick={addNewTrack}>
    <img className="search-result-img" src={track.cover} alt="" />
    <div className="search-result-suggestions">
      <div>{track.title}</div>
      <div>{track.artist}</div>
    </div>
  </div>
  )
};

export default TrackSearchResult;
