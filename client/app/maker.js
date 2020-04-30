
const handleSearch = (e) => {
    e.preventDefault();
    
    
    const newData = {term: "?q="+ encodeURIComponent($("#searchName").val()),};
  
    $.ajax({
        type: 'GET',
        url: $("#searchForm").attr("action"),
        data: newData,
        dataType: 'json',
        success: function () {
            console.log("Searched term successfully");
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
            <label htmlFor="q">Search Term: </label>
            <input id="searchName" type="text" name="q" placeholder="Search Term" />
            <input type="hidden" name="_csrf" values={props.csrf} />
            <input className="makeSearchSubmit" type="submit" value="Search Term" />
        </form>
    );
};

const SearchResultsWindow = (props) => {
    return (
        <form id="searchResultForm" name="searchResultName">

        </form>
    )
}

const createSearchWindow = (csrf) => {
    ReactDOM.render(
        <SearchWindow csrf={csrf} />,
        document.querySelector('#searchNav')
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