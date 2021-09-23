import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import "./style.scss";

let feat = false;
let scoring = 0;

const Input = ({
  setScore,
  artistFound,
  setArtistFound,
  titleFound,
  setTitleFound,
  setShowArtistFound,
  setShowTitleFound,
  setShowFeatFound,
  setShowBothFound,
  setShowTryAgain,
  setShowWaitMessage,
 }) => {

  const [proposal, setProposal] = useState("");

  useEffect(() => {
    scoring = 0;
  }, []);

  const handleChange = (value) => {
    setProposal(value);
  };

  // Tentative de mémorisation des premiers essais
  // let firstTry = [];

  function checkAnswer(answer, title, artist) {
    title = title.replace("-", "");
    artist = artist.replace("-", "");
    answer = answer.replace("-", "");

    title = title.replace(" ", "");
    artist = artist.replace(" ", "");
    answer = answer.replace(" ", "");

    title = title.replace(/[^a-zA-Z +\d]/g, "");
    artist = artist.replace(/[^a-zA-Z +\d]/g, "");
    answer = answer.replace(/[^a-zA-Z +\d]/g, "");

    feat = false;
    title = ftCheck(title);
    artist = ftCheck(artist);
    answer = ftCheck(answer);

    // If user already found title and artist, return
    if (artistFound && titleFound && !feat) {
      return;
    } else {
      if (answer.includes(title) && answer.includes(artist)) {
        // Give score with bonus
        scoring += 7;
        setScore(scoring);
        if (feat && answer.includes(feat)) {
          scoring += 1;
          setScore(scoring);
        };

        setTitleFound(true);
        setArtistFound(true);

        // Show congrats
        setShowBothFound(true);
      } else if (answer.includes(artist)) {
        if (!artistFound) {
          scoring += 2;
          setScore(scoring);
          setArtistFound(true);
          setShowArtistFound(true);
          if (titleFound) {
            scoring += 3;
            setScore(scoring);
            setShowArtistFound(false);
            setShowTitleFound(false);
            setShowBothFound(true);
          };
        };
      } else if (answer.includes(title)) {
        if (!titleFound) {
          scoring += 2;
          setScore(scoring);
          setTitleFound(true);
          setShowTitleFound(true);
          if (artistFound) {
            scoring += 3;
            setScore(scoring);
            setShowArtistFound(false);
            setShowTitleFound(false);
            setShowBothFound(true);
          };
        };
      } else if (feat && answer.includes(feat)) {
        scoring += 1;
        setScore(scoring);
        setShowFeatFound(true);
      } else {
        setShowTryAgain(true);
      };
    };
  };

  function ftCheck(elem) {
    if (elem.includes("feat")) {
      const index = elem.indexOf(" feat ");
      feat = elem.slice(index + 6);
      elem = elem.slice(0, index);
    };
    if (elem.includes(" with ")) {
      const index = elem.indexOf(" with ");
      feat = elem.slice(index + 6);
      elem = elem.slice(0, index);
    };
    if (elem.includes(" ft ")) {
      const index = elem.indexOf(" ft ");
      feat = elem.slice(index + 4);
      elem = elem.slice(0, index);
    };
    if (elem.includes(" remaster ")) {
      const index = elem.indexOf(" remaster ");
      elem = elem.slice(0, index);
    };

    return elem;
  };

  const handleSubmit = () => {
    // Hide other messages
    setShowWaitMessage(false);
    setShowArtistFound(false);
    setShowTitleFound(false);
    setShowFeatFound(false);
    setShowTryAgain(false);

    // firstTry.push(proposal);

    // const averifier = firstTry.join('')

    // Check if SDK is playing
    const isPlaying = DZ.player.isPlaying();

    // If there is no song playing, return & show message who say to wait
    if (!isPlaying) {
      setShowWaitMessage(true);
      return;
    } else {
      // Get the current track actually playing in Deezer's SDK
      const currentTrack = DZ.player.getCurrentTrack();

      // Get all informations we need in lower case
      const userProposal = proposal.toLowerCase();
      const title = currentTrack.title.toLowerCase();
      const artist = currentTrack.artist.name.toLowerCase();

      checkAnswer(userProposal, title, artist);
    };

    // Reset input
    setProposal("");
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <input
          className="input"
          type="text"
          placeholder="Trouvez l'artiste et le titre de la musique"
          value={proposal}
          onChange={(event) => {
            handleChange(event.target.value);
          }}
        />
      </form>
    </>
  );
};

Input.propTypes = {
  setScore: PropTypes.func.isRequired,
  artistFound: PropTypes.bool.isRequired,
  setArtistFound: PropTypes.func.isRequired,
  titleFound: PropTypes.bool.isRequired,
  setTitleFound: PropTypes.func.isRequired,
  setShowArtistFound: PropTypes.func.isRequired,
  setShowTitleFound: PropTypes.func.isRequired,
  setShowFeatFound: PropTypes.func.isRequired,
  setShowBothFound: PropTypes.func.isRequired,
  setShowTryAgain: PropTypes.func.isRequired,
  setShowWaitMessage: PropTypes.func.isRequired
};

export default Input;