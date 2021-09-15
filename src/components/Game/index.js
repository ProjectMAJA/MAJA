import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './style.scss';

import Before from './Before';
import Countdown from './Countdown';
import Timer from './Timer';
import Input from './Input';
import Score from './Score';
import Answer from './Answer';
import Previous from './Previous';
import Volume from './Volume';
import Rating from './Rating';
import EndGame from './EndGame';

const Game = ({ baseURL, logged }) => {

  // DOM elements
  const [showBefore, setShowBefore] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showEndgame, setShowEndgame] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showArtistFound, setShowArtistFound] = useState(false);
  const [showTitleFound, setShowTitleFound] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [showWaitMessage, setShowWaitMessage] = useState(false);
  const [showBothFound, setShowBothFound] = useState(false);
  const [showFeatFound, setShowFeatFound] = useState(false);

  // Values states
  const [score, setScore] = useState(0);
  const [previousTrack, setPreviousTrack] = useState('');
  const [previousArtist, setPreviousArtist] = useState('');
  const [previousImg, setPreviousImg] = useState('');
  const [artistFound, setArtistFound] = useState(false);
  const [titleFound, setTitleFound] = useState(false);
  const [deezerIDs, setDeezerIDs] = useState([]);
  const [musicVolume, setMusicVolume] = useState(20);
  const [tracks, setTracks] = useState(10);
  const [timer, setTimer] = useState(30);

  // Init cooldown beetwen every song played (in s) & number of tracks for a game
  const cooldown = 5;
  const nbOfTracks = 10;

  // Init axios requests
  const api = axios.create({
    baseURL: baseURL
  });

  let nextTrack = useRef(null);

  useEffect(() => {
    if (DZ.player.isPlaying()) {
      DZ.player.pause();
    };

    document.title = "MAJA - Blind test";

    const playlistID = localStorage.getItem('playlist_id');

    api.get(`/playlist/${playlistID}`)
      .then((res) => {
        let data = res.data.deezer_ids;
        let lengthArray = data.length;
        const tracks_ids = [];
        // Get 10 random tracks from the playlist received
        for ( let i=0; i<nbOfTracks; i++ ) {
          lengthArray = data.length;
          const randomID = data[Math.floor(Math.random() * lengthArray)];
          data = data.filter((elem) => elem != randomID);
          tracks_ids.push(randomID);
        };
        setDeezerIDs(tracks_ids);
      })
      .catch((err) => {
        console.log(err.response);
      });

      return () => {
        DZ.player.pause();
        DZ.player.playTracks([]);
        window.clearInterval();
        clearInterval(nextTrack.current);
      };
  }, []);

  // Launch the game
  const playGame = () => {

    DZ.player.setVolume(musicVolume);

    // Hide button & show input & score
    setShowBefore(false);
    setShowInput(true);
    setShowScore(true);
    setShowVolume(true);
    setShowCountdown(true);

    const token = localStorage.getItem('token');

    if (token) {
      setShowRating(true);
    };

    let tracksLeft = tracks;
    // Go to the next track after timer
    nextTrack = setInterval(() => {

      // If there is no track left
      if (tracksLeft === 1) {
        // Get the current track
        const currentTrack = DZ.player.getCurrentTrack();
        // We pause the track
        DZ.player.pause();
        
        setPreviousArtist(currentTrack.artist.name);
        setPreviousTrack(currentTrack.title);

        DZ.api('/track/' + currentTrack.id, (res) => {
          setPreviousImg(res.artist.picture_medium);
        });

        // We hide the timer, show what the good answer was
        setShowTimer(false);
        setShowAnswer(true);

        // Hide messages and input
        setShowArtistFound(false);
        setShowTitleFound(false);
        setShowTryAgain(false);
        setShowFeatFound(false);
        setShowBothFound(false);
        setShowWaitMessage(false);
        setShowInput(false);

        // The game is over
        setShowEndgame(true);
        clearInterval(nextTrack);
      } else {
        // Get the current track
        const currentTrack = DZ.player.getCurrentTrack();
        // We pause the track
        DZ.player.pause();
        setTracks(tracksLeft);
        tracksLeft--;
        
        setPreviousArtist(currentTrack.artist.name);
        setPreviousTrack(currentTrack.title);

        DZ.api('/track/' + currentTrack.id, (res) => {
          setPreviousImg(res.artist.picture_medium);
        });

        // We hide the timer, show what the good answer was
        setShowTimer(false);
        setShowAnswer(true);

        // Reset artistFound, titleFound & bothFound for bonus points
        setTitleFound(false);
        setArtistFound(false);

        // Hide the congratulations && / || the "try again" message
        setShowArtistFound(false);
        setShowTitleFound(false);
        setShowTryAgain(false);
        setShowBothFound(false);
        setShowFeatFound(false);

        // Little timer between every track
        setTimeout(() => {
          // Then, we play the next track with the main timer
          setShowWaitMessage(false);
          setShowAnswer(false);
          DZ.player.next();
          setShowTimer(true);
          // & we show the previous song
          if (showPrevious === false) {
            setShowPrevious(true);
          };
        }, cooldown*1000);
      };
      return true;
    }, timer*1000 + cooldown*1000);
  };

  return (

    <div className="game">

      {showScore &&
        <Score 
          score={score}
        />
      }

      {showAnswer &&
        <Answer
          previousImg={previousImg}
          previousArtist={previousArtist}
          previousTrack={previousTrack}
        />
      }

      {showPrevious &&
        <Previous
          previousImg={previousImg}
          previousTrack={previousTrack}
          previousArtist={previousArtist}
        />
      }

      {showCountdown &&
        <Countdown
          deezerIDs={deezerIDs}
          setShowCountdown={setShowCountdown}
          setShowTimer={setShowTimer}
        />
      }

      {showTimer &&
        <Timer 
          setShowTimer={setShowTimer}
          timer={timer}
          setTimer={setTimer}
        />
      }

      {showBefore &&
        <Before 
          playGame={playGame}
          timer={timer}
        />
      }

      {showInput &&
        <Input
          setScore={setScore}

          artistFound={artistFound}
          setArtistFound={setArtistFound}

          titleFound={titleFound}
          setTitleFound={setTitleFound}
          
          setShowArtistFound={setShowArtistFound}
          setShowTitleFound={setShowTitleFound}
          setShowFeatFound={setShowFeatFound}
          setShowBothFound={setShowBothFound}
          setShowTryAgain={setShowTryAgain}
          setShowWaitMessage={setShowWaitMessage}
        />
      }

      {showVolume &&
        <Volume 
          musicVolume={musicVolume}
          setMusicVolume={setMusicVolume}
        />
      }

      {logged && showRating &&
        <Rating 
          baseURL={baseURL}
          setShowRating={setShowRating}
        />
      }

      {showEndgame &&
        <EndGame
          baseURL={baseURL}
          score={score}
          cooldown={cooldown}
          setShowVolume={setShowVolume}
          setShowAnswer={setShowAnswer}
          setShowPrevious={setShowPrevious}
          setShowScore={setShowScore}
          setShowEndgame={setShowEndgame}
        />
      }

      {showTitleFound && (
        <section className="game-found">
          <p> Bravo ! C'est bien cette chanson ! </p>
        </section>
      )}

      {showArtistFound && (
        <section className="game-found">
          <p> Bien joué ! C'est bien ça ! </p>
        </section>
      )}

      {showFeatFound && (
        <section className="game-found">
          <p> Yeah ! Tu as trouvé un feat, 1 point bonus ! </p>
        </section>
      )}

      {showBothFound && (
        <section className="game-found-all">
          <p> Bravo ! Tu as trouvé le titre et l'artiste ! </p>
        </section>
      )}

      {showTryAgain && (
        <section className="game-not_found">
          <p> Non ! Essaie encore. </p>
        </section>
      )}

      {showWaitMessage && (
        <section className="game-not_found">
          <p> Attendez le prochain morceau </p>
        </section>
      )}

    </div>
  )
};

Game.propTypes = {
  baseURL: PropTypes.string.isRequired,
  logged: PropTypes.bool.isRequired
};

export default Game;
