import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Answer = ({ previousImg, previousArtist, previousTrack }) => {

  const imgAlt = `Photo Deezer de ${previousArtist}`;

  return (
    <section className="answer">

      <img src={previousImg} className="answer-img" alt={imgAlt} />

      <div className="answer-content">
        <p>C'était  " <span className="answer-content-track">{previousTrack}</span> "</p> 
        <hr />
        <p>de  <span className="answer-content-track">{previousArtist}</span> !</p>
      </div>
      
    </section>
  );
};

Answer.propTypes = {
  previousImg: PropTypes.string.isRequired,
  previousArtist: PropTypes.string.isRequired,
  previousTrack: PropTypes.string.isRequired
};

export default Answer;