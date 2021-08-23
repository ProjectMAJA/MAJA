import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './style.scss';

import avatarData from '../../../../data/avatar.json';


const ChooseAvatar = ({ baseURL, setShowChooseAvatar }) => {

  const api = axios.create({
    baseURL: baseURL
  });

  const token = localStorage.getItem('token');

  const changeAvatar = (img) => {
    api.post('/user', {
      avatar: img
    }, {
      headers: {
        Authorization: token
      }
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  return (
    <div className="avatar">
      <section className="avatar-container">
        {avatarData.map(img => {

          return (
            <img key={img} className="avatar-container-img" src={img} 
              onClick={() => {
                changeAvatar(img);
                window.location.reload();
                setShowChooseAvatar(false);
              }}
            />
          )
        })}

        <button 
            className="close-modal" 
            onClick={() => {
              setShowChooseAvatar(false);
            }}
          > 
          &#x274C; 
        </button>
      </section>
    </div>
  );
};

ChooseAvatar.propTypes = {
  baseURL: PropTypes.string.isRequired,
  setShowChooseAvatar: PropTypes.func.isRequired
};

export default ChooseAvatar;



