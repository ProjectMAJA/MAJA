const Playlist = require('../Models/Playlist');

const playlistCtrl = {

//############# Routes for all user #################

    getAll: async (req,res,next)=>{
        try {
            const playlists = await Playlist.findAll(req.userLogged);
            res.json(playlists);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    getOne: async (req,res,next)=>{
        try {
            const playlist = await Playlist.findOne(req.params.id);
            res.json(playlist);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    getAdminPlaylists: async (req,res,next)=>{
        try {
            const playlists = await Playlist.findAdminPlaylists();
            res.json(playlists);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    getBestsPlaylists: async (req,res,next)=>{
        const days = parseInt(req.params.days, 10);
        try {
            const playlists = await Playlist.findBestsPlaylists(days);
            res.json(playlists);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    getRandomPlaylists: async (req,res,next)=>{
        const nb = parseInt(req.params.nb, 10);
        try {
            const playlists = await Playlist.findRandomPlaylists(nb);
            res.json(playlists);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },


//#######################################################

//############# Routes for connected user #################

    getUserPlaylists: async (req,res,next)=>{
        try {
            const playlists = await Playlist.findUserPlaylists(req.userLogged.id);
            res.json(playlists);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    getUserPlayed: async (req,res,next)=>{
        try {
            const playlists = await Playlist.findUserPlayed(req.userLogged.id);
            res.json(playlists);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    getUserLiked: async (req,res,next)=>{
        try {
            const playlists = await Playlist.findUserLiked(req.userLogged.id);
            res.json(playlists);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

//#######################################################

//################## Route save ######################

    save: async (req, res, next)=>{
        req.body.user_id = req.userLogged.id;
        console.log(req.body);
        const user = new Playlist(req.body)
        try {
            const result = await user.save();
            res.json(result);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

//#######################################################

//################## Route delete ######################

delete: async (req,res,next)=>{
    const user_id = parseInt(req.body.user_id, 10);
    const id = parseInt(req.body.id, 10);
    try {
        if(user_id !== req.userLogged.id && req.userLogged.isadmin !== true){
            throw new Error('This user is not allowed to delete this playlist');
        }
        await Playlist.delete(id);

        res.json(`Playlist ${id} has been deleted`)            
    } catch (error) {
        res.status(500).json(error.message);
    }
}
}

module.exports = playlistCtrl;