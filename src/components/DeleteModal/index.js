import React from 'react';

import './style.scss';

const DeleteModal = ({ setShowDeleteConfirm, setConfirmDelete, setConfirmDeleteUser, playlistOrUser }) => {

  return (
    <div className='delete'>
      <section
        className='behind'
        onClick={() => {
          setShowDeleteConfirm(false);
        }}
      ></section>
      <section className='delete-modal'>
        <p className='delete-modal-text'>Voulez-vous vraiment supprimer {playlistOrUser} ?</p>
        <span className='delete-modal-span'>Toutes les données seront perdues</span>
        <div>
          <button
            className='delete-modal-confirm'
            onClick={() => {
              if (playlistOrUser.includes('playlist')) {
                setConfirmDelete(true);
              } else if (playlistOrUser.includes('utilisateur')) {
                setConfirmDeleteUser(true);
              };
              setShowDeleteConfirm(false);
            }}
          >
            Confirmer
          </button>

          <button
            className='delete-modal-cancel'
            onClick={() => {
              setConfirmDelete(false);
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