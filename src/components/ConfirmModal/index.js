import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const ConfirmModal = ({ setShowConfirmModal, setConfirm, text, span }) => {

  return (
    <div className='confirm'>
      <section
        className='behind'
        onClick={() => {
          setShowConfirmModal(false);
        }}
      ></section>
      <section className='confirm-modal'>
        <p className='confirm-modal-text'>{text}</p>
        <span className='confirm-modal-span'>{span}</span>
        <div>
          <button
            className='confirm-modal-confirm'
            onClick={() => {
              setConfirm(true);
              setShowConfirmModal(false);
            }}
          >
            Confirmer
          </button>

          <button
            className='confirm-modal-cancel'
            onClick={() => {
              setConfirm(false);
              setShowConfirmModal(false);
            }}
          >
            Annuler
          </button>
        </div>
      </section>
    </div>
  );
};
  
ConfirmModal.propTypes = {
  setShowConfirmModal: PropTypes.func.isRequired,
  setConfirm: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  span: PropTypes.string.isRequired
};

export default ConfirmModal;