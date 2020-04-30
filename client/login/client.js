let accessToken = null;
const handleLogin = (e) => {
    e.preventDefault();

    sendAjax('GET', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    return false;
};


const LoginWindow = (props) => {
    return (
        <form id="loginForm" name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="GET"
            className="mainForm">

            <h3>Click Here to login with Spotify</h3>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Log In" />
        </form>
    );
};

const sendWithToken = (type, action, data, success) => {
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
        error: function (xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};


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
        console.log("IN getToken " + result.csrfToken);
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();

    // get accessToken for spotify from the URL and store it.
    var params = getHashParams();
    accessToken = params.access_token;
    if (accessToken) {
        window.location = "http://localhost:3000/search";
    }
});

