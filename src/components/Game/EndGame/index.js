import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import './style.scss';

const EndGame = ({
  api,
  score,
  setShowVolume,
  setShowAnswer,
  setShowPrevious,
  setShowScore
}) => {
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const newScore = localStorage.getItem('score');
    const playlistID = localStorage.getItem('playlist_id');

    // Send score to back
    if (token) {
      api.post('/playlist/game', {
        score: newScore,
        playlist_id: playlistID
      })
        .then((res) => {
          console.log(res.data);
          localStorage.removeItem('playlist_id');
        })
        .catch((err) => {
          console.log(err.response);
        });
    };

    // Show the result & the redirect button
    setShowVolume(false);
    setShowAnswer(false);
    setShowPrevious(false);
    setShowScore(false);
  }, []);

  return (
    <section className="end_game">
      <div className="end_game-text">
        <span className="end_game-text-title"> Fin de la partie </span>
        <hr />
        <span className="end_game-text-score">Votre score est de {score} !</span>
      </div>
      <NavLink exact to="/">
        <button
          className="end_game-button"
          onClick={() => {
            localStorage.removeItem('playlist_id');
          }}
        >
          Revenir à l'accueil
        </button>
      </NavLink>
    </section>
  );
};

EndGame.propTypes = {
  score: PropTypes.number.isRequired,
  setShowVolume: PropTypes.func.isRequired,
  setShowAnswer: PropTypes.func.isRequired,
  setShowPrevious: PropTypes.func.isRequired,
  setShowScore: PropTypes.func.isRequired
};

export default EndGame;