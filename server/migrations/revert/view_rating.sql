-- Revert maja:view_rating from pg

BEGIN;

DROP VIEW pl_r;

COMMIT;
