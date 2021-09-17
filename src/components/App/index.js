// == Import npm
import React, { useState, useEffect } from 'react';
import { Route, Switch } from "react-router-dom";
import axios from 'axios';

import Home from "src/components/Home";
import Menu from "src/components/Menu";
import Profil from "src/components/Profil";
import Game from "src/components/Game";
import Team from 'src/components/Team';
import Error from 'src/components/Error';
import PlaylistUpdate from 'src/components/PlaylistUpdate';
import PlaylistCreate from 'src/components/PlaylistCreate';
import Admin from 'src/components/Admin';
import UserPlaylists from 'src/components/UserPlaylists';
import Search from 'src/components/Search';
import Contact from 'src/components/Contact';

import './style.scss';

// == Composant
const App = () => {

  const [logged, setLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // const baseURL = "https://api-maja.herokuapp.com/v1";
  const baseURL = "http://localhost:3333/v1";
  let token = localStorage.getItem('token');
  let refreshToken = localStorage.getItem('refresh_token');

  const api = axios.create({
    baseURL: baseURL
  });
  
  // Set AJAX requests
  api.interceptors.response.use((response) => {
    return response;
  }, async (error) => {
    const originalRequest = error.config;
    if(error.config.url != '/refreshToken' && error.response.status === 401 && originalRequest._retry !== true) {
      originalRequest._retry = true;
      if(refreshToken && refreshToken != '') {
        api.defaults.headers.common['Authorization'] = `Bearer ${refreshToken}`;
        await api.post('/refreshToken')
          .then((res) => {
            console.log('res in api instance, in res of post refreshToken: ' + res) // Undefined ?? Wtf
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
            originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
          })
          .catch((err) => {
            console.log('error in api instance, in catch of post refreshToken : ' + err);
            refreshToken = null;
          });
          return api(originalRequest);
      };
    };
  });

  useEffect(() => {
    // Init the Deezer's player
    DZ.init({
      appId: '492382',
      channelUrl: `client/public/channel.html`,
      player: {
        onload: () => {
          console.log('player loaded');
        }
      }
    });

    if (token) {
      api.get('/user', {
        headers: {
          Authorization: token
        }
      })
        .then((res) => {
          setLogged(true);

          if (res.data.isadmin === true) {
            setIsAdmin(true);
          };
        })
        .catch((err) => {
          setLogged(false);
          setIsAdmin(false);
          console.log('error in App : ' +err);
        });
    };
  }, []);

  return (
    <div className="app">
      <Menu 
        baseURL={baseURL}
        logged={logged}
        isAdmin={isAdmin}
        setLogged={setLogged}
        setIsAdmin={setIsAdmin}
      />

      <Switch>

        <Route exact path="/">
          <Home baseURL={baseURL} setLogged={setLogged} />
        </Route>

        <Route exact path="/search">
          <Search baseURL={baseURL} />
        </Route>

        <Route exact path="/game">
          <Game baseURL={baseURL} logged={logged} />
        </Route>

        <Route exact path="/team">
          <Team />
        </Route>

        <Route exact path="/contact">
          <Contact />
        </Route>

        <Route exact path="/user">
          { logged ? <Profil baseURL={baseURL} /> : <Error /> }
        </Route>

        <Route exact path="/user/playlists">
          { logged ? <UserPlaylists baseURL={baseURL} /> : <Error /> }
        </Route>

        <Route exact path="/update">
          { logged ? <PlaylistUpdate baseURL={baseURL}/> : <Error /> }
        </Route>

        <Route exact path="/create">
          { logged ? <PlaylistCreate baseURL={baseURL}/> : <Error /> }
        </Route>

        <Route exact path="/admin">
          { isAdmin ? <Admin baseURL={baseURL} /> : <Error /> }
        </Route>

        <Route path="/" component={Error} />
        
      </Switch>
    </div>
  );
};

export default App;
