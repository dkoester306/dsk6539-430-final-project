// handle what happens when user presses the search button
const handleSearch = (e) => {
    e.preventDefault();

    const newData = { term: "?q=" + encodeURIComponent($("#searchName").val()), };

    $.ajax({
        type: 'GET',
        url: $("#searchForm").attr("action"),
        data: newData,
        dataType: 'json',
        success: function (data) {
            //console.log(data.tracks.items);
            loadSearchResults(data);
        },
        error: function (xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
    return false;
}



const SearchWindow = (props) => {
    return (
        <form id="searchForm" name="searchForm"
            onSubmit={handleSearch}
            action='/searchTerm'
            method='GET'
            className="searchForm"
        >
            <label htmlFor="q">Song Search </label>
            <input id="searchName" type="text" name="q" placeholder="Search Term" />
            <input type="hidden" name="_csrf" values={props.csrf} />
            <input className="makeSearchSubmit" type="submit" value="Search Term" />
        </form>
    );
};

const MainPageWindow = (props) => {
    return (
        <div className="container">
            <div id="searchDiv" className="containerContent">
                <h3>Search Results</h3>

            </div>
            <div id="playlistDiv" className="containerContent">
                <h3>All Playlists</h3>
            </div>
        </div>
    );
}


const SearchResultWindow = function (props) {
    if (props.items.length===0) {
        return (
            <div className="searchResultsList">
                <h3 className="emptySearchResults">No Results Found</h3>
            </div>
        );
    }
    const resultNodes = props.items;
    console.log(resultNodes);


    return (
        <div>
            <p>THERE IS NOTHING HERE</p>
        </div>
    );
};

const loadSearchResults = (data) => {
    ReactDOM.render(
        <SearchResultWindow results={data.tracks} />,
        document.querySelector('#searchDiv')
    );
    
};

const createMainPageWindow = (csrf) => {
    ReactDOM.render(
        <MainPageWindow csrf={csrf} />,
        document.querySelector('#mainContent')
    );
};


const createSearchWindow = (csrf) => {
    ReactDOM.render(
        <SearchWindow csrf={csrf} />,
        document.querySelector('#searchNav')
    );
};


const setup = function (csrf) {
    createSearchWindow(csrf);
    createMainPageWindow(csrf);
    createSearchResultWindow(csrf);
};


const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();

});