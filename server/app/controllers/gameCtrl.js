const Game = require('../Models/Game');


const gameCtrl = {

    save: async (req, res, next)=>{
        req.body.user_id = req.userLogged.id;
        const game = new Game(req.body)
        try {
            const result = await game.save();
            res.json(result);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },
}

module.exports = gameCtrl;