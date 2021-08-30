// Import de la lib React
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlaylistInfo from 'src/components/PlaylistInfo';
import Playlist from '../Playlist';

// Imports NPM
import axios from 'axios';

// Imports locaux
import './styles.scss';

const Home = ({ baseURL, setLogged }) => {


    const [showDetails, setShowDetails] = useState(false);
    const [playlistLink, setPlaylistLink] = useState('');
  
    const [best, setBest] = useState(false);
    const [moment, setMoment] = useState(false);
    const [random, setRandom] = useState(false);
    const [base, setBase] = useState(false);

    const [userPlaylists, setUserPlaylists] = useState(false);
    const [userPlayed, setUserPlayed] = useState(false);
    const [userLiked, setUserLiked] = useState(false);

    const api = axios.create({
      baseURL: baseURL
    });

    useEffect(async () => {

      const wasPlaying = localStorage.getItem('playlist_id');

      if (wasPlaying) {
        window.location.reload();
        localStorage.removeItem('playlist_id');
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
        if(res.data === []){
          setBest(false);
        }else{
          setBest(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })

      // GET playlists most played this week
      await api.get('/playlists/bests/7')
      .then((res) => {
        if(res.data === []){
          setMoment(false);
        }else{
          setMoment(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })

      // GET 10 random playlists
      await api.get('/playlists/random/10')
      .then((res) => {
        if(res.data === []){
          setRandom(false);
        }else{
          setRandom(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })

      // Playlists admin
      await api.get('/admin/playlists')
      .then((res) => {
        if(res.data === []){
          setBase(false);
        }else{
          setBase(res.data);
        }
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
      <div className="home-playlist-container" >

        {best &&
          <Playlist
            title='Les intemporelles'
            playlists={best}
            setPlaylistLink={setPlaylistLink}
            setShowDetails={setShowDetails}
          />
        }
        {moment &&
          <Playlist
            title='Playlists du moment'
            playlists={moment}
            setPlaylistLink={setPlaylistLink}
            setShowDetails={setShowDetails}
          />
        }
        {base &&
          <Playlist
            title='Les classiques'
            playlists={base}
            setPlaylistLink={setPlaylistLink}
            setShowDetails={setShowDetails}
          />
        }
        {random &&
          <Playlist
            title='Aléatoire'
            playlists={random}
            setPlaylistLink={setPlaylistLink}
            setShowDetails={setShowDetails}
          />
        }
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
