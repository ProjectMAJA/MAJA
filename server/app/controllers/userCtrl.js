const User = require('../Models/User');

const userCtrl = {
    //Récupération de tous les users uniquement disponible pour les comptes admin
    getAll: async (req,res,next)=>{
        try {
            if(req.userLogged.isadmin === true){
                const users = await User.findAll();
                res.json(users);
            }else{
                throw new Error('User is not an admin');
            }
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    //Récupération du profil via le token
    getOne: async (req,res,next)=> {
        const id = req.userLogged.id;
        try {
            const user = await User.findOne(id);
            res.json(user);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    //Connexion au site avec récupération d'un token
    login: async (req,res,next)=>{
        if ((!req.body.pseudo && !req.body.email) || !req.body.password) {
            res.status(400).json({ message: 'Error. Please enter the correct username and password' })
        }
        const user = new User(req.body);
        try {
            const result = await user.login();
            res.json(result);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    //Modification d'un profil et inscription
    save: async (req, res, next)=>{
        if(req.userLogged){
            req.body.id = req.userLogged.id;
        }
        const user = new User(req.body)
        try {
            const result = await user.save();
            res.json(result);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    //Suppression d'un compte par l'utilisateur ou un administrateur
    delete: async (req,res,next)=>{
        const id = parseInt(req.params.id, 10);
        try {
            if(id !== req.userLogged.id && req.userLogged.isadmin !== true){
                throw new Error('This user is not allowed to delete this account');
            }
            if(id === 1){
                throw new Error('This user can be delete');
            }
            await User.delete(id);

            res.json(`User ${id} has been deleted`)            
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}

module.exports = userCtrl;