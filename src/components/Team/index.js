// Import de la lib React
import React, { useEffect } from 'react';

// Imports locaux
import './styles.scss';
import linkedin from './images/linkedin.png';
import logo from '../../../public/img/nav/logo.png';

import team from '../../../data/team.json';

const Team = () => {

  useEffect(() => {
    const wasPlaying = localStorage.getItem('playlist_id');

    if (wasPlaying) {
      window.location.reload();
      localStorage.removeItem('playlist_id');
    };

    document.title = "MAJA - L'équipe";
  }, []);

  return (
    <section className="team">

      <div className="team-container">
        <div className="team-container-title">
          <p>La team MAJA</p>
          {/* <img
            src={logo}
            alt="Logo du site MAJA"
            className="team-container-title-img"
          /> */}
        </div>

        <ul className="team-container-list">

          { team.map(member => {

            const altImg = "Avatar de " + member.name;
            const altLink = "Lien vers le Linkedin de " + member.name;

            return (
              <li key={member.id}>
                <a 
                  href={member.link}
                  target="_blank"
                  rel="noreferrer"
                  className="team-container-list-card"
                >

                  <img src={member.img} alt={altImg} className="team-container-list-card-img" />

                  <section className="team-container-list-card-id">

                    <p className="team-container-list-card-id-name">
                      {member.name}
                    </p>

                    <p className="team-container-list-card-id-role">
                      {member.role}
                    </p>

                  </section>

                  <img src={linkedin} alt={altLink} className="team-container-list-card-link" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Team;