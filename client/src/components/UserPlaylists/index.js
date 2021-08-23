// Import de la lib React
import React from 'react';
import { useEffect, useState, } from 'react/cjs/react.development';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

// Imports NPM

// Imports locaux
import './styles.scss';
import edit from '../../../public/img/icons/edit.svg';
import plus from '../../../public/img/icons/plus.svg';
import del from '../../../public/img/icons/delete.svg';
import imgDefault from '../../../public/img/playlist/playlist-placeholder.png';
import PlaylistInfo from '../PlaylistInfo';

const UserPlaylists = ({ baseURL }) => {

 let history = useHistory();

 // Init axios requests
 const api = axios.create({
   baseURL: baseURL
 });

 const [logged, setLogged] = useState(false);
 const [userPlaylists, setUserPlaylists] = useState([]);
 const [showDetails, setShowDetails] = useState(false);
 const [playlistLink, setPlaylistLink] = useState('');

 useEffect(() => {
   const token = localStorage.getItem('token');
     if (token) {
       setLogged(true);
     } else {
       setLogged(false);
     };

   api.get(`/user/playlists`, {
     headers: {
       authorization: token
     }
   })
   .then((res) => {
     setUserPlaylists(res.data)
   }, [])
 });

 const deletePlaylist = async (playlistID, userID) => {
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

 return(
   <div className="user-playlist-container">

    <div className="user-playlist-add">
      <input 
        className="user-playlist-add-logo"
        name="create"
        id="create"
        type="image"
        src={plus}
        onClick={() => {
          history.push({
            pathname: '/create'
          })
        }}
      />
      <label className="user-playlist-add-label" for="create">
        Créer une playlist
      </label>
    </div>
    
    
    <div>

     {userPlaylists &&
     userPlaylists.map(playlist => {
       //console.log(playlist);
       const blackStars= [];
       const whiteStars= [];
       for(let i=0; i<playlist.rating; i++){
         blackStars.push('+1');
       }
       for(let j=0; j<5-playlist.rating; j++){
         whiteStars.push('+1')
       }
       return (
         <div className="user-playlist-card" key={playlist.id}>
           <a id={playlist.id} onClick={() => {
             setPlaylistLink(playlist.id);
             setShowDetails(true);
           }}>
               {playlist.image ? (
                 <img className="user-playlist-card-logo" src={playlist.image} alt="user-playlist placeholder" />
               ) : (
                 <img className="user-playlist-card-logo" src={imgDefault} alt="user-playlist placeholder" />
               )
               }
               <h2>{playlist.name}</h2>
               <div>
                       {blackStars &&
                         blackStars.map(e=>{
                           return(
                             <em>&#9733;</em>
                           )
                         })
                       }
                       {whiteStars &&
                         whiteStars.map(e=>{
                           return(
                             <em>&#9734;</em>
                           )
                         })
                       }
              </div>
           </a>
           
           <div className="user-playlist-options">
             <input className="user-playlist-options-edit" type="image" src={edit} onClick={() => {
               history.push({
                 pathname: '/update',
                 state: { playlist }
               })
             }}/>
             
             <input
               className="user-playlist-options-delete"
               type="image"
               src={del}
               onClick={() => {
                 deletePlaylist(playlist.id, playlist.user_id);
                }}
             />
           </div>
           
          
         </div>
       )
     })}
     </div>

     {showDetails &&
       <PlaylistInfo
         baseURL={baseURL}
         playlistLink={playlistLink}
         setShowDetails={setShowDetails}
       />
     }
   </div>
 );
};

export default UserPlaylists;
