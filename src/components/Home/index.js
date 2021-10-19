// Import de la lib React
import React, { useEffect, useState } from 'react';

import PlaylistInfo from 'src/components/PlaylistInfo';
import Playlist from '../Playlist';
import Loading from '../Loading';

// Imports locaux
import './styles.scss';

const Home = ({ api }) => {

    const [showDetails, setShowDetails] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const [playlistLink, setPlaylistLink] = useState('');
  
    const [best, setBest] = useState(false);
    const [moment, setMoment] = useState(false);
    const [random, setRandom] = useState(false);
    const [base, setBase] = useState(false);

    const [userPlaylists, setUserPlaylists] = useState(false);
    const [userPlayed, setUserPlayed] = useState(false);
    const [userLiked, setUserLiked] = useState(false);

    useEffect(() => {
      setShowLoading(true);

      const wasPlaying = localStorage.getItem('playlist_id');

      if (wasPlaying) {
        window.location.reload();
        localStorage.removeItem('playlist_id');
      };
  
      document.title = "MAJA";
    }, []);
    
    let token = localStorage.getItem('token');

    useEffect(async () => {
      // GET playlists most played from all time
      await api.get('/playlists/bests/0')
      .then((res) => {
        if (res.data === []) {
          setBest(false);
        } else {
          setBest(res.data);
          setShowLoading(false);
        };
      })
      .catch((err) => {
        console.log(err);
      });

      // GET playlists most played this week
      await api.get('/playlists/bests/15')
      .then((res) => {
        if (res.data === []) {
          setMoment(false);
        } else {
          setMoment(res.data);
          setShowLoading(false);
        };
      })
      .catch((err) => {
        console.log(err);
      });

      // GET 10 random playlists
      await api.get('/playlists/random/50') 
      .then((res) => {
        if (res.data === []) {
          setRandom(false);
        } else {
          setRandom(res.data);
          setShowLoading(false);
        };
      })
      .catch((err) => {
        console.log(err);
      });

      // Playlists admin
      await api.get('/admin/playlists')
      .then((res) => {
        if (res.data === []) {
          setBase(false);
        } else {
          setBase(res.data);
          setShowLoading(false);
        };
      })
      .catch((err) => {
        console.log(err);
      });
      
      if(token){
        // GET user playlists
        await api.get('/user/playlists')
        .then((res) => {
          if (res.data === []) {
            setUserPlaylists(false);
          } else {
            setUserPlaylists(res.data);
            setShowLoading(false);
          };
        })
        .catch((err) => {
          console.log(err);
        });

        // GET user playlists recently played
        await api.get('/user/played')
        .then((res) => {
          if (res.data === []) {
            setUserPlayed(false);
          } else {
            setUserPlayed(res.data);
            setShowLoading(false);
          };
        })
        .catch((err) => {
          console.log('erreur :', err);
        });

        // GET user playlists most liked
        await api.get('/user/liked')
        .then((res) => {
          if (res.data === []) {
            setUserLiked(false);
          } else {
            setUserLiked(res.data);
            setShowLoading(false);
          };
        })
        .catch((err) => {
          console.log(err);
        });
      };
  }, []);

  return (
    <div className="home-playlist-container" >

      {showLoading &&
        <Loading />
      }
      
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
          api={api}
          playlistLink={playlistLink}
          setShowDetails={setShowDetails}
        />
      }
    </div>
  );
};

export default Home;