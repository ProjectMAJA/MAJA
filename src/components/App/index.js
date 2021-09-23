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
import Contact from 'src/components/Contact';

import api from '../../data/api';

import './style.scss';

// == Composant
const App = () => {

  const [logged, setLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

    let token = localStorage.getItem('token');

    if (token) {
      api.get('/user')
        .then((res) => {
          setLogged(true);

          if (res.data.isadmin === true) {
            setIsAdmin(true);
          };
        })
        .catch((err) => {
          setLogged(false);
          setIsAdmin(false);
          console.log(err.response);
        });
    };
  }, []);

  return (
    <div className="app">
      <Menu 
        api={api}
        logged={logged}
        isAdmin={isAdmin}
        setLogged={setLogged}
        setIsAdmin={setIsAdmin}
      />

      <Switch>

        <Route exact path="/">
          <Home api={api} setLogged={setLogged} />
        </Route>

        <Route exact path="/search">
          <Search api={api} />
        </Route>

        <Route exact path="/game">
          <Game api={api} logged={logged} />
        </Route>

        <Route exact path="/team">
          <Team />
        </Route>

        <Route exact path="/contact">
          <Contact />
        </Route>

        <Route exact path="/user">
          { logged ? <Profil api={api} /> : <Error /> }
        </Route>

        <Route exact path="/user/playlists">
          { logged ? <UserPlaylists api={api} /> : <Error /> }
        </Route>

        <Route exact path="/update">
          { logged ? <PlaylistUpdate api={api}/> : <Error /> }
        </Route>

        <Route exact path="/create">
          { logged ? <PlaylistCreate api={api}/> : <Error /> }
        </Route>

        <Route exact path="/admin">
          { isAdmin ? <Admin api={api} /> : <Error /> }
        </Route>

        <Route path="/" component={Error} />
        
      </Switch>
    </div>
  );
};

export default App;