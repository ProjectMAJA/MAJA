const client = require('../database');
const setQuerySave = require('../service/setQuerySave');

class Game {

     constructor(obj={}) {
        for (const propName in obj) {
            this[propName] = obj[propName];
        }
    }

    async save(){
        const queryDb = setQuerySave(this, 'game');
        try {
            const {rows} = await client.query(queryDb);
            console.log(rows);
            return true;
        } catch (error) {
            throw error;
        }
    }
}      

module.exports = Game;