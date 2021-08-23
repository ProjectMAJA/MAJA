const {Router} = require('express');
const gameCtrl = require('./controllers/gameCtrl');
const playlistCtrl = require('./controllers/playlistCtrl');
const ratingCtrl = require('./controllers/ratingCtrl');
const userCtrl = require('./controllers/userCtrl');
const authLog = require('./middlewares/authLog');
const checkLog = require('./middlewares/checkLog');

const router = Router();


//############# USER Routes #################
router.get('/users', authLog, userCtrl.getAll);
router.get('/user', authLog, userCtrl.getOne);

router.post('/login', userCtrl.login);
router.post('/user', checkLog, userCtrl.save);

router.delete('/user/:id(\\d+)', authLog, userCtrl.delete);


//############# PLAYLIST Routes #################
router.get('/playlists', playlistCtrl.getAll);
router.get('/playlist/:id(\\d+)', playlistCtrl.getOne);
router.get('/admin/playlists', playlistCtrl.getAdminPlaylists);
router.get('/playlists/bests/:days(\\d+)', playlistCtrl.getBestsPlaylists);
router.get('/playlists/random/:nb(\\d+)', playlistCtrl.getRandomPlaylists);

router.get('/user/playlists', authLog, playlistCtrl.getUserPlaylists);
router.get('/user/played', authLog, playlistCtrl.getUserPlayed);
router.get('/user/liked', authLog, playlistCtrl.getUserLiked);

router.post('/playlist', authLog, playlistCtrl.save);

router.delete('/playlist', authLog, playlistCtrl.delete);

//############# GAME Routes #################
router.post('/playlist/game', authLog, gameCtrl.save);

//############# RATING Routes #################
router.post('/playlist/rating', authLog, ratingCtrl.save);

module.exports = router;