// == Import npm
import React, { useState, useEffect } from 'react';
import { Route, Switch } from "react-router-dom";

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

import './style.scss';

// == Composant
const App = () => {

  const [logged, setLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const baseURL = "https://api-maja.herokuapp.com/v1";

  useEffect(() => {

    DZ.init({
      appId: '492382',
      channelUrl: `client/public/channel.html`,
      player: {
        onload: () => {
          console.log('player loaded');
        }
      }
    });

    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('admin');

    token ? setLogged(true) : setLogged(false);

    if ( admin === 'true' ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
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
          <Game baseURL={baseURL} />
        </Route>

        <Route exact path="/team">
          <Team />
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
  ) 
};

export default App;
