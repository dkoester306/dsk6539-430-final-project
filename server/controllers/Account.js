const models = require('../models');

const { Account } = models;



const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};


const logout = (req, res) => {
  // destroy the session
  req.session.destroy();
  res.redirect('/');
};

const generateRandomString = function (length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const login = (request, response) => {
  const req = request;
  const res = response;

  //console.log(req.url);

  var clientId = "901e07a2f6b7423c81cc56454daa023c"; // Your client id
  var redirectUri = "http://localhost:3000/"; // Your redirect uri

  var state = generateRandomString(16);
  //localStorage.setItem(stateKey, state);
  var scope = "user-read-private user-read-email";

  var url = "https://accounts.spotify.com/authorize";
  url += "?response_type=token";
  url += "&client_id=" + encodeURIComponent(clientId);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(redirectUri);
  url += "&state=" + encodeURIComponent(state);


  return res.json({ redirect: url });
};

const signup = (request, response) => {

};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfToken = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfToken);
};

const getHashParams = () => {
  var hashParams = {};
  var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
};


module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
