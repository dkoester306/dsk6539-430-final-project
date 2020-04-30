
const account = require('./Account.js');

const searchPage = (req, res) => {
    res.render('search', { csrfToken: req.csrfToken() });
};

const searchTerm = (req, res) => {
    // for some reason I need to use req.QUERY and not body
    const term = req.query.term;
    const options = {
        url: 'https://api.spotify.com/v1/search?q=' + term,
        headers: {
            "Authorization": "Bearer " + currentSpotifyToken,
        },
        json: true,
        
    };
    const something = currentSpotifyToken;
    console.log("TOKEN: "+something);
    request.get(options, function (error, response, body) {
        if (!error) {
            console.log(body);
            
        }
        else {
            console.log(error);
            
        }
    });
}


  
module.exports.searchPage = searchPage;
module.exports.searchTerm = searchTerm;
