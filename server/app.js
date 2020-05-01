// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const redis = require('redis');
const csrf = require('csurf');
const cors = require('cors');
const querystring = require('querystring');

var client_id = '6211d589dd89434aba2398d090ccb59d'; // Your client id
var client_secret = '2deaa5a045144a6b87fa4a275b24a0ad'; // Your secret
var redirect_uri = 'http://localhost:3000/callback'; // Your redirect uri

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/DanielPlaylists';

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Setup mongoose options to use newer functionality
const mongooseOptions = {
  userNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

let redisURL = {
  // you will need to folow the Setting Up Redis for Local Use" Instructions
  hostname: "redis-13482.c15.us-east-1-2.ec2.cloud.redislabs.com",
  port: "13482",
};

let redisPASS = 'FxHWUUUbUL0PneFC7QdRf1NiNbB4ZVSF';

// if the app is running on heroku, it will overwrite the above.
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  [, redisPASS] = redisURL.auth.split(':');
}
let redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPASS,
});


const router = require('./router.js');

var stateKey = 'spotify_auth_state';

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
// add session config
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'Domo Arigato',
  resave: 'true',
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());



// !!!!!!!!!!!!- NOTICE !!!!!!!!!!!!
// from spotify documentation STARTS HERE

// !!!!!!!!!!!!!!! - NOTICE - !!!!!!!!!!!!!!!
// spotify code end heres


// csrf must come AFTER app.use(cookieParser());
// and app.use (session({...}))
// should come BEFORE the router
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next();

  console.log('Missing CSRF token');
  return false;
});

router(app);
app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
