const controllers = require('./controllers');
const mid = require('./middleware')

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', controllers.Account.login);
  app.post('/storeToken', controllers.Account.storeToken);
  app.get('/searchTerm', controllers.Playlist.searchTerm);
  app.get('/search', controllers.Playlist.searchPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
