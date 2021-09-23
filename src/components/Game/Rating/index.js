import React, { useRef } from "react";
import PropTypes from 'prop-types';

import "./style.scss";

const Rating = ({ api, setShowRating }) => {

  const ratingSection = useRef(null);

  const giveRate = (rate) => {
    const playlistID = localStorage.getItem('playlist_id');
    // Send rating to back
    api.post('/playlist/rating', {
      playlist_id: playlistID,
      rating: rate,
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });

    // Hide rating section
    ratingSection.current.style.transform = "translateY(-10em)";

    setTimeout(() => {
      setShowRating(false);
    }, 1000);
  };

  return (
    <div className="rating">
      <section className="rating" ref={ratingSection}>

        <p className="rating-title"> Notez cette playlist </p>

        <div className="rating-stars">
          <input
            className="rating-stars-item"
            type="button"
            value="☆"
            onClick={() => {
              giveRate(1);
            }}
          />

          <input
            className="rating-stars-item"
            type="button"
            value="☆"
            onClick={() => {
              giveRate(2);
            }}
          />

          <input
            className="rating-stars-item"
            type="button"
            value="☆"
            onClick={() => {
              giveRate(3);
            }}
          />

          <input
            className="rating-stars-item"
            type="button"
            value="☆"
            onClick={() => {
              giveRate(4);
            }}
          />

          <input
            className="rating-stars-item"
            type="button"
            value="☆"
            onClick={() => {
              giveRate(5);
            }}
          />
        </div>
      </section>
    </div>
  );
};

Rating.propTypes = {
  setShowRating: PropTypes.func.isRequired
};

export default Rating;