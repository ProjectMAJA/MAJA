// Import de la lib React
import React, { useEffect } from 'react';
// Imports NPM
// Imports locaux
import './styles.scss';
import Jojoh from './images/jojoh.png';
import Adrien from '../../../public/img/team/Adrien.svg';
import Axel from '../../../public/img/team/axel.svg'
import Mathieu from '../../../public/img/team/mathieu.svg'
import Linkedin from './images/linkedin.png';


const Team = () => {

  useEffect(() => {

    if (DZ.player.isPlaying()) {
      DZ.player.mute();
    };

    document.title = "MAJA - L'équipe";
    
  }, []);

  return (
    <div className="cards">
      <div className="card-h1">
        <h1>La team MAJA</h1>
          </div>
    <div className="card-block">

        <a href="http://www.linkedin.com/in/mathieu-frayssinet" className="card-linkedin">
        <div className="card-container">
          <div className="image-container">
            <img src={Mathieu} alt=''/>
          </div>
          <div className="card-content">
            <div className="card-title">
              <h1>Mathieu</h1>
            </div>
              <div className="card-body">
                <p>'Scrum Master'</p>
              </div>
              <div className="card-link">
              <p><img src={Linkedin} alt="linkedin" ></img></p>
              </div>
          </div>
        </div>
        </a>

      <a href="https://www.linkedin.com/in/adrien-lacourpaille/" className="card-linkedin">
      <div className="card-container">
        <div className="image-container">
          <img src={Adrien} alt=''/>
        </div>
        <div className="card-content">
          <div className="card-title">
            <h1>Adrien</h1>
          </div>
            <div className="card-body">
              <p>'Lead Dev Front'</p>
            </div>
            <div className="card-link">
              <p><img src={Linkedin} alt="linkedin" ></img></p>
            </div>
        </div>
      </div>
      </a>

      <a href="https://www.linkedin.com/in/johanna-g-4b617997/" className="card-linkedin">
      <div className="card-container">
        <div className="image-container">
          <img src={Jojoh} alt=''/>
        </div>
        <div className="card-content">
          <div className="card-title">
            <h1>Johanna</h1>
          </div>
            <div className="card-body">
              <p>'Product Owner'</p>
            </div>
            <div className="card-link">
              <p><img src={Linkedin} alt="linkedin" ></img></p>
            </div>
        </div>
      </div>
      </a>

      <a href="https://www.linkedin.com/in/axel-lgt/" className="card-linkedin">
      <div className="card-container">
        <div className="image-container">
          <img src={Axel} alt=''/>
        </div>
        <div className="card-content">
          <div className="card-title">
            <h1>Axel</h1>
          </div>
            <div className="card-body">
              <p>'Git Master'</p>
            </div>
            <div className="card-link">
              <p><img src={Linkedin} alt="linkedin" ></img></p>
            </div>
          </div>
        </div>
        </a>

        </div>
      
        </div>
  )};


export default Team;



