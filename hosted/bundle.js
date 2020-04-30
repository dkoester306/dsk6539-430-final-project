"use strict";

//const client = require('../login/client.js');
var handleSearch = function handleSearch(e) {
  e.preventDefault();
  var searchTerm = $('#searchForm').attr("action");
  searchTerm += "?q=" + encodeURIComponent($('#searchName').val()); // searchTerm += encodeURIComponent(client.accessToken);

  sendWithToken('GET', searchTerm, null, function () {
    console.log('Sent with token');
  });
  return false;
};

var SearchWindow = function SearchWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "searchForm",
      name: "searchForm",
      onSubmit: handleSearch,
      action: "https://api.spotify.com/v1/search",
      method: "GET",
      className: "searchForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "searchTerm"
    }, "Search Term: "), /*#__PURE__*/React.createElement("input", {
      id: "searchName",
      type: "text",
      name: "searchTerm",
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
}; // const handleDomo = (e) => {
//     e.preventDefault();
//     $("#domoMessage").animate({ width: 'hide' }, 350);
//     if ($("domoName").val() == '' || $("#domoAge").val() == '') {
//         handleError("RAWR!! All fields are required");
//         return false;
//     }
//     sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
//         loadDomosFromServer();
//     });
//     return false;
// };
// const DomoForm = (props) => {
//     return (
//         <form id="domoForm" name="domoForm"
//             onSubmit={handleDomo}
//             action="/maker"
//             method="POST"
//             className="domoForm"
//         >
//             <label htmlFor="name">Name: </label>
//             <input id="domoName" type="text" name="name" placeholder="Domo Name" />
//             <label htmlFor="age">Age: </label>
//             <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
//             <input type="hidden" name="_csrf" value={props.csrf} />
//             <input className="makeDomoSubmit" type="submit" value="Make Domo" />
//         </form>
//     );
// };
// const DomoList = function (props) {
//     if (props.domos.length === 0) {
//         return (
//             <div className="domoList">
//                 <h3 className="emptyDomo">No Domos Yet</h3>
//             </div>
//         );
//     }
//     const domoNodes = props.domos.map(function (domo) {
//         return (
//             <div key={domo._id} className="domo">
//                 <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
//                 <h3 className="domoName">Name: {domo.name}</h3>
//                 <h3 className="domoAge">Age: {domo.age}</h3>
//             </div>
//         );
//     });
//     return (
//         <div className="domoList">
//             {domoNodes}
//         </div>
//     );
// };
// const loadDomosFromServer = () => {
//     sendAjax('GET', '/getDomos', null, (data) => {
//         ReactDOM.render(
//             <DomoList domos={data.domos} />, document.querySelector("#domos")
//         );
//     });
// };


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
