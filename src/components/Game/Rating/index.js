import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

import Notification from "../../Notification";

import "./style.scss";

const Rating = ({ api, setShowRating }) => {

  const stars = Array(5).fill(0);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

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

    // Hide rating section & show notification
    ratingSection.current.style.transform = "translateY(-20em)";
    setShowNotification(true);

    setTimeout(() => {
      setShowRating(false);
    }, 10000);
  };

  return (
    <>
      <section className="rating" ref={ratingSection}>

        <p className="rating-title"> Notez cette playlist </p>

        <div className="rating-stars">
          
          {stars.map((star, index) => {

            const value = index + 1;

            return (
              <FaStar
                key={index}
                className="rating-stars-item"
                color={value <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                onClick={() => {
                  setRating(value);
                  giveRate(value);
                }}
                onMouseEnter={() => {
                  setHover(value);
                }}
              />
            );
          })}
        </div>
      </section>

      { showNotification &&
        <Notification
          setShowNotification={setShowNotification}
        >
          Vous avez donné une note de {rating}/5 à cette playlist
        </Notification>
      }
    </>
  );
};

Rating.propTypes = {
  setShowRating: PropTypes.func.isRequired
};

export default Rating;