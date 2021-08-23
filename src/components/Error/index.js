import React from 'react';

import './styles.scss';

import cassette from '../../../public/img/icons/cassette-tape.svg';

const Error = () => {

 return (
   <div className="error-page">
     <div className="error-page-header">
       <h1>404</h1>
       <hr />
     </div>
       <h2>La page demandée n'existe pas</h2>
         <img src={cassette} className="error-page-img" alt='Page 404' />
       <a href="/" className="error-page-button">
         Retour à l'accueil
       </a>
   </div>
 )
};

export default Error;


