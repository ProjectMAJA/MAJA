import React from 'react';

import './style.scss';

const DeleteModal = ({ api, setShowDeleteConfirm, playlistID, userID, setUserPlaylists }) => {

  const deletePlaylist = async (playlistID, userID) => {
    await api.delete(`/playlist`, {
      data: {
        id: playlistID,
        user_id: userID
      }
    })
      .then((res) => {
        console.log(res.data);
        api.get('/user/playlists')
          .then((res) => {
            setUserPlaylists(res.data);
            setShowDeleteConfirm(false);
          })
          .catch((err) => {
            console.log(err.response);
          })
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className='delete'>
      <section
        className='behind'
        onClick={() => {
          setShowDeleteConfirm(false);
        }}
      ></section>
      <section className='delete-modal'>
        <p className='delete-modal-text'>Voulez-vous vraiment supprimer cette playlist ?</p>
        <span className='delete-modal-span'>Toutes les données seront perdues</span>
        <div>
          <button
            className='delete-modal-confirm'
            onClick={() => {
              deletePlaylist(playlistID, userID);
            }}
          >
            Confirmer
          </button>

          <button
            className='delete-modal-cancel'
            onClick={() => {
              setShowDeleteConfirm(false);
            }}
          >
            Annuler
          </button>
        </div>
      </section>
    </div>
  );
};

export default DeleteModal;