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
      loadSearchResults(data.tracks.items);
    },
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
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
      id: "searchDiv",
      className: "containerContent"
    }, /*#__PURE__*/React.createElement("h3", null, "Search Results")), /*#__PURE__*/React.createElement("div", {
      id: "playlistDiv",
      className: "containerContent"
    }, /*#__PURE__*/React.createElement("h3", null, "All Playlists")))
  );
};

var SearchResultWindow = function SearchResultWindow(props) {
  if (false) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "searchResultsList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptySearchResults"
      }, "No Results Found"))
    );
  }

  return (/*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "THERE IS NOTHING HERE"))
  );
};

var createSearchResultWindow = function createSearchResultWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchResultWindow, {
    csrf: csrf
  }), document.querySelector('#searchDiv'));
};

var loadSearchResults = function loadSearchResults(data) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchResultWindow, null), document.querySelector('#searchDiv'));
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
  createSearchResultWindow(csrf);
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
  $("#errorMessage").text(message); //$("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  //$("#domoMessage").animate({ width: 'hide' }, 350);
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
