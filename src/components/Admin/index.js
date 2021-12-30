// Import packages
import React, { useEffect, useState } from "react";

import Loading from "../Loading";
import DeleteModal from "../DeleteModal";

// Local imports
import "./style.scss";

import del from "../../../public/img/icons/delete.svg";
import imgDefaultPlaylist from "../../../public/img/playlist/playlist-placeholder.png";
import imgDefaultUser from "../../../public/img/profil/default.png";

const Admin = ({ api }) => {

  const [playlists, setPlaylists] = useState(null);
  const [playlistInput, setPlaylistInput] = useState("");
  const [users, setUsers] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [playlistID, setPlaylistID] = useState(0);
  const [userID, setUserID] = useState(0);
  const [playlistOrUser, setPlaylistOrUser] = useState("");
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    setShowLoading(true);

    document.title = "MAJA - Administration";

    // Get playlists from database
    api.get("/playlists")
      .then((res) => {
        setPlaylists(res.data);
        setShowLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    // Get users from database
    api.get("/users")
      .then((res) => {
        setUsers(res.data);
        setShowLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  useEffect(() => {
    if (confirmDelete === true) {
      deletePlaylist();
      setConfirmDelete(false);
    };
  }, [confirmDelete]);

  const deletePlaylist = async () => {
    setShowLoading(true);

    await api.delete(`/playlist`, {
        data: {
          id: playlistID,
          user_id: userID,
        }
      })
      .then((res) => {
        console.log(res.data);
        api.get("/playlists")
          .then((res) => {
            setPlaylists(res.data);
            setConfirmDelete(false);
            setShowLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    if (confirmDeleteUser === true) {
      deleteUser();
      setConfirmDeleteUser(false);
    };
  }, [confirmDeleteUser]);

  const deleteUser = () => {
    setShowLoading(true);

    api.delete(`/user/${userID}`)
      .then((res) => {
        console.log(res.data);
        api.get("/users")
          .then((res) => {
            setUsers(res.data);
            setConfirmDelete(false);
            setShowLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="admin">

      {showLoading && 
        <Loading />
      }

      <section className="admin-container">
        <h1 className="admin-container-title"> Playlists </h1>
        <hr />
        <input
          type="text"
          className="admin-container-input"
          placeholder="Rechercher une playlist"
          onChange={(event) => {
            setPlaylistInput(event.target.value);
          }}
        />

        {playlists &&
          playlists.map((playlist) => {
            const title = playlist.name.toLowerCase();
            const search = playlistInput.toLowerCase();
            const altImg = "Image de la playlist " + playlist.name;

            if (title.includes(search)) {
              return (
                <li key={playlist.id} className="admin-container-section">
                  {playlist.image ? (
                    <img
                      className="admin-container-section-img"
                      src={playlist.image}
                      alt={altImg}
                    />
                  ) : (
                    <img
                      className="admin-container-section-img"
                      src={imgDefaultPlaylist}
                      alt="Image par défaut de la playlist"
                    />
                  )}
                  <div className="admin-container-section-content">
                    <h2 className="admin-container-section-content-title">
                      {playlist.name}
                    </h2>
                    <p className="admin-container-section-content-description">
                      {playlist.description}
                    </p>
                  </div>

                  <input
                    type="image"
                    src={del}
                    className="admin-container-section-button"
                    onClick={() => {
                      setPlaylistOrUser('cette playlist');
                      setPlaylistID(playlist.id);
                      setUserID(playlist.user_id);
                      setShowDeleteConfirm(true);
                    }}
                  />
                </li>
              );
            }
          })}
      </section>

      <section className="admin-container">
        <h1 className="admin-container-title"> Utilisateurs </h1>
        <hr />
        <input
          type="text"
          className="admin-container-input"
          placeholder="Rechercher un utilisateur"
          onChange={(event) => {
            setUserInput(event.target.value);
          }}
        />

        {users &&
          users.map((user) => {
            const name = user.pseudo.toLowerCase();
            const search = userInput.toLocaleLowerCase();
            const altImg = "Avatar de " + user.pseudo;

            if (name.includes(search)) {
              return (
                <li key={user.id} className="admin-container-section">
                  {user.avatar ? (
                    <img
                      className="admin-container-section-img"
                      src={user.avatar}
                      alt={altImg}
                    />
                  ) : (
                    <img
                      className="admin-container-section-img"
                      src={imgDefaultUser}
                      alt="Avatar par défaut"
                    />
                  )}
                  <div className="admin-container-section-content">
                    <h2 className="admin-container-section-content-title">
                      {user.pseudo}
                    </h2>
                    <p className="admin-container-section-content-description">
                      {user.email}
                    </p>
                  </div>

                  <input
                    type="image"
                    src={del}
                    className="admin-container-section-button"
                    onClick={() => {
                      setPlaylistOrUser('cet utilisateur');
                      setUserID(user.id);
                      setShowDeleteConfirm(true);
                    }}
                  />
                </li>
              );
            }
          })}
      </section>

      {showDeleteConfirm &&
        <DeleteModal
          setShowDeleteConfirm={setShowDeleteConfirm}
          setConfirmDelete={setConfirmDelete}
          setConfirmDeleteUser={setConfirmDeleteUser}
          playlistOrUser={playlistOrUser}
        />
      }
    </div>
  );
};

export default Admin;