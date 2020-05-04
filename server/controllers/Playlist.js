
const request = require('request');
const models = require('../models');

const { Playlist } = models;

const searchPage = (req, res) => {
  res.render('search', { csrfToken: req.csrfToken() });
};

const searchTerm = (req, res) => {
  if (!req.session.account) {
    console.log('IN search Term: No account found');
    return res.status(400).json({ error: 'No account found in req.session.account' });
  }

  if (!req.query.term) {
    return res.status(400).json({ error: 'Please enter text into Search Bar' });
  }
  // for some reason I need to use req.QUERY and not body
  const { term } = req.query;
  const type = '&type=album,artist,playlist,track,show,episode';
  const options = {
    url: `https://api.spotify.com/v1/search${term}${type}`,
    headers: {
      Authorization: `Bearer ${req.session.account.accessToken}`,
    },
    json: true,

  };
    // console.log(options.url);

  // console.log("TOKEN: "+account.currentSpotifyToken);
  request.get(options, (error, response, body) => {
    if (!error) {
      return res.json(body);
    }

    // console.log('ERROR HERE IN SEARCHTERM');
    // console.log(error);
  });
};

const makePlaylist = (req, res) => {
  // creates an playlist with no tracks
  if (!req.body.playlistName) {
    return res.status(400).json({ error: 'Playlist name field must be filled out' });
  }
  Playlist.PlaylistModel.findByName(req.body.playlistName, (err, doc) => {
    if (err) {
      // console.log(err);
      return res.status(400).json({ error: 'An error occurred retrieving the playlists' });
    }
    if (!doc) {
      const playlistData = {
        name: req.body.playlistName,
        tracks: [],
        owner: req.session.account._id,
      };

      const newPlaylist = new Playlist.PlaylistModel(playlistData);
      const playlistPromise = newPlaylist.save();

      playlistPromise.then(() => res.status(201).json({ message: 'Make new playlist', _csrf: req.body._csrf }));
      playlistPromise.catch((err) => {
        if (err.code === 11000) {
          return res.status(400).json({ error: 'Playlist already exists' });
        }
        return res.status(400).json({ error: 'An error occurred' });
      });
      return playlistPromise;
    }
  });
};

const getPlaylists = (req, res) => Playlist.PlaylistModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    // console.log(err);
    return res.status(400).json({ error: 'An error occurred retrieving the playlists' });
  }
  return res.json({ playlists: docs });
});


const getOnePlaylist = (req, res) => {
  // console.log(req.query);
  if (req.query.playlistName !== 'NONE') {
    return Playlist.PlaylistModel.findByName(req.session.account.currentPlaylist, (err, doc) => {
      if (err) {
        // console.log(err);
        return res.status(400).json({ error: 'An error occurred retrieving the playlist' });
      }
      // console.log(doc);
      return res.json({
        playlist: doc, _csrf: req.query.csrf, tracks: doc.tracks, playlistName: req.session.account.currentPlaylist,
      });
    });
  }
  return res.status(400).status({ error: 'There must be a selected playlist before showing it.' });
};


const makePlaylistEntry = (req, res) => {
  // this function needs to be able to
  // - Find the target playlist to add to
  // console.log(req.body);

  const newEntry = {
    img: req.body.image,
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
    link: req.body.link,
  };

  Playlist.PlaylistModel.findOneAndUpdate({ name: req.session.account.currentPlaylist }, { $push: { tracks: newEntry } }, { new: true }, (err, doc) => {
    if (err) {
      // console.log(err);
      return res.status(400).json({ error: 'An error occurred retrieving the playlist' });
    }
    if (!doc) {
      // console.log(err);
      return res.status(304).json({ error: 'No docs found' });
    }
    return res.status(201).json({ doc });
  });
};


module.exports.searchPage = searchPage;
module.exports.searchTerm = searchTerm;
module.exports.makePlaylist = makePlaylist;
module.exports.getPlaylists = getPlaylists;
module.exports.getOnePlaylist = getOnePlaylist;
module.exports.makePlaylistEntry = makePlaylistEntry;
