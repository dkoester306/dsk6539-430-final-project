
const account = require('./Account.js');
const models = require('../models');
const request = require('request');

const searchPage = (req, res) => {
    res.render('search', { csrfToken: req.csrfToken() });
};

const searchTerm = (req, res) => {
    // for some reason I need to use req.QUERY and not body
    const term = req.query.term;
    const type = "&type=album,artist,playlist,track,show,episode"
    const options = {
        url: 'https://api.spotify.com/v1/search' + term + type,
        headers: {
            'Authorization': "Bearer " + account.currentSpotifyToken,
        },
        json: true,
        
    };
    console.log(options.url);
    
    console.log("TOKEN: "+account.currentSpotifyToken);
    request.get(options, function (error, response, body) {
        if (!error) {
            //console.log(body);
            return res.json(body);
            
        }
        else {
            console.log(error);
            
        }
    });
}

const makePlaylist = (request, response) => {
    
};

const removePlaylist = (request, response) => {
    // - check if 'tracks' array is empty in PlaylistSchema
};

const makePlaylistEntry = (request, response) => {
    // this function needs to be able to
    // - Find the target playlist to add to
}

const removePlaylistEntry = (request, response) => {
    
};


  
module.exports.searchPage = searchPage;
module.exports.searchTerm = searchTerm;
