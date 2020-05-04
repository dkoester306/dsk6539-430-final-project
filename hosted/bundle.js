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
      console.log(data.tracks.items);
      loadSearchResults(data);
    },
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
  return false;
}; // When clicking on a playlist div,
// it will read the title of it and change the page for the playlist
// Will display the playlist entryies inside of the playlist


var displayPlaylistContent = function displayPlaylistContent(e) {
  e.preventDefault();
};

var handleRefreshToken = function handleRefreshToken(e) {
  e.preventDefault(); //console.log($("#searchForm").serialize());

  sendAjax('POST', '/refreshToken', $("#searchForm").serialize(), function (data) {
    console.log("Refresh Token as been updated in your account.");
  });
  return false;
};

var handleNewPlaylist = function handleNewPlaylist(e) {
  e.preventDefault();
  sendAjax('POST', '/addPlaylist', $("#searchForm").serialize(), function (data) {
    //console.log(data);
    loadPlaylistsFromServer(data);
  });
  return false;
}; // should only run if the user has currently selected a playlist
// (A user must click playlistDiv and have it opened in the panel in order for results to be added)
// 


var handleAddResultToPlaylist = function handleAddResultToPlaylist(e, newData) {
  e.preventDefault();
  var string = "&title=" + newData.title + "&artist=" + newData.artist + "&album=" + newData.album + "&link=" + newData.link + "&image=" + newData.image;
  var trim = string.split(' ').join('+');
  sendAjax('POST', '/addEntry', $('#playlistEntriesList').serialize() + trim, function (data) {});
}; // will change the currentPlaylist part of the document inside the current account.
// Will not change anything if the current playlist for the account is the same as the sent data ()


var handleChangeCurrentPlaylist = function handleChangeCurrentPlaylist(e, pName) {
  e.preventDefault();
  var replaced = pName.split(' ').join('+');
  var newData = $('#playlistResultsList').serialize() + "&playlistName=" + replaced; //console.log($('#playlistResultsList').serialize());

  sendAjax('POST', '/changePlaylist', newData, function (data) {
    // load new page with entries inside
    loadPlaylistEntries(data);
  });
  return false;
};

var SearchWindow = function SearchWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "searchForm",
      name: "searchForm",
      onSubmit: handleSearch,
      action: "/searchTerm",
      method: "GET",
      className: "searchForm"
    }, /*#__PURE__*/React.createElement("div", {
      id: "navParent"
    }, /*#__PURE__*/React.createElement("div", {
      className: "navContainer"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "q"
    }, "Song Search "), /*#__PURE__*/React.createElement("input", {
      id: "searchName",
      type: "text",
      name: "q",
      placeholder: "Search Term"
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeSearchSubmit",
      type: "submit",
      value: "Search Term"
    })), /*#__PURE__*/React.createElement("div", {
      id: "newPlaylistInput",
      className: "navContainer"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "playlistName"
    }, "Playlist Name "), /*#__PURE__*/React.createElement("input", {
      id: "newPlaylistName",
      type: "text",
      name: "playlistName",
      placeholder: "New Playlist Name"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: handleNewPlaylist
    }, "Add Playlist")), /*#__PURE__*/React.createElement("div", {
      className: "navContainer"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: handleRefreshToken,
      id: "refreshTokenButton"
    }, "Refresh Token")), /*#__PURE__*/React.createElement("div", {
      id: "logoutDiv",
      className: "navContainer"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/logout",
      id: "logoutButton"
    }, "Logout")), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    })))
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
}; // displays all the contents of a particular playlist


