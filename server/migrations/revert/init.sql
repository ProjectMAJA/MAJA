-- Revert maja:init from pg

BEGIN;

DROP TABLE rating, game, playlist, "user";

COMMIT;
