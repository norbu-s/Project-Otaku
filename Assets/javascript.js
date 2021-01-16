var storedSearches = [];

var searchInputEl = $("#zipcode");
var searchBtn = $("#search-btn");
var searchHistoryList = $("#search-history-list");
var resultsDiv = $("#results");

initialise();

function renderSearchHistory() {
    searchHistoryList.empty();

    for (var i = 0; i < storedSearches.length; i++) {
        var storedLocationBtn = $("<button>" + storedSearches[i] + "</button>");
        storedLocationBtn.attr("class", "history-btn");
        searchHistoryList.append(storedLocationBtn);
    }
}

function initialise() {
    var updatedStoredSearches = JSON.parse(localStorage.getItem("storedSearches"));
    if (updatedStoredSearches !== null) {
        storedSearches = updatedStoredSearches;
    }

    renderSearchHistory();
}

function storeSearches() {
    localStorage.setItem("storedSearches", JSON.stringify(storedSearches));
}

searchBtn.on("click", function(event) {
    event.preventDefault();

    var searchInput = $("#zipcode").val();

    $.ajax({
        headers: {"user-key": "9a1b7bbdae3e31891d3b697bed7433bc"},
        url: "https://developers.zomato.com/api/v2.1/locations?query=" + searchInput,
        method: "GET",
        error: function() {
            alert("Sorry, there was an error loading the data.");
            return;
        },
        success: function(response) {
            console.log(response) 
            var locationName = response.location_suggestions[0].title.slice(0, response.location_suggestions[0].title.indexOf(","));

            for (var i = 0; i < storedSearches.length; i++) {
                if (storedSearches[i].toLowerCase() === searchInput.toLowerCase()) {
                    storedSearches.splice(i, 1);
                }
                if (storedSearches.length > 4) {
                    storedSearches.splice(0, 1);
                }
            }
            storedSearches.push(locationName);
            storeSearches();
            renderSearchHistory();

            var entityId = response.location_suggestions[0].entity_id;
            var entityType = response.location_suggestions[0].entity_type;
    
            /*
                NOTE: 
                - US zipcode via location API 
                - How it works: grabs the input value and finds the zipcode for that location
                - If the location input is a city, not a suburb, this API will return multiple zipcodes 
            */
            // $.ajax({
            //     url: "https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=" + searchInput,
            //     method: "GET",
            //     error: function() {
            //         alert("Sorry, there was an error loading the data.");
            //         return;
            //     },
            //     success: function(response) {
            //         console.log(response);
                    /*
                        NOTE:
                        - US covid cases API
                        - How it works: insert zipcode into the query URL and it provides the total cases in the county that zipcode is in 
                        - Only gives total cases, not current (recovered count is always null)
                    */
                    // var zipcode = response.records[0].fields.zip;
                    // var queryURL = "https://cors-anywhere.herokuapp.com/https://localcoviddata.com/covid19/v1/locations?zipCode=" + zipcode;    

                    // $.ajax({ 
                    //     url: queryURL,
                    //     method: "GET"
                    // }).then(function(response) {
                    //     console.log(response);
                    //     console.log(response.counties[0].positiveCt);
                    // })

                    /*
                        NOTE:
                        - US population via zipcode API 
                        - Some zipcodes don't return any information 
                    */
                    // $.ajax({
                    //     url: "https://cors-anywhere.herokuapp.com/https://api.census.gov/data/2018/acs/acs5?key=35c1cd1a4206a49849c0f9763eb17e0edf0bb6c9&get=B01003_001E&for=zip%20code%20tabulation%20area:" + zipcode,
                    //     method: "GET",
                    //     error: function() {
                    //         alert("error");
                    //     },
                    //     success: function(response) {
                    //         console.log(response)
                    //         var zipPopulation = response[1][0];
                    //         console.log(zipPopulation);
                    //     }
                    // })
            //     }
            // })

            $.ajax({
                headers: {
                    "Accept": "application/json",
                    "user-key": "9a1b7bbdae3e31891d3b697bed7433bc"},
                url: "https://developers.zomato.com/api/v2.1/search?entity_id=" + entityId + "&entity_type=" + entityType + "&count=10",
                method: "GET",
                error: function() {
                    alert("Sorry, there was an error loading the data.");
                    return;
                },
                success: function(response) {
                    console.log(response);

                    for (var i = 0; i < response.restaurants.length; i++) {
                        var resultDiv = $("<div>");
                        resultDiv.attr("id", "result-each");

                        var restaurantName = response.restaurants[i].restaurant.name;
                        var restaurantLocation = response.restaurants[i].restaurant.location.address;
                        var restaurantPhoneNo = response.restaurants[i].restaurant.phone_numbers;
                        var averageCostForTwo = response.restaurants[i].restaurant.average_cost_for_two;
                        var cuisine = response.restaurants[i].restaurant.cuisines;

                        var restaurantNameDiv = $("<div>" + restaurantName + "</div>");
                        var cuisineDiv = $("<div>" + cuisine + "Cuisine");
                        var averageCostForTwoDiv = $("<div>" + "Average Cost For Two: $" + averageCostForTwo + "</div>");
                        var restaurantLocationDiv = $("<div>" + restaurantLocation + "</div>");
                        var restaurantPhoneNoDiv = $("<div>" + restaurantPhoneNo + "</div>");

                        resultDiv.append(restaurantNameDiv, cuisineDiv, averageCostForTwoDiv, restaurantLocationDiv, restaurantPhoneNoDiv);
                        resultsDiv.append(resultDiv);
                    }
                }
            })
        }
    })

    searchInputEl.val("");
})