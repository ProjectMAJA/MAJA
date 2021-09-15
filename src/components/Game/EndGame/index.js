import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import './style.scss';

const EndGame = ({
  baseURL,
  score,
  cooldown,
  setShowVolume,
  setShowAnswer,
  setShowPrevious,
  setShowScore,
  setShowEndgame
}) => {
  
  useEffect(() => {

    // Init axios requests
    const api = axios.create({
      baseURL: baseURL
    });

    const token = localStorage.getItem('token');
    const playlistID = localStorage.getItem('playlist_id');
    const newScore = localStorage.getItem('score');

    // Send score to back
    if (token) {
      api.post('/playlist/game', {
        score: newScore,
        playlist_id: playlistID
      },
      {
        headers: {
          Authorization: token
        }
      })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        })
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
      <NavLink
        exact to="/"
        className="end_game-button"
        onClick={() => {
          localStorage.removeItem('playlist_id');
        }}>
          Revenir à l'accueil
      </NavLink>
    </section>
  );
};

EndGame.propTypes = {
  baseURL: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  cooldown: PropTypes.number.isRequired,
  setShowVolume: PropTypes.func.isRequired,
  setShowAnswer: PropTypes.func.isRequired,
  setShowPrevious: PropTypes.func.isRequired,
  setShowScore: PropTypes.func.isRequired,
  setShowEndgame: PropTypes.func.isRequired
};

export default EndGame;