import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import './style.scss';

// Set scoring
let scoring = 0;
let feat = false;

const Game = ({ baseURL }) => {

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
  const [firstTry, setFirstTry] = useState([]);
  const [proposal, setProposal] = useState('');
  const [score, setScore] = useState(0);
  const [previousTrack, setPreviousTrack] = useState('');
  const [previousArtist, setPreviousArtist] = useState('');
  const [previousImg, setPreviousImg] = useState('');
  const [artistFound, setArtistFound] = useState(false);
  const [titleFound, setTitleFound] = useState(false);
  const [deezerIDs, setDeezerIDs] = useState([]);
  const [musicVolume, setMusicVolume] = useState(20);
  const [tracks, setTracks] = useState(10);

  const [countdown, setCountdown] = useState(5);
  const [timer, setTimer] = useState(30);

  // Init cooldown beetwen every song played (in s) & number of tracks for a game
  const cooldown = 5;
  const nbOfTracks = 10;
  
  // Init axios requests
  const api = axios.create({
    baseURL: baseURL
  });

  const interval = useRef();
  const countInterval = useRef();
  const timerInterval = useRef();
  const ratingSection = useRef();

  // Init Deezer's SDK
  useEffect ( () => {
    if (DZ.player.isPlaying()) {
      DZ.player.pause();
    };

    const intervalId = interval.current;
    const countdownInterval = countInterval.current;
    const timerSong = timerInterval.current;

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
        DZ.player.playTracks([]);
        window.clearInterval();
        DZ.player.pause();
        clearInterval(intervalId);
        clearInterval(countdownInterval);
        clearInterval(timerSong);
      }
  }, []);

  const handleChange = (value) => {
    setProposal(value);
  };

  const firstAttempts = [];

  const handleSubmit = () => {

    // Hide other messages
    setShowArtistFound(false);
    setShowTitleFound(false);
    setShowFeatFound(false);
    setShowTryAgain(false);

    // Check if SDK is playing
    const isPlaying = DZ.player.isPlaying();

    // If there is no song playing, return & show message who say to wait
    if (!isPlaying) {
      setShowWaitMessage(true);
      return;
    } else {

      // We save it on an array
      firstAttempts.push(proposal);

      // And we use this array for check user's answer. It will join the previous and next tries of the user.
      const userTry = firstAttempts.join('').toLowerCase();

      // Get the current track actually playing in Deezer's SDK
      const currentTrack = DZ.player.getCurrentTrack();

      // Get all informations we need in lower case
      const userProposal = userTry.toLowerCase();
      const title = currentTrack.title.toLowerCase();
      const artist = currentTrack.artist.name.toLowerCase();

      checkAnswer(userProposal, title, artist);
    };

    function checkAnswer(answer, title, artist) {
      title = title.replace("-", " ");
      artist = artist.replace("-", " ");
      answer = answer.replace("-", " ");

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
          scoring+=7;
          setScore(scoring);
          if(feat && answer.includes(feat)){
            scoring+=1;
            setScore(scoring);
          }

          setTitleFound(true);
          setArtistFound(true);

          // Show congrats
          setShowArtistFound(false);
          setShowTitleFound(false);
          setShowBothFound(true);
          
        } else if (answer.includes(artist)) {
          if (!artistFound) {
            scoring+=2;
            setScore(scoring);
            setArtistFound(true);
            setShowArtistFound(true);
            if (titleFound) {
              scoring+=3;
              setScore(scoring);
              setShowArtistFound(false);
              setShowTitleFound(false);
              setShowBothFound(true);
            };
          };
        } else if (answer.includes(title)) {
          if (!titleFound) {
            scoring+=2;
            setScore(scoring);
            setTitleFound(true);
            setShowTitleFound(true);
            if (artistFound) {
              scoring+=3;
              setScore(scoring);
              setShowArtistFound(false);
              setShowTitleFound(false);
              setShowBothFound(true);
            };
          };
        } else if (feat && answer.includes(feat)){
          scoring+=1;
          setScore(scoring);
          setShowFeatFound(true);
        } else {
          setShowTryAgain(true);
        }
      }
    }

    function ftCheck(e){
      if (e.includes('feat')){
        const index = e.indexOf(' feat ');
        feat = e.slice(index+6);
        e=e.slice(0,index);
      }
      if (e.includes(' with ')){
        const index = e.indexOf(' with ');
        feat = e.slice(index+6);
        e=e.slice(0,index);
      }
      if (e.includes(' ft ')){
        const index = e.indexOf(' ft ');
        feat = e.slice(index+4);
        e=e.slice(0,index);
      }
      if (e.includes(' remaster ')){
        const index = e.indexOf(' remaster ');
        e=e.slice(0,index);
      }

      return e
    };

    // Reset input
    setProposal('');
  };

  // Launch the game
  const playGame = () => {

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
    
    let countLeft = countdown;
    let countId = setInterval(() => {
      if (countLeft === 1) {
        setShowCountdown(false);
        clearTimeout(countId);
        setShowWaitMessage(false);
        // Launch the selected playlist with the timer
        DZ.player.playTracks(deezerIDs);
        launchTimer();
      } else {
        countLeft--;
        setCountdown(countLeft);
      }
    }, 1000);

    countInterval.current = countId;

    let tracksLeft = tracks;
    // Go to the next track after timer
    const nextTrack = setInterval(() => {

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
        endGame();
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
          launchTimer();
          DZ.player.next();
          // & we show the previous song
          if (showPrevious === false) {
            setShowPrevious(true);
          }
        }, cooldown*1000);
        interval.current = nextTrack;
      }
      return true;
    }, timer*1000 + cooldown*1000);
  };

  const launchTimer = () => {
    // Show timer
    setShowTimer(true);
    
    let timeLeft = timer;
    let timerId = setInterval(() => {
      if (timeLeft === 1) {
        setShowTimer(false);
        setTimer(timer);
        // Set volume
        DZ.player.pause();
        // Reset the timer state
        clearTimeout(timerId);
      } else {
        timeLeft--;
        setTimer(timeLeft);
      }
    }, 1000);
    timerInterval.current = timerId;
  };
  
  const endGame = () => {

    const token = localStorage.getItem('token');
    const playlistID = localStorage.getItem('playlist_id');

    setTimeout(() => {

      // Send score to back
      if (token) {
        api.post('/playlist/game', {
          score: scoring,
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

      // Show the score & the redirect button
      setShowVolume(false);
      setShowAnswer(false);
      setShowScore(false);
      setShowPrevious(false);
      setShowEndgame(true);
    }, cooldown*1000);
  };

  const giveRate = (rate) => {

    const playlistID = localStorage.getItem('playlist_id');
    const token = localStorage.getItem('token');

    // Send rating to back
    api.post('/playlist/rating', {
      playlist_id: playlistID,
      rating: rate,
    }, {
      headers: {
        Authorization: token
      }
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });

    // Hide rating section
    ratingSection.current.style.transform = "translateY(-10em)";
  };

  return (
    <div className="game">
      {showScore &&
        <section className="game-score">
          {score}
        </section>
      }
      {showAnswer &&
        <section className="game-answer">

          <img src={previousImg} className="game-answer-img" />

          <div className="game-answer-content">
            <p>C'était " <span className="game-answer-content-track">{previousTrack}</span> "</p> 
            <hr />
            <p>de <span className="game-answer-content-track">{previousArtist}</span> !</p>
          </div>
          
        </section>
      }
      {showPrevious &&
        <section className="game-previous">
          <p className="game-previous-song">Chanson précédente :</p>

          <div className="game-previous-content">

            <img src={previousImg} className="game-previous-content-img" />

            <div className="game-previous-content-description">
              <span>{previousTrack}</span>
              <hr />
              <span>{previousArtist}</span>
            </div>

          </div>
        </section>
      }
      {showEndgame &&
        <section className="game-result">
          <div className="game-result-text">
            <span className="game-result-text-title"> Fin de la partie </span>
            <hr />
            <span className="game-result-text-score">Votre score est de {score} !</span>
          </div>
          <NavLink
            exact to="/"
            className="game-result-button"
            onClick={() => {
              localStorage.removeItem('playlist_id');
            }}>
              Revenir à l'accueil
          </NavLink>
        </section>
      }
      {showCountdown &&
        <div className="game-countdown">
          <div className="game-countdown-content">{countdown}</div>
        </div>
      }
      {showTimer &&
        <div className="game-timer">
          <div className="game-timer-content">{timer}</div>
        </div>
      }
      {showBefore &&
        <section className="game-before">
          <div className="game-before-rules">
            <h1 className="game-before-rules-title">Règles du jeu</h1>
            <hr />
            <ul className="game-before-rules-description">
              <li className="game-before-rules-description-rule"> Trouvez l'artiste et le titre de la chanson que vous entendez </li>
              <li className="game-before-rules-description-rule"> Vous avez {timer} secondes pour écrire votre proposition dans le champ en bas de l'écran </li>
              <li className="game-before-rules-description-rule"> Vous gagnez 2 points si vous trouvez l'artiste ou le titre </li>
              <li className="game-before-rules-description-rule"> Vous gagnez 3 points supplémentaires si vous trouvez les deux </li>
              <li className="game-before-rules-description-rule"> Certaines musiques cachent 1 point bonus si elles ont un featuring : à vous d'y être attentif</li>
            </ul>
          </div>

          <div className="game-before-warning">
            <p>Attention ! Certains navigateurs n'autorisent pas automatiquement la lecture de son. Si vous n'avez pas de son alors que le chrono est lancé, allez dans les paramètres de votre navigateur pour l'autoriser sur notre site et rafraïchissez la page. Et les navigateurs sur smartphone ne sont pas compatibles avec le lecteur, vous ne pourrez jouer que sur un ordinateur.</p>
          </div>

          <input
            type="button"
            className="game-before-button"
            value="Lancer la partie"
            onClick={() => {
              playGame();
            }}
          />
        </section>
      }
      {showInput &&
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit(event.target.value);
          }}
        >
          <input
            className="game-input"
            placeholder="Trouvez l'artiste et le titre de la chanson"
            type="text"
            value={proposal}
            onChange={(event) => {
              handleChange(event.target.value);
            }}
          />
        </form>
      }

      {showVolume &&
        <section className="game-volume">

          <p className="game-volume-value">Volume : {musicVolume}</p>

          <button 
            className="game-volume-button"
            onClick={() => {
              if (musicVolume > 0) {
                setMusicVolume(musicVolume - 5);
                DZ.player.setVolume(musicVolume - 5);
              }
            }}
          >
            -
          </button>

          <button 
            className="game-volume-button"
            onClick={() => {
              if (musicVolume < 100) {
                setMusicVolume(musicVolume + 5);
                DZ.player.setVolume(musicVolume + 5);
              }
            }}
          >
            +
          </button>

        </section>
      }

      {showRating &&
        <section className="game-rating" ref={ratingSection}>

          <p className="game-rating-title"> Notez cette playlist </p>

          <div className="game-rating-stars">

            <input 
              className="game-rating-stars-item"
              type="button"
              value="☆"
              onClick={() => {giveRate(1)}}
            />

            <input 
              className="game-rating-stars-item"
              type="button"
              value="☆"
              onClick={() => {giveRate(2)}}
            />

            <input 
              className="game-rating-stars-item"
              type="button"
              value="☆"
              onClick={() => {giveRate(3)}}
            />

            <input 
              className="game-rating-stars-item"
              type="button"
              value="☆"
              onClick={() => {giveRate(4)}}
            />

            <input 
              className="game-rating-stars-item"
              type="button"
              value="☆"
              onClick={() => {giveRate(5)}}
            />

          </div>

        </section>
      }

      {showTitleFound &&
        <section className="game-found">
          <p> Bravo ! C'est bien cette chanson ! </p>
        </section>
      }

      {showArtistFound &&
        <section className="game-found">
          <p> Bien joué ! C'est bien ça ! </p>
        </section>
      }

      {showFeatFound &&
        <section className="game-found">
          <p> Yeah ! Tu as trouvé un feat, 1 point bonus ! </p>
        </section>
      }

      {showBothFound &&
        <section className="game-found">
          <p> Bravo ! Tu as trouvé le titre et l'artiste ! </p>
        </section>
      }

      {showTryAgain &&
        <section className="game-not_found">
          <p> Non ! Essaie encore. </p>
        </section>
      }

      {showWaitMessage &&
        <section className="game-not_found">
          <p> Attendez le prochain morceau </p>
        </section>
      }

    </div>
  )
};

Game.propTypes = {
    baseURL: PropTypes.string.isRequired
};

export default Game;
