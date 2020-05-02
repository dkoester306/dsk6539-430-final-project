const models = require('../models');
const request = require('request');
const querystring = require('querystring');

const { Account } = models;

const client_id = "960af2f158f047cd984342e083139399"; // Your client id
const redirect_uri = "http://localhost:3000/callback"; // Your redirect uri
const client_secret = "29ef411e8d084371a5a9ae89df95e260";
const state_key = 'spotify_auth_state';

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

const login = (req, res) => {
  let state = generateRandomString(16);
  res.cookie(state_key, state);
  console
  //localStorage.setItem(stateKey, state);
  let scope = "user-read-private user-read-email";

  // var url = "https://accounts.spotify.com/authorize";
  // url += "?response_type=token";
  // url += "&client_id=" + encodeURIComponent(clientId);
  // url += "&scope=" + encodeURIComponent(scope);
  // url += "&redirect_uri=" + encodeURIComponent(redirectUri);
  // url += "&state=" + encodeURIComponent(state);


  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    }));
};

// const storeToken = (request, response) => {
//   const req = request;
//   const res = response;
//   if (!req.body.token) {
//     return res.status(400).json({ error: "You need the access token to proceed." });
//   }
//   module.exports.currentSpotifyToken = req.body.token;

//   return res.json({ redirect: '/search' });
// };

const callbackSpotify = (req, res) => {
  console.log("HERE IN CALLBACK");
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[state_key] : null;

  if (state === null || state !== storedState) {
    console.log("State key is either missing, or statekey is not equal to stored state")
  } else {
    res.clearCookie(state_key);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        module.exports.currentSpotifyToken = body.access_token,
        module.exports.refreshSpotifyToken= body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + module.exports.currentSpotifyToken },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });
        res.redirect('/search');
        

        // we can also pass the token to the browser to make requests from there
        // res.redirect('/#' +
        //   querystring.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }));
      } else {
        // res.redirect('/#' +
        //   querystring.stringify({
        //     error: 'invalid_token'
        //   }));
      }
    });
  }
  
};

const getRefreshToken = (req, res) => {
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: module.exports.refreshSpotifyToken,
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      module.exports.currentSpotifyToken = body.access_token;
      res.send({ 'access_token': access_token });
    }
  })
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
module.exports.currentSpotifyToken = 'NO_TOKEN';
module.exports.refreshSpotifyToken = 'NO_REFRESH_TOKEN';
module.exports.callbackSpotify = callbackSpotify;
module.exports.getRefreshToken = getRefreshToken;