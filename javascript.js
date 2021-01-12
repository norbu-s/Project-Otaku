var searchInputEl = document.getElementById("zipcode");
var searchBtn = document.getElementById("search-btn");
var searchHistoryList = document.getElementById("search-history-list");
var resultsDiv = document.getElementById("results");

$.ajax({
    headers: {"user-key": "9a1b7bbdae3e31891d3b697bed7433bc"},
    url: "https://developers.zomato.com/api/v2.1/locations?query=Los+Angeles",
    method: "GET",
    error: function() {
        alert("Sorry, there was an error loading the data.");
        return;
    },
    success: function(response) {
        console.log(response);
    }
})

$.ajax({
    headers: {
        "Accept": "application/json",
        "user-key": "9a1b7bbdae3e31891d3b697bed7433bc"},
    url: "https://developers.zomato.com/api/v2.1/location_details?entity_id=98083&entity_type=subzone",
    method: "GET",
    error: function() {
        alert("Sorry, there was an error loading the data.");
        return;
    },
    success: function(response) {
        console.log(response);
    }
})