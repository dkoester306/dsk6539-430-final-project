
const handleLogin = (e) => {
    e.preventDefault();

    // console.log($("input[name=_csrf]").val());
    // console.log($("#loginForm").attr("action"));
    // console.log($("#loginForm").serialize());
    
    sendAjax('GET', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    return false;
};

const handleSignup = (e) => {
    // e.preventDefault();
    // $("#domoMessage").animate({ width: 'hide' }, 350);

    // if ($("#user").val() == '' || $("#pass").val() == '' || $('#pass2').val() == '') {
    //     handleError("RAWR!! All fields are required");
    //     return false;
    // }

    // if ($("#pass").val() !== $('#pass2').val()) {
    //     handleError("RAWR!! Passwords do not match");
    //     return false;
    // }

    // sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    // return false;
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

const SignupWindow = (props) => {
    // return (
    //     <form id="signupForm" name="signupForm"
    //         onSubmit={handleSignup}
    //         action="/signup"
    //         method="POST"
    //         className="mainForm"
    //     >
    //         <label htmlFor="username">Username: </label>
    //         <input id="user" type="text" name="username" placeholder="username" />
    //         <label htmlFor="pass">Password: </label>
    //         <input id="pass" type="password" name="pass" placeholder="password" />
    //         <label htmlFor="pass2">Password: </label>
    //         <input id="pass2" type="password" name="pass2" placeholder="retype password" />
    //         <input type="hidden" name="_csrf" value={props.csrf} />
    //         <input className="formSubmit" type="submit" value="Sign Up" />
    //     </form>
    // );
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => {
    // ReactDOM.render(
    //     <SignupWindow csrf={csrf} />,
    //     document.querySelector("#content")
    // );
};

const setup = (csrf) => {

    createLoginWindow(csrf); // default view
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        console.log("IN getToken "+ result.csrfToken);
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});

