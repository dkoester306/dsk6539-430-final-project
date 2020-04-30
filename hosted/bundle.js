"use strict";

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
    success: function success() {
      console.log("Searched term successfully");
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
    }, "Search Term: "), /*#__PURE__*/React.createElement("input", {
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

var SearchResultsWindow = function SearchResultsWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "searchResultForm",
      name: "searchResultName"
    })
  );
};

var createSearchWindow = function createSearchWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchWindow, {
    csrf: csrf
  }), document.querySelector('#searchNav'));
};

var setup = function setup(csrf) {
  createSearchWindow(csrf);
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
