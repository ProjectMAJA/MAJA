const Rating = require('../Models/Rating');


const ratingCtrl = {

    save: async (req, res, next)=>{
        req.body.user_id = req.userLogged.id;
        const rating = new Rating(req.body)
        try {
            const result = await rating.save();
            res.json(result);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },
}

module.exports = ratingCtrl;