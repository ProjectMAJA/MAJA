const {Pool} = require('pg');

let pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

//avec un Pool, plus besoin de se connecter avant l'export, c'est géré directement sous le capot par le Pool lui-même

module.exports = pool;