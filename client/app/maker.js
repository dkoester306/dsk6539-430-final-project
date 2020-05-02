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

const handleAddResult = (e) => {
    e.preventDefault();
    console.log("handleAddResult: " + "");
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

            <div className="containerContent">
                <div className="title-wrapper">
                    <h3>Search Results</h3>
                </div>
                <div id="searchDiv"></div>
            </div>
            <div className="containerContent">
                <div className="title-wrapper">
                    <h3>All Playlists</h3>
                </div>
                <div id="playlistDiv">

                </div>
            </div>
        </div>
    );
}


const SearchResultWindow = function (props) {
    if (props.results.items.length === 0) {
        return (
            <div className="searchResultsList">
                <h3 className="emptySearchResults">No Results Found</h3>
            </div>
        );
    }

    // create all React Components for each result that is found. This one finds the tracks. 
    // NEED TO IMPLEMENT SEARCH OF ALL TYPES (ALBUMS, ARTISTS only section)
    const resultNodes = props.results.items.map(function (result) {
        let allArtists = "";
        // combine all the artists into one string for placement in the artist h5
        for (let i = 0; i < result.artists.length; i++) {
            if (i === result.artists.length - 1) {
                allArtists += result.artists[i].name;
                break;
            }
            allArtists += result.artists[i].name + " & ";
        }
        return (
            <div id="resultForm" key={result.id} className="resultForm">
                    <img src={result.album.images[2].url} className="resultPicture" id="resultImage" />
                <div className="songInfo">
                    <div className="wordContainer">
                        <h5 id="resultTitle" className="resultInfo">{result.name}</h5>
                    </div>
                    <div className="wordContainer">
                        <h5 id="resultArtist" className="resultInfo">{allArtists}</h5>
                    </div>
                    <div className="wordContainer">
                        <h5 id="resultAlbum" className="resultInfo">{result.album.name}</h5>
                    </div>
                </div>
                <div className="spotifyInfo">
                    <a href={result.href} id="resultLink" className="resultInfo">Link</a>
                    <input className="resultSubmit" type="submit" value="+" />
                </div>
            </div>
        );
    });
    return (
        <div className="searchResultsList">
            {resultNodes}
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
};


const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();

});