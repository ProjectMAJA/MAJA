import React from 'react';

import './style.scss';
import notif from '../../../public/img/icons/notif.svg';
import cancel from '../../../public/img/icons/cancel.svg';

const Notification = ( props ) => {

  return (
    <div className='notification'>
      <section className="notification-info">
        <img
          className="notification-info-img"
          src={notif}
          alt="Attention !"
        />
        <p className="notification-info-text">{props.children}</p>
      </section>
      <img
        className="notification-quit"
        src={cancel}
        alt="Icône pour quitter"
        onClick={() => {
          props.setShowNotification(false);
        }}
      />
    </div>
  );
};

export default Notification;