const searchPage = (req, res) => {
    res.render('search', { csrfToken: req.csrfToken() });
};
  
module.exports.searchPage = searchPage;