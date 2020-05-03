const controllers = require('./controllers');
const mid = require('./middleware')
const cors = require('cors');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getPlaylists', mid.requiresLogin, controllers.Playlist.getPlaylists);
  app.get('/login',cors(), controllers.Account.login);
  //app.post('/storeToken', controllers.Account.storeToken);
  app.get('/searchTerm', controllers.Playlist.searchTerm);
  app.get('/search', controllers.Playlist.searchPage);
  app.get('/callback', controllers.Account.callbackSpotify);
  app.post('/refreshToken',mid.requiresLogin, controllers.Account.changeRefreshToken);
  app.post('/makeAccount', controllers.Account.makeAccount);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/addPlaylist', mid.requiresLogin, controllers.Playlist.makePlaylist);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
