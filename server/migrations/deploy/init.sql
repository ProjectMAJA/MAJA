-- Deploy maja:init to pg

BEGIN;

CREATE TABLE "user" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pseudo TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    avatar TEXT DEFAULT NULL,
    isadmin BOOLEAN DEFAULT false
);

CREATE TABLE playlist (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    description TEXT,
    image TEXT DEFAULT NULL,
    user_id INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    deezer_ids INT[]
);

CREATE TABLE game ( -- this table save the score of a game
    user_id INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    playlist_id INT NOT NULL REFERENCES playlist(id) ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rating ( -- this table save the score of a game
    user_id INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    playlist_id INT NOT NULL REFERENCES playlist(id) ON DELETE CASCADE,
    rating INT NOT NULL DEFAULT 0,
    UNIQUE (user_id, playlist_id)
);

COMMIT;