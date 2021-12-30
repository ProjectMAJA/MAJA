import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Timer = ({ setShowTimer, timer, setTimer }) => {

  const circle = useRef(null);
  const pulse = useRef(null);

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

        if (timeLeft > 10) {
          return;
        } else if (timeLeft > 5) {
          circle.current.style.background = "linear-gradient(rgb(250, 142, 0), rgb(228, 196, 28))";
          pulse.current.style.background = "linear-gradient(rgb(250, 142, 0), rgb(228, 196, 28))";
        } else {
          circle.current.style.background = "linear-gradient(rgb(191, 73, 73), rgb(222, 15, 15))";
          pulse.current.style.background = "linear-gradient(rgb(191, 73, 73), rgb(222, 15, 15))";
        };
      };
    }, 1000);

    return () => {
      setTimer(timer);
    };
  }, []);

  return (
    <section className='timer'>
      <div className="timer-circle" ref={circle}>
        <div className="timer-circle-pulse" ref={pulse}></div>
      </div>
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