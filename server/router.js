const controllers = require('./controllers');
const mid = require('./middleware')
const cors = require('cors');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPlaylists', mid.requiresLogin, controllers.Playlist.getPlaylists);
  app.get('/login', cors(), controllers.Account.login);
  app.get('/getOnePlaylist', mid.requiresLogin, controllers.Playlist.getOnePlaylist);
  app.get('/searchTerm', controllers.Playlist.searchTerm);
  app.get('/search', controllers.Playlist.searchPage);
  app.get('/callback', controllers.Account.callbackSpotify);
  app.post('/refreshToken',mid.requiresLogin, controllers.Account.changeRefreshToken);
  app.post('/makeAccount', controllers.Account.makeAccount);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  //app.post('/removeCurrentPlaylist', mid.requiresLogin, controllers.Account.setCurrentPlaylistToNone);
  app.post('/addEntry', mid.requiresLogin, controllers.Playlist.makePlaylistEntry);
  app.post('/addPlaylist', mid.requiresLogin, controllers.Playlist.makePlaylist);
  app.post('/changePlaylist', mid.requiresLogin, controllers.Account.changeCurrentPlaylist);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

};

module.exports = router;