var PlaylistEntriesWindow = function PlaylistEntriesWindow(props) {
  if (props.entries.length === 0) {
    return (/*#__PURE__*/React.createElement("form", {
        className: "searchResultsList",
        id: "playlistEntriesList"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("h3", {
        className: "emptySearchResults"
      }, "No Contents in Playlist"))
    );
  }

  var entriesNodes = props.entries.map(function (entry) {
    /*#__PURE__*/
    React.createElement("div", {
      id: "entryForm",
      className: "resultForm"
    }, /*#__PURE__*/React.createElement("a", {
      href: result.external_urls.spotify
    }, /*#__PURE__*/React.createElement("img", {
      src: result.album.images[2].url,
      className: "resultPicture",
      id: "entryImage"
    })), /*#__PURE__*/React.createElement("div", {
      className: "songInfo"
    }, /*#__PURE__*/React.createElement("div", {
      className: "wordContainer"
    }, /*#__PURE__*/React.createElement("h5", {
      id: "entryTitle",
      className: "resultInfo"
    }, result.name)), /*#__PURE__*/React.createElement("div", {
      className: "wordContainer"
    }, /*#__PURE__*/React.createElement("h5", {
      id: "entryArtist",
      className: "resultInfo"
    }, allArtists)), /*#__PURE__*/React.createElement("div", {
      className: "wordContainer"
    }, /*#__PURE__*/React.createElement("h5", {
      id: "entryAlbum",
      className: "resultInfo"
    }, result.album.name))), /*#__PURE__*/React.createElement("div", {
      className: "spotifyInfo"
    }, /*#__PURE__*/React.createElement("button", {
      className: "resultSubmit",
      onClick: handleAddResult
    }, "+")));
  });
  return (/*#__PURE__*/React.createElement("form", {
      className: "searchResultsList",
      id: "playlistEntriesList"
    }, /*#__PURE__*/React.createElement("h4", {
      id: "playlistName"
    }, props.playlistName), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), entriesNodes)
  );
}; // displays the window showing All PLAYLISTS


var PlaylistWindow = function PlaylistWindow(props) {
  if (props.playlists.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "searchResultsList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptySearchResults"
      }, "Include at least 1 character in playlist name field!"))
    );
  }

  var playlistNodes = props.playlists.map(function (playlist) {
    return (
      /*#__PURE__*/
      // If
      React.createElement("div", {
        className: "playlistWrapper"
      }, /*#__PURE__*/React.createElement("button", {
        className: "playlistTitleButton",
        onClick: function onClick(e) {
          return handleChangeCurrentPlaylist(e, playlist.name);
        },
        value: playlist.name
      }, playlist.name))
    );
  });
  return (/*#__PURE__*/React.createElement("form", {
      id: "playlistResultsList"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), playlistNodes)
  );
}; // Displays the search results when using the Song Search


var SearchResultWindow = function SearchResultWindow(props) {
  if (!props.results) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "searchResultsList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptySearchResults"
      }, "Include at least 1 character in search field!"))
    );
  } // create the option tags for the select


  var optionNodes = props.results.items.map(function (result) {}); // create all React Components for each result that is found. This one finds the tracks. 
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
      }, /*#__PURE__*/React.createElement("a", {
        href: result.external_urls.spotify
      }, /*#__PURE__*/React.createElement("img", {
        src: result.album.images[2].url,
        className: "resultPicture",
        id: "resultImage"
      })), /*#__PURE__*/React.createElement("div", {
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
      }, /*#__PURE__*/React.createElement("button", {
        className: "resultSubmit",
        onClick: function onClick(e) {
          return handleAddResultToPlaylist(e, {
            title: result.name,
            artist: allArtists,
            album: result.album.name,
            link: result.external_urls.spotify,
            image: result.album.images[2].url
          });
        }
      }, "+")))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "searchResultsList"
    }, resultNodes)
  );
};

var loadPlaylistEntries = function loadPlaylistEntries(newData) {
  $.ajax({
    type: 'GET',
    url: '/getOnePlaylist',
    data: {
      "playlistName": newData.playlistName,
      "csrf": newData._csrf
    },
    success: function success(data) {
      console.log(data);
      ReactDOM.render( /*#__PURE__*/React.createElement(PlaylistEntriesWindow, {
        csrf: data.csrf,
        entries: data.playlist.tracks,
        newData: newData
      }), document.querySelector('#playlistDiv'));
    },
    error: function error(xhr, status, _error2) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var loadPlaylistsFromServer = function loadPlaylistsFromServer(csrf) {
  sendAjax('GET', '/getPlaylists', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(PlaylistWindow, {
      playlists: data.playlists,
      csrf: csrf
    }), document.querySelector("#playlistDiv"));
  });
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
    url: '/makeAccount',
    success: function success(data) {
      console.log("IN setup");
      loadPlaylistsFromServer(csrf);
    }
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
