import React, { useEffect, useState } from 'react';
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

  // DOM values
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

  // Init Deezer's SDK
  useEffect ( () => {

    if (DZ.player.isPlaying()) {
      DZ.player.setMute(true);
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
  }, []);

  const handleChange = (value) => {
    setProposal(value);
  };

  const handleSubmit = () => {

    // Reset 'try again' message
    setShowTryAgain(false);

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

    function checkAnswer(answer, title, artist) {
      title = title.replace("-", " ");
      artist = artist.replace("-", " ");
      answer = answer.replace("-", " ");

      title = title.replace(/[^a-zA-Z +\d]/g, "");
      artist = artist.replace(/[^a-zA-Z +\d]/g, "");
      answer = answer.replace(/[^a-zA-Z +\d]/g, "");

      console.log(artist);

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
          setShowTitleFound(true);
          setShowArtistFound(true);
          
        } else if (answer.includes(artist)) {
          if (!artistFound) {
            scoring+=2;
            setScore(scoring);
            setArtistFound(true);
            setShowArtistFound(true);
            if (titleFound) {
              scoring+=3;
              setScore(scoring);
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
            };
          };
        } else if(feat && answer.includes(feat)){
          scoring+=1;
          setScore(scoring);
        } else {
          setShowTryAgain(true);
        }
      }
    }

    function ftCheck(e){
      if(e.includes('feat')){
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
    }
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

        // The game is over
        endGame();
        DZ.player.setVolume(0);
        clearTimeout(nextTrack);
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
      }
      return true;
    }, timer*1000 + cooldown*1000);
  };

  const launchTimer = () => {
    // Show timer
    setShowTimer(true);

    // Set volume
    DZ.player.setVolume(musicVolume);
    
    let timeLeft = timer;
    let timerId = setInterval(() => {
      if (timeLeft === 1) {
        setShowTimer(false);
        setTimer(timer);
        // Set volume
        DZ.player.setVolume(0);
        // Reset the timer state
        clearTimeout(timerId);
      } else {
        timeLeft--;
        setTimer(timeLeft);
      }
    }, 1000);
  };
  
  const endGame = () => {

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
      setShowArtistFound(false);
      setShowTitleFound(false);
      setShowTryAgain(false);
      setShowWaitMessage(false);
      setShowInput(false);
      setShowVolume(false);
      setShowEndgame(true);
    }, cooldown*1000);
  };

  const giveRate = (rate) => {

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
    setShowRating(false);
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
          <span className="game-result-end"> Fin de la partie </span>
          <span className="game-result-score">Votre score est de {score} !</span>
          <hr />
          <a 
            href="/"
            className="game-result-redirect"
            onClick={() => {
              localStorage.removeItem('playlist_id');
            }}>
              Revenir à l'accueil
            </a>
        </section>
      }
      {showCountdown &&
        <div className="game-countdown">{countdown}</div>
      }
      {showTimer &&
        <div className="game-timer">{timer}</div>
      }
      {showBefore &&
        <section className="game-before">
          <div className="game-before-rules">
            <h1 className="game-before-rules-title">Règles du jeu</h1>
            <hr />
            <ul className="game-before-rules-description">
              <li> Trouvez l'artiste et le titre de la chanson que vous entendez </li>
              <li> Vous avez {timer} secondes pour écrire votre proposition dans le champ en bas de l'écran </li>
              <li> Vous gagnez 2 points si vous trouvez l'artiste ou le titre </li>
              <li> Vous gagnez 3 points supplémentaires si vous trouvez les deux </li>
              <li> Certaines musiques cachent 1 point bonus si elles ont un featuring : à vous d'y être attentif</li>
            </ul>
          </div>

          <div className="game-before-warning">
            <p>Attention ! Certains navigateurs n'autorisent pas automatiquement la lecture de son. Si vous n'avez pas de son alors que le chrono est lancé, allez dans les paramètres de votre navigateur pour l'autoriser sur notre site et rafraïchissez la page.</p>
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
        <section className="game-rating">

          <div className="game-rating-title"> Notez cette playlist </div>

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
        <section className="game-title_found">
          <p> Bravo ! C'est bien cette chanson ! </p>
        </section>
      }

      {showArtistFound &&
        <section className="game-artist_found">
          <p> Bravo ! C'est bien ça ! </p>
        </section>
      }

      {showTryAgain &&
        <section className="game-try_again">
          <p> Non ! Essaie encore. </p>
        </section>
      }

      {showWaitMessage &&
        <section className="game-wait_message">
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
