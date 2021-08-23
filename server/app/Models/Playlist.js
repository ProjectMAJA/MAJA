const client = require('../database');
const setQuerySave = require('../service/setQuerySave');

class Playlist {

     constructor(obj={}) {
        for (const propName in obj) {
            this[propName] = obj[propName];
        }
    }

//############# Playlist for all user #################

    static async findAll(){
        try {
            const {rows} = await client.query(`SELECT * FROM pl_r;`);
            return rows.map(row => new Playlist(row));
        } catch (error) {
            throw error;
        }
    }

    static async findOne(id){
        try {
            const {rows} = await client.query(`SELECT * FROM pl_r WHERE id=$1;`, [id]);
            if(!rows[0]){
                throw new Error('Playlist not found');
            }
            return new Playlist(rows[0]);
        } catch (error) {
            throw error;
        }
    }

    static async findAdminPlaylists(){
        try {
            const {rows} = await client.query(`
            SELECT pl_r.*
            FROM pl_r
            JOIN "user" u ON u.id = pl_r.user_id
            WHERE u.isadmin=true;
            `);
            return rows.map(row => new Playlist(row));
        } catch (error) {
            throw error;
        }
    }

    static async findBestsPlaylists(days){
        const queryDb = setQueryBPl(days);
        try {
            const {rows} = await client.query(queryDb);
            return rows.map(row => new Playlist(row));
        } catch (error) {
            throw error;
        }
    }

    static async findRandomPlaylists(nb){
        const queryDb = {
            text: `SELECT * FROM pl_r ORDER BY random() LIMIT $1;`,
            values: [nb]
        }
        try {
            const {rows} = await client.query(queryDb);
            return rows.map(row => new Playlist(row));
        } catch (error) {
            throw error;
        }
    }

//#######################################################

//################ Playlist for user ####################

    static async findUserPlaylists(id){

        try {
            const {rows} = await client.query(`SELECT * FROM pl_r WHERE user_id=$1;`,[id]);
            return rows.map(row => new Playlist(row));
        } catch (error) {
            throw error;
        }
    }

    static async findUserPlayed(id){

        try {
            const {rows} = await client.query(`
            SELECT pl_r.*
            FROM pl_r
            JOIN game AS g ON g.playlist_id = pl_r.id
            WHERE g.user_id=$1
            GROUP BY pl_r.id, pl_r.name, pl_r.description, pl_r.image, pl_r.user_id, pl_r.rating, pl_r.nb_rating, pl_r.deezer_ids
            ORDER BY max(g.date) DESC
            LIMIT 10;
            `, [id]);
            return rows.map(row => new Playlist(row));
        } catch (error) {
            throw error;
        }
    }

    static async findUserLiked(id){

        try {
            const {rows} = await client.query(`
            SELECT pl_r.*, r.rating
            FROM pl_r
            JOIN rating r ON r.playlist_id=pl_r.id
            WHERE r.user_id=$1 AND r.rating>=3
            ORDER BY r.rating DESC
            LIMIT 10;
            `, [id]);
            return rows.map(row => new Playlist(row));
        } catch (error) {
            throw error;
        }
    }

//#######################################################

//############# POST for connected user #################

    async save(){
        const queryDb = setQuerySave(this, 'playlist');
        try {
            await client.query(queryDb);
            return true;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id){
        try {
            await client.query('DELETE FROM "playlist" WHERE id=$1', [id]);
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Playlist;

function setQueryBPl(days) {
    if(days === 0){
        return{
            text:`SELECT pl_r.*
            FROM pl_r
            JOIN game g ON g.playlist_id=pl_r.id
            GROUP BY pl_r.id, pl_r.name, pl_r.description, pl_r.image, pl_r.user_id, pl_r.rating, pl_r.nb_rating, pl_r.deezer_ids
            ORDER BY count(g.score) DESC
            LIMIT 10;`
        }
    }else{
        const setDays = `${days} days`;
        return {
            text:`SELECT pl_r.*
                FROM pl_r
                JOIN game g ON g.playlist_id=pl_r.id
                WHERE g.date>(NOW() - $1::interval)
                GROUP BY pl_r.id, pl_r.name, pl_r.description, pl_r.image, pl_r.user_id, pl_r.rating, pl_r.nb_rating, pl_r.deezer_ids
                ORDER BY count(g.score) DESC
                LIMIT 10;`,
            values: [setDays]
        }
    }
}