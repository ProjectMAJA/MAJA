import React, { useRef } from 'react';

import './style.scss';
import notif from '../../../public/img/icons/notif.svg';
import cancel from '../../../public/img/icons/cancel.svg';

const Notification = ( props ) => {

  const notification = useRef(null);

  const close = () => {
    notification.current.style.transition = ".3s";
    notification.current.style.opacity = "0%";

    setTimeout(() => {
      props.setShowNotification(false);
    }, 300);
  };

  return (
    <div className='notification' ref={notification}>
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
          close();
        }}
      />
    </div>
  );
};

export default Notification;