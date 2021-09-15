import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Countdown = ({ deezerIDs, setShowCountdown, setShowTimer }) => {
    
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let countLeft = countdown;
    let countId = setInterval(() => {
      if (countLeft === 1) {
        setShowCountdown(false);
        // Launch the selected playlist with the timer
        DZ.player.playTracks(deezerIDs);
        setShowTimer(true);
        clearInterval(countId);
      } else {
        countLeft--;
        setCountdown(countLeft);
      };

      return () => {
        clearInterval(countId);
      };
    }, 1000);

  }, []);

  return (
    <section className='countdown'>
      <div className='countdown-content'>{countdown}</div>
    </section>
  );
};

Countdown.propTypes = {
  deezerIDs: PropTypes.arrayOf(PropTypes.number).isRequired,
  setShowCountdown: PropTypes.func.isRequired,
  setShowTimer: PropTypes.func.isRequired
};

export default Countdown;