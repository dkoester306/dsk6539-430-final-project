
const handleError = (message) => {
    $("#errorMessage").text(message);
    //$("#domoMessage").animate({ width: 'toggle' }, 350);
};

const redirect = (response) => {
    //$("#domoMessage").animate({ width: 'hide' }, 350);
    //console.log("response.redirect: "+response.redirect);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: 'json',
        success: success,
        error: function (xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

const sendAjaxWithToken = (type, action, data, token, success) => {
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
        error: function (xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

