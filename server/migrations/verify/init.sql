-- Verify maja:init on pg

BEGIN;

SELECT * FROM "user" WHERE false;
SELECT * FROM playlist WHERE false;
SELECT * FROM game WHERE false;
SELECT * FROM rating WHERE false;

ROLLBACK;