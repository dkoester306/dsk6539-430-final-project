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

// When clicking on a playlist div,
// it will read the title of it and change the page for the playlist
// Will display the playlist entryies inside of the playlist
const displayPlaylistContent = (e) => {
    e.preventDefault();

};

const handleRefreshToken = (e) => {
    e.preventDefault();


    //console.log($("#searchForm").serialize());
    sendAjax('POST', '/refreshToken', $("#searchForm").serialize(), function (data) {
        //console.log("Refresh Token as been updated in your account.");

    });
    return false;
};

const handleNewPlaylist = (e) => {
    e.preventDefault();



    sendAjax('POST', '/addPlaylist', $("#searchForm").serialize(), function (data) {
        //console.log(data);
        loadPlaylistsFromServer(data);
    });
    return false;
};

// should only run if the user has currently selected a playlist
// (A user must click playlistDiv and have it opened in the panel in order for results to be added)
// 
const handleAddResultToPlaylist = (e, newData) => {
    e.preventDefault();

    const string = "&title=" + newData.title + "&artist=" + newData.artist + "&album=" + newData.album + "&link=" + newData.link + "&image=" + newData.image;
    const trim = string.split(' ').join('+');

    console.log($('#playlistEntriesList').serialize() + trim);
    

    sendAjax('POST', '/addEntry', $('#playlistEntriesList').serialize() + trim, function (data) {
        //console.log("HERE");
        loadPlaylistEntries(data);
    });
}

// will change the currentPlaylist part of the document inside the current account.
// Will not change anything if the current playlist for the account is the same as the sent data ()
const handleChangeCurrentPlaylist = (e, pName) => {
    e.preventDefault();

    let replaced = pName.split(' ').join('+');
    const newData = $('#playlistResultsList').serialize() + "&playlistName=" + replaced;
    //console.log($('#playlistResultsList').serialize());

    sendAjax('POST', '/changePlaylist', newData, function (data) {
        // load new page with entries inside
        //console.log(data);
        loadPlaylistEntries(data);
    });
    return false;
};


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


// displays all the contents of a particular playlist
const PlaylistEntriesWindow = (props) => {
    if (props.data.tracks.length === 0) {
        return (
            <form className="searchResultsList" id="playlistEntriesList">
                <input type="hidden" name="_csrf" value={props.data._csrf} />
                <h3 className="emptySearchResults">No Contents in Playlist</h3>
            </form>
        );
    }
    const entriesNodes = props.data.tracks.map(function (entry) {
        console.log(entry.title);
        return (
            <div id="entryForm" className="resultForm">
                <a href={entry.link}>
                    <img src={entry.img} className="resultPicture" id="entryImage" />
                </a>
                <div className="songInfo">
                    <div className="wordContainer">
                        <h5 id="entryTitle" className="resultInfo">{entry.title}</h5>
                    </div>
                    <div className="wordContainer">
                        <h5 id="entryArtist" className="resultInfo">{entry.artist}</h5>
                    </div>
                    <div className="wordContainer">
                        <h5 id="entryAlbum" className="resultInfo">{entry.album}</h5>
                    </div>
                </div>
            </div>
        );

    });
    return (
        <form className="searchResultsList" id="playlistEntriesList">
            <h4 id="playlistName">{props.data.playlistName}</h4>
            <input type="hidden" name="_csrf" value={props.data._csrf} />
            {entriesNodes}
        </form>
    );
};

// displays the window showing All PLAYLISTS
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
            <div className="playlistWrapper">
                <button className="playlistTitleButton" onClick={(e) => handleChangeCurrentPlaylist(e, playlist.name)} value={playlist.name}>{playlist.name}</button>
            </div>
        );
    });
    return (
        <form id="playlistResultsList">
            <input type="hidden" name="_csrf" value={props.csrf} />
            {playlistNodes}
        </form>
    );
}

// Displays the search results when using the Song Search
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
                    <button className="resultSubmit" onClick={(e) => handleAddResultToPlaylist(e, { title: result.name, artist: allArtists, album: result.album.name, link: result.external_urls.spotify, image: result.album.images[2].url })}>+</button>
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



const loadPlaylistEntries = (newData) => {
    $.ajax({
        type: 'GET',
        url: '/getOnePlaylist',
        data: {
            "playlistName": newData.playlistName,
            "csrf": newData._csrf,
        },
        success: function (data) {
            //console.log(data);
            ReactDOM.render(
                <PlaylistEntriesWindow csrf={data.csrf} entries={data.playlist.tracks} newData={newData} data={data} />,
                document.querySelector('#playlistDiv')
            );
        },
        error: function (xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        },

    });

};



const loadPlaylistsFromServer = (csrf) => {
    sendAjax('GET', '/getPlaylists', null, (data) => {
        ReactDOM.render(
            <PlaylistWindow playlists={data.playlists} csrf={csrf} />,
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
            //console.log("IN setup");
            loadPlaylistsFromServer(csrf);
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