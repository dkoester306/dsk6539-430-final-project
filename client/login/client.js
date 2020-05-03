
const handleLogin = (e) => {
    e.preventDefault();
    return false;
};


const LoginWindow = (props) => {
    return (
        <form id="loginForm" name="loginForm"
            className="mainForm">
            <h3>Click Here to login with Spotify</h3>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <a id="loginButton" href="/login">Login</a>
        </form>
    );
};

// const sendWithToken = (type, action, token, data, success) => {
//     if (token == null) {
//         console.log("No access Token");
//         return;
//     }
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


const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    createLoginWindow(csrf); // default view
};
const getHashParams = () => {
    var hashParams = {};
    var e,
        r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
};


const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();

});

