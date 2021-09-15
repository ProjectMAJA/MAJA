import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Previous = ({ previousImg, previousTrack, previousArtist }) => {

  return (
    <section className="previous">
      <p className="previous-song">Chanson précédente :</p>

      <div className="previous-content">

        <img src={previousImg} className="previous-content-img" />

        <div className="previous-content-description">
          <span>{previousTrack}</span>
          <hr />
          <span>{previousArtist}</span>
        </div>

      </div>
    </section>
  );
};

Previous.propTypes = {
  previousImg: PropTypes.string.isRequired,
  previousTrack: PropTypes.string.isRequired,
  previousArtist: PropTypes.string.isRequired
};

export default Previous;