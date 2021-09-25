import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Score = ({ score }) => {

  useEffect(() => {
    localStorage.setItem('score', score);
  }, [score]);

  return (
    <section className='score'>
      {score}
    </section>
  );
};

Score.propTypes = {
  score: PropTypes.number.isRequired
};

export default Score;