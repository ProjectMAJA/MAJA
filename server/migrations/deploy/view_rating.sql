-- Deploy maja:view_rating to pg

BEGIN;

CREATE VIEW pl_r AS 
	SELECT pl.*, AVG(r.rating)::integer AS rating, count(r.rating) AS nb_rating
	FROM playlist AS pl
	LEFT JOIN rating AS r ON r.playlist_id=pl.id
	GROUP BY pl.id;

COMMIT;
