// Import de la lib React
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';

// Imports NPM
import axios from 'axios';
import DeezerPublicApi from 'deezer-public-api';

// Imports locaux
import './styles.scss';
import TrackSearchResult from '../TrackSearchResult';
import Item from '../Item';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png';
import settings from '../../../public/img/profil/settings.svg';
import edit from '../../../public/img/icons/edit.svg';
import del from '../../../public/img/icons/delete.svg';
import plus from '../../../public/img/icons/plus.svg';

let deezerApi = new DeezerPublicApi();

const PlaylistCreate = ({ baseURL }) => {

 let history = useHistory();

 const location = useLocation();

 const api = axios.create({
   baseURL: baseURL
 });

 {/* useState pour l'accordéon */}
 const [toggle, setToggle] = useState(false);
 const [heightEl, setHeightEl] = useState();
 {/* useState pour la barre de recherche */}
  const [search, setSearch] = useState('');
 const [searchResults, setSearchResults] = useState([]);
 {/* useState pour l'ajout de track dans la liste */}
 const [dataArr, setDataArr] = useState([]);
 {/* useState pour sélectionner la musique */}
 const [selectedTrack, setSelectedTrack] = useState([]);
 {/* useState pour afficher les musiques d'une playlist */}

 const [playlistID, setPlaylistID] = useState(null);
 const [userID, setUserID] = useState(null);
 const [playlistName, setPlaylistName] = useState('');
 const [playlistDesc, setPlaylistDesc] = useState('');
 const [playlistImg, setPlaylistImg] = useState('');

 const [showTooLongDesc, setShowTooLongDesc] = useState(false);
 const [showTooLongName, setShowTooLongName] = useState(false);

 const [deezerIds, setDeezerIds] = useState([]);

 const toggleState = () => {
   setToggle(!toggle);
 }

 const refHeight = useRef();

 // useEffect that gets playlist info

 // useEffect that fetches data from Deezer API
 useEffect(() => {
   if (!search) return setSearchResults([]);

   {/* cela permet de faire la requête seulement quand on a fini d'écrire, au lieu d'en faire une à chaque lettre tapée */}
   let cancel = false;
   {/* cette méthode permet de fetch le titre d'une musique sur l'api de Deezer grâce au deezer-public-api */}
    deezerApi.search.track(search).then(function(res) {
      if (cancel) return;
    
      setSearchResults(
       res.data.map(track => {
          return {
            id: track.id,
            artist: track.artist.name,
            title : track.title,
            track: track.link,
            cover: track.album.cover_medium,
           preview: track.preview,
          }
       }));
    })

     return() => cancel = true
 }, [search]);

 function chooseTrack(track) {
   const tracks = [...selectedTrack, track];
    setSelectedTrack(tracks);
   setSearch('');

   const newIDs = [...deezerIds, track.id];
   setDeezerIds(newIDs);
 };
 function addNewTrack() {
   chooseTrack(track);
 };

 async function savePlaylist() {

   const token = localStorage.getItem('token');

   console.log("deezerIds dans  : ", deezerIds);

   await api.post('/playlist', {
     name: playlistName,
     description: playlistDesc,
     image: playlistImg,
     deezer_ids: deezerIds
   },{
     headers: {
       Authorization: token
     }
   })
     .then((res) => {
       history.push({
         pathname: '/user/playlists',
       })
       console.log(res.data);
     })
     .catch((err) => {
       console.log(err.response);
     })
 };

 const deleteTrack = (id) => {

   const newTracks = selectedTrack.filter(track => track.id != id);
   setSelectedTrack(newTracks);

   const newIDs = deezerIds.filter(deezerId => deezerId != id);
   setDeezerIds(newIDs);

 };

  const deletePlaylist = async () => {
    const token = localStorage.getItem('token');

    await api.delete(`/playlist`,
      {
      headers: {
        Authorization: token
      },
      data: {
        id: playlistID,
        user_id: userID
      }
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const changeName = (newName) => {
    if (newName.length > 30) {
      setShowTooLongName(true);
    } else {
      setPlaylistName(newName);
    };
  };

  const changeDesc = (newDesc) => {
    if (newDesc.length > 100) {
      setShowTooLongDesc(true);
    } else {
      setPlaylistDesc(newDesc);
    };
  };


 return (
   <div>
     <div className="playlist-update-form">
       <input type="text" placeholder="Nom de la playlist"  onChange={(event) => {
         changeName(event.target.value);
       }}/>
        {showTooLongName &&
          <p className="too_long">Le nom doit faire 30 caractères au maximum</p>
        }
       <input type="text" placeholder="Description (40 caractères max)" onChange={(event) => {
         changeDesc(event.target.value);
       }}/>
        {showTooLongDesc &&
          <p className="too_long">Votre description doit faire 100 caractères au maximum</p>
        }      
       <input type="text" placeholder="URL de l'image"  onChange={(event) => {
         setPlaylistImg(event.target.value);
       }}/>
       <button onClick={(event) => {
         event.preventDefault();
         savePlaylist();
       }}>
         Save
       </button>
     </div>
     <div className="playlist-update">
       <div className="playlist-update-header">
         <h1>{playlistName}</h1>
       </div>

       <div className="playlist-update-accord visible">
         {playlistImg ? (
           <img className="playlist-update-placeholder" src={playlistImg} alt="playlist-placeholder" />
         ) : (
           <img className="playlist-update-placeholder" src={imgDefault} alt="playlist-placeholder" />
         )}
         <h2>{playlistName}</h2>
         <p>{playlistDesc}</p>
         <button
         onClick={toggleState}
          className="playlist-update-settings-button">
           <img className="playlist-update-settings" src={settings} alt="" />
         </button>
       </div>

       {/* accordéon qui se déplie */}
       <div className="playlist-update-accord animated">
         <div className="playlist-update-accord-header">
           <form>
             <input
             className="playlist-update-accord-header-search"
             type="search"
             onChange={e=>setSearch(e.target.value)}
             value={search}
             placeholder="Rechercher sur Deezer" />
           </form>
         </div>
         <div className="playlist-update-accord-result">
           {searchResults.map(track => (
             <TrackSearchResult track={track} key={track.track} chooseTrack={chooseTrack} addNewTrack={addNewTrack} />
           ))}
         </div>
         <div className="playlist-update-existing-tracks">
           {}
         </div>
         <div className="playlist-update-accord-body">         
           {selectedTrack.map(song => (
               <Item track={song} key={song.track} deleteTrack={deleteTrack} />
             ))}
         </div>
         <div>

         </div>
       </div>
         <input
           className="playlist-update-delete"
           type="button"
           value="Supprimer cette playlist"
           onClick={() => {
             deletePlaylist();
             history.push({
               pathname: '/user/playlists'
             })
           }}
         />

     </div>
   </div>
 );
};

PlaylistCreate.propTypes = {
  baseURL: PropTypes.string.isRequired
};

export default PlaylistCreate;
