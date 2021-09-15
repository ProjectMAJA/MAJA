import React, { useEffect, useRef } from 'react';

import './style.scss';

import loading from '../../../public/img/loading/loading.png';

const Loading = () => {

  const loader = useRef(0);

  useEffect(() => {
    loader.current.style.transition = '30000ms';
    loader.current.style.transform = 'rotate(2160deg)';
  }, []);

  return (
    <div className='loading'>
      <section className="loading-display">
        <img
          src={loading}
          className="loading-display-img"
          alt="Chargement en cours"
          ref={loader}
        />
      </section>
    </div>
  );
};

export default Loading;