-- Verify maja:view_rating on pg

BEGIN;

SELECT * FROM pl_r WHERE false;

ROLLBACK;
