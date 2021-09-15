import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Timer = ({ setShowTimer, timer, setTimer }) => {

  useEffect(() => {
    let timeLeft = timer;
    const timerId = setInterval(() => {
      if (timeLeft === 0) {
        // Hide the timer
        setShowTimer(false);
        // Reset the timer
        setTimer(timer);
        // Stop the music
        DZ.player.pause();
        clearInterval(timerId);
      } else {
        timeLeft--;
        setTimer(timeLeft);
      };
    }, 1000);
  }, []);

  return (
    <section className='timer'>
      <div className="timer-content">{timer}</div>
    </section>
  );
};

Timer.propTypes = {
  setShowTimer: PropTypes.func.isRequired,
  timer: PropTypes.number.isRequired,
  setTimer: PropTypes.func.isRequired
};

export default Timer;