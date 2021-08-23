const client = require('../database');
const setQuerySave = require('../service/setQuerySave');

class Rating {

     constructor(obj={}) {
        for (const propName in obj) {
            this[propName] = obj[propName];
        }
    }

    async save(){
        const queryDb = {
            text:`
            INSERT INTO rating (user_id, playlist_id, rating)
            VALUES ($1,$2,$3)
            ON CONFLICT (user_id, playlist_id)
            DO 
                UPDATE SET rating=$3;`,
            values: [this.user_id, this.playlist_id, this.rating]
        };
        try {
            await client.query(queryDb);
            return true;
        } catch (error) {
            throw error;
        }
    }
}      

module.exports = Rating;