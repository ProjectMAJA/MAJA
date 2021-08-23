INSERT INTO "user"(pseudo, email, "password", isadmin) VALUES
('admin','admin', 'admin', true),
('User1','1@user.com', 'User1', false),
('User2','2@user.com', 'User2', false),
('User3','3@user.com', 'User3', false),
('User4','4@user.com', 'User4', false);

INSERT INTO playlist("name", description, user_id) VALUES
('playlist1','1st playlist', 1),
('playlist2','2nd playlist', 3),
('playlist3','3rd playlist', 4),
('playlist4','4th playlist', 1),
('playlist5','5th playlist', 1),
('playlist6','6th playlist', 3),
('playlist7','7th playlist', 4),
('playlist8','8th playlist', 1);

INSERT INTO game(user_id, playlist_id, date) VALUES
(2, 1, '2021-07-27 19:47:48.099827+00'),
(2, 2, '2021-07-27 18:47:48.099827+00'),
(2, 3, '2021-07-27 17:47:48.099827+00'),
(2, 4, '2021-07-27 16:47:48.099827+00'),
(2, 5, '2021-07-26 17:47:48.099827+00'),
(2, 6, '2021-07-26 16:47:48.099827+00'),
(2, 4, '2021-07-26 16:47:48.099827+00'),
(2, 8, '2021-07-26 16:47:48.099827+00'),
(2, 7, '2021-07-26 16:47:48.099827+00');

INSERT INTO rating(user_id, playlist_id, rating) VALUES
(1, 2, 5),
(2, 2, 5),
(3, 2, 5),
(4, 2, 5),
(1, 3, 1.5),
(2, 3, 3),
(3, 3, 3.5),
(4, 3, 4),
(1, 4, 2),
(2, 4, 4.5),
(3, 4, 2.5),
(4, 4, 1);