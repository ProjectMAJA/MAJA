import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Before = ({ playGame, timer }) => {

  return (        
    <section className="before">
      <div className="before-container">
        <div className="before-container-rules">
          <h1 className="before-container-rules-title">Règles du jeu</h1>
          <hr />
          <ul className="before-container-rules-description">
            <li className="before-container-rules-description-item"> 
              Trouvez l'artiste et le titre de la chanson que vous entendez 
            </li>
            <li className="before-container-rules-description-item"> 
              Vous avez {timer} secondes pour écrire votre proposition dans le champ en bas de l'écran
            </li>
            <li className="before-container-rules-description-item">
              Vous gagnez 2 points si vous trouvez l'artiste ou le titre
            </li>
            <li className="before-container-rules-description-item"> 
              Vous gagnez 3 points supplémentaires si vous trouvez les deux
            </li>
            <li className="before-container-rules-description-item"> 
              Certaines musiques cachent 1 point bonus si elles ont un featuring : à vous d'y être attentif
            </li>
          </ul>
        </div>

        <p className="before-container-warning">
          Attention ! 
          <br />
          Certains navigateurs n'autorisent pas automatiquement la lecture de son. Si vous n'avez pas de son alors que le chronomètre de {timer} secondes est lancé, allez dans les paramètres de votre navigateur pour l'autoriser sur notre site et rafraîchissez la page.
          <br />
          Le lecteur de Deezer n'est pas compatible avec les navigateurs sur smartphones et tablettes, vous ne pourrez jouer que sur un ordinateur.
        </p>

        <input
          type="button"
          className="before-container-button"
          value="Lancer la partie"
          onClick={() => {
            playGame();
          }}
        />
      </div>
    </section>
  );
};

Before.propTypes = {
  playGame: PropTypes.func.isRequired,
  timer: PropTypes.number.isRequired
};

export default Before;