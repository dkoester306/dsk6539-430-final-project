"use strict";

// handle what happens when user presses the search button
var handleSearch = function handleSearch(e) {
  e.preventDefault();
  var newData = {
    term: "?q=" + encodeURIComponent($("#searchName").val())
  };
  $.ajax({
    type: 'GET',
    url: $("#searchForm").attr("action"),
    data: newData,
    dataType: 'json',
    success: function success(data) {
      //console.log(data.tracks.items);
      loadSearchResults(data);
    },
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
  return false;
};

var handleAddResult = function handleAddResult(e) {
  e.preventDefault();
  console.log("handleAddResult: " + "");
};

var SearchWindow = function SearchWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "searchForm",
      name: "searchForm",
      onSubmit: handleSearch,
      action: "/searchTerm",
      method: "GET",
      className: "searchForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "q"
    }, "Song Search "), /*#__PURE__*/React.createElement("input", {
      id: "searchName",
      type: "text",
      name: "q",
      placeholder: "Search Term"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      values: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeSearchSubmit",
      type: "submit",
      value: "Search Term"
    }))
  );
};

var MainPageWindow = function MainPageWindow(props) {
  return (/*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "containerContent"
    }, /*#__PURE__*/React.createElement("div", {
      className: "title-wrapper"
    }, /*#__PURE__*/React.createElement("h3", null, "Search Results")), /*#__PURE__*/React.createElement("div", {
      id: "searchDiv"
    })), /*#__PURE__*/React.createElement("div", {
      className: "containerContent"
    }, /*#__PURE__*/React.createElement("div", {
      className: "title-wrapper"
    }, /*#__PURE__*/React.createElement("h3", null, "All Playlists")), /*#__PURE__*/React.createElement("div", {
      id: "playlistDiv"
    })))
  );
};

var SearchResultWindow = function SearchResultWindow(props) {
  if (props.results.items.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "searchResultsList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptySearchResults"
      }, "No Results Found"))
    );
  } // create all React Components for each result that is found. This one finds the tracks. 
  // NEED TO IMPLEMENT SEARCH OF ALL TYPES (ALBUMS, ARTISTS only section)


  var resultNodes = props.results.items.map(function (result) {
    var allArtists = ""; // combine all the artists into one string for placement in the artist h5

    for (var i = 0; i < result.artists.length; i++) {
      if (i === result.artists.length - 1) {
        allArtists += result.artists[i].name;
        break;
      }

      allArtists += result.artists[i].name + " & ";
    }

    return (/*#__PURE__*/React.createElement("div", {
        id: "resultForm",
        key: result.id,
        className: "resultForm"
      }, /*#__PURE__*/React.createElement("img", {
        src: result.album.images[2].url,
        className: "resultPicture",
        id: "resultImage"
      }), /*#__PURE__*/React.createElement("div", {
        className: "songInfo"
      }, /*#__PURE__*/React.createElement("div", {
        className: "wordContainer"
      }, /*#__PURE__*/React.createElement("h5", {
        id: "resultTitle",
        className: "resultInfo"
      }, result.name)), /*#__PURE__*/React.createElement("div", {
        className: "wordContainer"
      }, /*#__PURE__*/React.createElement("h5", {
        id: "resultArtist",
        className: "resultInfo"
      }, allArtists)), /*#__PURE__*/React.createElement("div", {
        className: "wordContainer"
      }, /*#__PURE__*/React.createElement("h5", {
        id: "resultAlbum",
        className: "resultInfo"
      }, result.album.name))), /*#__PURE__*/React.createElement("div", {
        className: "spotifyInfo"
      }, /*#__PURE__*/React.createElement("a", {
        href: result.href,
        id: "resultLink",
        className: "resultInfo"
      }, "Link"), /*#__PURE__*/React.createElement("input", {
        className: "resultSubmit",
        type: "submit",
        value: "+"
      })))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "searchResultsList"
    }, resultNodes)
  );
};

var loadSearchResults = function loadSearchResults(data) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchResultWindow, {
    results: data.tracks
  }), document.querySelector('#searchDiv'));
};

var createMainPageWindow = function createMainPageWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(MainPageWindow, {
    csrf: csrf
  }), document.querySelector('#mainContent'));
};

var createSearchWindow = function createSearchWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchWindow, {
    csrf: csrf
  }), document.querySelector('#searchNav'));
};

var setup = function setup(csrf) {
  createSearchWindow(csrf);
  createMainPageWindow(csrf);
  $.ajax({
    type: 'POST',
    data: {
      _csrf: csrf
    },
    dataType: 'json',
    url: '/makeAccount'
  });
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
  //console.log("response.redirect: "+response.redirect);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
}; // const sendAjaxWithToken = (type, action, data, token, success) => {
//     $.ajax({
//         cache: false,
//         type: type,
//         url: action,
//         data: data,
//         headers: {
//             'Authorization': 'Bearer ' + token
//         },
//         dataType: 'json',
//         success: success,
//         error: function (xhr, status, error) {
//             var messageObj = JSON.parse(xhr.responseText);
//             handleError(messageObj.error);
//         }
//     });
// };
