const handleSearch = (e) => {
    e.preventDefault();
    sendAjax('POST', $('#searchForm').attr("action"), $('#searchForm').serialize(), redirect);
    return false;
}
const SearchWindow = (props) => {
    return (
        <form id="searchForm" name="searchForm"
            onSubmit={handleSearch}
            action='/search'
            method='GET'
            className="searchForm"
        >
            <label htmlFor="searchTerm">Search Term: </label>
            <input id="searchName" type="text" name="searchTerm" placeholder="Search Term" />
            <input type="hidden" name="_csrf" values={props.csrf} />
            <input className="makeSearchSubmit" type="submit" value="Search Term" />
        </form>
    );
    
};

// const handleDomo = (e) => {
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

const createSearchWindow = (csrf) => {
    ReactDOM.render(
        <SearchWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};

const setup = function (csrf) {
    
    createSearchWindow(csrf);
    
};



const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken); 
    });
};

$(document).ready(function () {
    getToken(); 
    
});