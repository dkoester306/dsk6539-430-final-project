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
  // const req = request;
  // const res = response;

  // const username = `${req.body.username}`;
  // const password = `${req.body.pass}`;

  // if (!username || !password) {
  //   return res.status(400).json({ error: 'RAWR! All fields are required.' });
  // }

  // return Account.AccountModel.authenticate(username, password, (err, account) => {
  //   if (err || !account) {
  //     return res.status(401).json({ error: 'Wrong username or password!' });
  //   }
  //   req.session.account = Account.AccountModel.toAPI(account);
  //   return res.json({ redirect: '/maker' });
  // });


  //return res.json({ redirect: '/maker' });
  var clientId = "901e07a2f6b7423c81cc56454daa023c"; // Your client id
  var redirectUri = "http://dsk6539-project1.herokuapp.com/"; // Your redirect uri

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
  // const req = request;
  // const res = response;

  // // cast to strings to cover up some security flaws
  // req.body.username = `${req.body.username}`;
  // req.body.pass = `${req.body.pass}`;
  // req.body.pass2 = `${req.body.pass2}`;

  // if (!req.body.username || !req.body.pass || !req.body.pass2) {
  //   return res.status(400).json({ error: 'RAWR! All fields are required' });
  // }

  // if (req.body.pass !== req.body.pass2) {
  //   return res.status(400).json({ error: 'RAWR! Passwords do not mathc' });
  // }

  // return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
  //   const accountData = {
  //     username: req.body.username,
  //     salt,
  //     password: hash,
  //   };

  //   const newAccount = new Account.AccountModel(accountData);

  //   const savePromise = newAccount.save();

  //   savePromise.then(() => {
  //     req.session.account = Account.AccountModel.toAPI(newAccount);
  //     return res.json({redirect: '/maker'});
  //   });

  //   savePromise.catch((err) => {
  //     console.log(err);

  //     if (err.code === 11000) {
  //       return res.status(400).json({ error: 'Username already in use.' });
  //     }
  //     return res.status(400).json({ error: 'An error occurred' });
  //   });
  // });
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
module.exports.signup = signup;
module.exports.getToken = getToken;
