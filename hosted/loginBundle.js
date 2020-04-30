"use strict";

var accessToken = null;

var handleLogin = function handleLogin(e) {
  e.preventDefault();
  sendAjax('GET', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var LoginWindow = function LoginWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "loginForm",
      name: "loginForm",
      onSubmit: handleLogin,
      action: "/login",
      method: "GET",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("h3", null, "Click Here to login with Spotify"), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Log In"
    }))
  );
};

var sendWithToken = function sendWithToken(type, action, data, success) {
  if (accessToken == null) {
    console.log("No access Token");
    return;
  }

  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  createLoginWindow(csrf); // default view
};

var getHashParams = function getHashParams() {
  var hashParams = {};
  var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);

  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }

  return hashParams;
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    console.log("IN getToken " + result.csrfToken);
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken(); // get accessToken for spotify from the URL and store it.

  var params = getHashParams();
  accessToken = params.access_token;

  if (accessToken) {
    window.location = "http://localhost:3000/search";
  }
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
};

var sendAjaxWithToken = function sendAjaxWithToken(type, action, data, token, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error2) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
