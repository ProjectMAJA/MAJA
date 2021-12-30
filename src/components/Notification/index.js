import React, { useRef } from 'react';

import './style.scss';
import notif from '../../../public/img/icons/notif.svg';
import cancel from '../../../public/img/icons/cancel.svg';

const Notification = ( props ) => {

  const notification = useRef(null);

  const close = () => {
    props.setShowNotification(false);
  };

  return (
    <div className='notification' ref={notification}>
      <section className="notification-info">
        <img
          className="notification-info-img"
          src={notif}
          alt="Information"
        />
        <p className="notification-info-text">{props.children}</p>
      </section>
      <img
        className="notification-quit"
        src={cancel}
        alt="Icône pour quitter"
        onClick={() => {
          close();
        }}
      />
    </div>
  );
};

export default Notification;