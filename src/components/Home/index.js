// Import de la lib React
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlaylistInfo from 'src/components/PlaylistInfo';
import Playlist from '../Playlist';

// Imports NPM
import axios from 'axios';

// Imports locaux
import './styles.scss';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png'
import playlist from '../../../public/img/playlist/playlist-placeholder.png';
import rating from '../../../public/img/playlist/rating.png';

const Home = ({ baseURL, setLogged }) => {


    const [showDetails, setShowDetails] = useState(false);
    const [playlistLink, setPlaylistLink] = useState('');
  
    const [best, setBest] = useState(null);
    const [moment, setMoment] = useState(null);
    const [random, setRandom] = useState(null);
    const [base, setBase] = useState(null);

    const [userPlaylists, setUserPlaylists] = useState(false);
    const [userPlayed, setUserPlayed] = useState(false);
    const [userLiked, setUserLiked] = useState(false);

    const api = axios.create({
      baseURL: baseURL
    });

    useEffect(async () => {

      if (DZ.player.isPlaying()) {
        DZ.player.mute();
      };
  
      document.title = "MAJA";

      const token = localStorage.getItem('token');
      if (token) {
        setLogged(true);
      } else {
        setLogged(false);
      };
      // GET playlists most played from all time
      await api.get('/playlists/bests/0')
      .then((res) => {
        setBest(res.data);
      })
      .catch((err) => {
        console.log(err);
      })

      // GET playlists most played this week
      await api.get('/playlists/bests/7')
      .then((res) => {
        setMoment(res.data);
      })
      .catch((err) => {
        console.log(err);
      })

      // GET 10 random playlists
      await api.get('/playlists/random/10')
      .then((res) => {
        setRandom(res.data);
      })
      .catch((err) => {
        console.log(err);
      })

      // Playlists admin
      await api.get('/admin/playlists')
      .then((res) => {
        setBase(res.data);
      })
      .catch((err) => {
        console.log(err);
      })

      if(token){
        // GET user playlists
        await api.get('/user/playlists',{
          headers: {
            authorization: token
          }
        })
        .then((res) => {
          if(res.data === []){
            setUserPlaylists(false);
          }else{
            setUserPlaylists(res.data);
          }
        })
        .catch((err) => {
          console.log(err.message);
        })

        // GET user playlists recently played
        await api.get('/user/played',{
          headers: {
            authorization: token
          }
        })
        .then((res) => {
          if(res.data === []){
            setUserPlayed(false);
          }else{
            setUserPlayed(res.data);
          }
        })
        .catch((err) => {
          console.log('erreur :', err);
        })

        // GET user playlists most liked
        await api.get('/user/liked',{
          headers: {
            authorization: token
          }
        })
        .then((res) => {
          if(res.data === []){
            setUserLiked(false);
          }else{
            setUserLiked(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        })
      }

    }, []);

    return (
      <div className="home-playlist-container">
        <Playlist
          title='Les intemporelles'
          playlists={best}
          setPlaylistLink={setPlaylistLink}
          setShowDetails={setShowDetails}
        />

        <Playlist
          title='Playlists du moment'
          playlists={moment}
          setPlaylistLink={setPlaylistLink}
          setShowDetails={setShowDetails}
        />

        <Playlist
          title='Les classiques'
          playlists={base}
          setPlaylistLink={setPlaylistLink}
          setShowDetails={setShowDetails}
        />

        <Playlist
          title='Aléatoire'
          playlists={random}
          setPlaylistLink={setPlaylistLink}
          setShowDetails={setShowDetails}
        />

        {userPlayed &&
          <Playlist
            title='Récemment jouées'
            playlists={userPlayed}
            setPlaylistLink={setPlaylistLink}
            setShowDetails={setShowDetails}
          />
        }
        {userPlaylists &&
          <Playlist
            title='Vos playlists'
            playlists={userPlaylists}
            setPlaylistLink={setPlaylistLink}
            setShowDetails={setShowDetails}
          />
        }
        {userLiked &&
          <Playlist
            title='Parce que vous les avez aimées'
            playlists={userLiked}
            setPlaylistLink={setPlaylistLink}
            setShowDetails={setShowDetails}
          />
        }

        {showDetails && 
          <PlaylistInfo
            baseURL={baseURL}
            playlistLink={playlistLink}
            setShowDetails={setShowDetails}
          />
        }
     </div>
  )
};

Home.propTypes = {
  baseURL: PropTypes.string.isRequired,
  setLogged: PropTypes.func.isRequired
};

export default Home;
