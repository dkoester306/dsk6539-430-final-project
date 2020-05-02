const controllers = require('./controllers');
const mid = require('./middleware')
const cors = require('cors');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login',cors(), controllers.Account.login);
  //app.post('/storeToken', controllers.Account.storeToken);
  app.get('/searchTerm', controllers.Playlist.searchTerm);
  app.get('/search', controllers.Playlist.searchPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/callback', controllers.Account.callbackSpotify);
  app.get('/refreshToken', controllers.Account.getRefreshToken);
  app.post('/makeAccount', controllers.Account.makeAccount);
};

module.exports = router;
