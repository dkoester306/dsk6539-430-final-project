const request = require('request');
const querystring = require('querystring');
const models = require('../models');

const { Account } = models;

const client_id = '960af2f158f047cd984342e083139399'; // Your client id
const redirect_uri = 'https://dsk6539-final-project.herokuapp.com/callback'; // Your redirect uri
const client_secret = '29ef411e8d084371a5a9ae89df95e260';
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
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const login = (req, res) => {
  const state = generateRandomString(16);
  res.cookie(state_key, state);
  // localStorage.setItem(stateKey, state);
  const scope = 'user-read-private user-read-email';

  // var url = "https://accounts.spotify.com/authorize";
  // url += "?response_type=token";
  // url += "&client_id=" + encodeURIComponent(clientId);
  // url += "&scope=" + encodeURIComponent(scope);
  // url += "&redirect_uri=" + encodeURIComponent(redirectUri);
  // url += "&state=" + encodeURIComponent(state);


  res.redirect(`https://accounts.spotify.com/authorize?${
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
    })}`);
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
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[state_key] : null;


  if (state === null || state !== storedState) {
    console.log('State key is either missing, or statekey is not equal to stored state');
  } else {
    res.clearCookie(state_key);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`, // USED TO Be new Buffer but thats deprecated now
      },
      json: true,
    };


    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        module.exports.currentSpotifyToken = body.access_token;
        module.exports.refreshSpotifyToken = body.refresh_token;


        // use the access token to access the Spotify Web API
        // request.get(options, function (error, response, body) {
        //   Account.AccountModel.findByDisplayName(body.display_name, (err, doc) => {
        //     if (err) {
        //       return res.status(400).json({ error: "An error occurred" });
        //     }
        //     if (!doc) {


        //     }
        //   });
        //
        // });
        res.redirect('/search');
      } else {
        console.log('error in getting spotify info');
      }
    });


    // check if an account of this name already exists
    // Account.AccountModel.findByDisplayName()
  }
};

const makeAccount = (req, res) => {
  // console.log("Spotify Token Status " + module.exports.currentSpotifyToken);
  if (!req.session.account) {
    console.log('THERE IS NOT SESSION ACCOUNT');
  } else if (req.session.account) {
    console.log('THERE IS AN ACCOUNT PRESENT');
    console.log(req.session.account.displayName);
    Account.AccountModel.findByDisplayName(req.session.account.displayName, (err, doc) => {
      if (err) {
        console.log('GOT error here');
      }
      // console.log(doc);
      // console.log(req.session.account);
      req.session.account = Account.AccountModel.toAPI(doc);
      req.session.save((error) => {
        if (error) {
          // console.log(err);
        }
        // console.log('IN SAVE');
        return res.status(201);
      });
    });
    return res.status(304).json({ message: 'THERE IS AN ACCOUNT PRESENT' });
  }

  // console.log('PAST IF STATEMENTS');

  const options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: `Bearer ${module.exports.currentSpotifyToken}` },
    json: true,
  };

  request.get(options, (error, response, body) => {
    Account.AccountModel.findByDisplayName(body.display_name, (err, doc) => {
      if (err) {
        // console.log('SOMETHING HAPPENDED HERE');
        return res.status(400).json({ error: 'An error occurred' });
      }
      // the doc is new
      if (!doc) {
        // console.log('NO DOCS WERE FOUND');

        const newAccountData = {
          displayName: body.display_name,
          accessToken: module.exports.currentSpotifyToken,
          refreshToken: module.exports.refreshSpotifyToken,
          accountId: body.id,
          link: body.href,
          accountType: body.product,
          currentPlaylist: 'NONE',
        };

        const newAccount = new Account.AccountModel(newAccountData);
        const savePromise = newAccount.save();

        savePromise.then(() => {
          req.session.account = Account.AccountModel.toAPI(newAccount);
          
        });
        savePromise.catch((er) => {
          // console.log(`ERROR IN makeAccount Promise!!!! ${err}`);

          if (er.code === 11000) {
            return res.status(400).json({ error: 'Username already in use.' });
          }
          return res.status(400).json({ error: 'An error occurred' });
        });
      } else if (doc) {
        // console.log(doc);

        //return res.status(304).json({ message: 'Did not create a new account' });
      }
    });
    return res.status(201).json({ message: 'Make new account' });
  });
};

const changeRefreshToken = (req, res) => {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}` }, // USED TO Be new Buffer but thats deprecated now
    form: {
      grant_type: 'refresh_token',
      refresh_token: req.session.account.refreshToken,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // find the current account and update the access Token
      // console.log(req.session.account);
      Account.AccountModel.findOneAndUpdate({ displayName: req.session.account.displayName }, { accessToken: body.access_token }, (err, doc) => {
        if (err) {
          return res.status(400).json({ error: 'An error occurred while trying to change the access token of your account.' });
        }
        req.session.account = Account.AccountModel.toAPI(doc);
        req.session.save((err) => {
          if (err) {
            // console.log(err);
          }
        });
        return res.status(201);
      });
      return res.status(304).json({ message: 'Did not update access token.' });
    }
    if (error) {
      return res.status(400).json({ error: 'Something unexpected occurred' });
    }
  });
};

const changeCurrentPlaylist = (req, res) => {
  Account.AccountModel.findOneAndUpdate({ displayName: req.session.account.displayName }, { currentPlaylist: req.body.playlistName }, { new: true }, (err, doc) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred when trying to change the current playlist' });
    }
    // console.log(req.session.account);
    req.session.account = Account.AccountModel.toAPI(doc);
    req.session.save((err) => {
      if (err) {
        // console.log(err);
      }
    });
  });
  return res.status(201).json({ _csrf: req.body._csrf, playlistName: req.body.playlistName });
};

const setCurrentPlaylistToNone = (req, res) => {
  Account.AccountModel.findOneAndUpdate({ displayName: req.session.account.displayName }, { currentPlaylist: 'NONE' }, { new: true }, (err, doc) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred when trying to change the current playlist' });
    }
    req.session.account = Account.AccountModel.toAPI(doc);
    req.session.save((err) => {
      if (err) {
        // console.log(err);
      }
    });
  });
  // console.log(doc);
  return res.status(201).json({ message: 'chaged to None' });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfToken = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfToken);
};


module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.getToken = getToken;
module.exports.currentSpotifyToken = 'NO_TOKEN';
module.exports.refreshSpotifyToken = 'NO_REFRESH_TOKEN';
module.exports.callbackSpotify = callbackSpotify;
module.exports.changeRefreshToken = changeRefreshToken;
module.exports.makeAccount = makeAccount;
module.exports.changeCurrentPlaylist = changeCurrentPlaylist;
module.exports.setCurrentPlaylistToNone = setCurrentPlaylistToNone;
