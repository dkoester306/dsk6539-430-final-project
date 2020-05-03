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
            console.log(data.tracks.items);
            loadSearchResults(data);
        },
        error: function (xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
    return false;
}

// When clicking on a playlist div,
// it will read the title of it and change the page for the playlist
// Will display the playlist entryies inside of the playlist
const displayPlaylistContent = (e) => {
    e.preventDefault();

};

const handleRefreshToken = (e) => {
    e.preventDefault();

    sendAjax('POST', '/refreshToken', $("#searchForm").serialize(), function (data) {
        console.log("Refresh Token as been updated in your account.");
        
    });
    return false;
};

const handleNewPlaylist = (e) => {
    e.preventDefault();

    sendAjax('POST', '/addPlaylist', $("#searchForm").serialize(), function (data) {
        console.log("MAKE NEW PLAYLIST");
        loadPlaylistsFromServer();
    });
    return false;
};

// should only run if the user has currently selected a playlist
// (A user must click playlistDiv and have it opened in the panel in order for results to be added)
// 
const handleAddResult = (e) => {
    e.preventDefault();

    
}


const SearchWindow = (props) => {
    return (
        <form id="searchForm" name="searchForm"
            onSubmit={handleSearch}
            action='/searchTerm'
            method='GET'
            className="searchForm"
        >
            <div id="navParent">
                <div className="navContainer">
                    <label htmlFor="q">Song Search </label>
                    <input id="searchName" type="text" name="q" placeholder="Search Term" />
                    <input className="makeSearchSubmit" type="submit" value="Search Term" />
                </div>
                <div id="newPlaylistInput" className="navContainer">
                    <label htmlFor="playlistName">Playlist Name </label>
                    <input id="newPlaylistName" type="text" name="playlistName" placeholder="New Playlist Name" />
                    <button onClick={handleNewPlaylist}>Add Playlist</button>
                </div>
                <div className="navContainer">
                    <button onClick={handleRefreshToken} id="refreshTokenButton">Refresh Token</button>
                </div>
                <div id="logoutDiv" className="navContainer">
                    <a href="/logout" id="logoutButton">Logout</a>
                </div>
                <input type="hidden" name="_csrf" value={props.csrf} />
            </div>
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
                <div id="searchDiv">

                </div>
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

const PlaylistWindow = function (props) {
    if (props.playlists.length === 0) {
        return (
            <div className="searchResultsList">
                <h3 className="emptySearchResults">Include at least 1 character in playlist name field!</h3>
            </div>
        );
    }
    
    const playlistNodes = props.playlists.map(function (playlist) {
        return (
            // If
            <div id="playlistRow" key={playlist.name} className="playlistRow">
                <div class="playlistDiv" onClick={displayPlaylistContent}>
                    <h2 id="playlistTitle" class="playlistDiv">{playlist.name}</h2>
                </div>
            </div>
        );
    });
    return (
        <div className="playlistResultsList">
            {playlistNodes}
      </div>  
    );
}


const SearchResultWindow = function (props) {
    if (!props.results) {
        return (
            <div className="searchResultsList">
                <h3 className="emptySearchResults">Include at least 1 character in search field!</h3>
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
                <a href={result.external_urls.spotify}>
                    <img src={result.album.images[2].url} className="resultPicture" id="resultImage" />
                </a>
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
                    <button className="resultSubmit" onClick={handleAddResult}>+</button>
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



const loadPlaylistsFromServer = () => {
    sendAjax('GET', '/getPlaylists', null, (data) => {
        ReactDOM.render(
            <PlaylistWindow playlists={data.playlists} />,
            document.querySelector("#playlistDiv")
        );
    });
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

    $.ajax({
        type: 'POST',
        data: {
            _csrf: csrf,
        },
        dataType: 'json',
        url: '/makeAccount',
        success: function (data) {
            console.log("IN setup");
            loadPlaylistsFromServer();
        },
    });
};


const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();

});