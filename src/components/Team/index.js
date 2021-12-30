// Import de la lib React
import React, { useEffect } from 'react';

// Imports locaux
import './styles.scss';
import linkedin from './images/linkedin.png';
import logo from '../../../public/img/nav/logo.png';

import team from '../../../data/team.json';

const Team = () => {

  useEffect(() => {
    document.title = "MAJA - L'équipe";
  }, []);

  return (
    <section className="team">

      <div className="team-container">
        <p className="team-container-title">
          La team MAJA
        </p>

        <ul className="team-container-list">

          { team.map(member => {

            const altImg = "Avatar de " + member.name;
            const altLink = "Lien vers le Linkedin de " + member.name;
            const className = "team-container-list-card crew_member-" + member.id;

            return (
              <li key={member.id}>
                <a 
                  href={member.link}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
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