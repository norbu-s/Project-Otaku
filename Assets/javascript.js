var storedSearches = [];
var storedFaves = [];

var searchInputEl = $("#zipcode");
var searchBtn = $("#search-btn");
var favesList = $("#faves-list");
var searchHistoryList = $("#search-history-list");
var resultsDiv = $("#results");

// render the stored items
initialise();

function renderSearchHistory() {
    searchHistoryList.empty();

    for (var i = 0; i < storedSearches.length; i++) {
        var storedLocationBtn = $("<button>" + storedSearches[i] + "</button>");
        storedLocationBtn.attr("class", "history-btn");
        searchHistoryList.prepend(storedLocationBtn);
    }
}

function renderFavouritesList() {
    favesList.empty();

    for (var i = 0; i < storedFaves.length; i++) {
        var storedFaveLi = $("<li>");
        storedFaveLi.attr("class", "fav-list")
        var storedFaveBtn = $(`<a 
        href="fave-restaurants.html"
        class="button fave-btn" 
        data-name="${storedFaves[i].name}"
        data-cost="${storedFaves[i].cost}"
        data-location="${storedFaves[i].location}"
        data-phone="${storedFaves[i].phone}"
        data-cuisine="${storedFaves[i].cuisine}"
        data-id="${storedFaves[i].id}"
        >` + storedFaves[i].name+ `</a>`);;
        var removeFaveBtn = $("<button id=" + storedFaves[i].id + " class=\"remove-fave-btn\">X</i></button");
        storedFaveLi.append(storedFaveBtn, removeFaveBtn);

        favesList.prepend(storedFaveLi);
    }
}

function initialise() {
    var updatedStoredSearches = JSON.parse(localStorage.getItem("storedSearches"));
    if (updatedStoredSearches !== null) {
        storedSearches = updatedStoredSearches;
    }

    var updatedStoredFaves = JSON.parse(localStorage.getItem("storedFaves"));
    if (updatedStoredFaves !== null) {
        storedFaves = updatedStoredFaves;
    }
    renderSearchHistory();
    renderFavouritesList();
;}

// store searches/favourites
function storeSearches() {
    localStorage.setItem("storedSearches", JSON.stringify(storedSearches));
}

function storeFaves() {
    localStorage.setItem("storedFaves", JSON.stringify(storedFaves));
}

// hide/show clear search history btn depending on if there is anything in the list 
if (storedSearches === []) {
    $("#clear-search-btn").addClass("hide");
} else {
    $("#clear-search-btn").removeClass("hide");
}

// search button click event 
searchBtn.on("click", function(event) {
    event.preventDefault();

    resultsDiv.empty();
    var searchInput = $("#zipcode").val();

    if (searchInput === "") {
        console.log("no input");
        return;
    }

    // Zomato location API call 
    /*
        Country data available: 
        - India
        - Australia
        - Brazil
        - Canada
        - Indonesia
        - New Zealand
        - Phillipines
        - Qatar
        - Singapore
        - South Africa
        - Sri Lanka
        - Turkey
        - UAE
        - UK
        - US
    */
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
                if (storedSearches[i] === locationName) {
                    storedSearches.splice(i, 1);
                }
            }
            storedSearches.push(locationName);
            if (storedSearches.length > 5) {
                storedSearches.splice(0, 1);
            }
            storeSearches();
            renderSearchHistory();
            if ($("#clear-search-btn").attr("class") === "hide") {
                $("#clear-search-btn").removeClass("hide");
            }

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

            // Zomato restaurant search API call
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
                        var restaurantId = response.restaurants[i].restaurant.id;

                        var restaurantNameDiv = $("<div>" + restaurantName + "</div>");
                        var cuisineDiv = $("<div>" + cuisine + "Cuisine");
                        var averageCostForTwoDiv = $("<div>" + "Average Cost For Two: $" + averageCostForTwo + "</div>");
                        var restaurantLocationDiv = $("<div>" + restaurantLocation + "</div>");
                        var restaurantPhoneNoDiv = $("<div>" + restaurantPhoneNo + "</div>");

                        // var faveBtn = $(`<button class="faveButton">Add to Favorite</button>`);
                        var faveBtn = $(`<button 
                        class="add-fave-btn" 
                        data-name="${restaurantName}"
                        data-cost="${averageCostForTwo}"
                        data-location="${restaurantLocation}"
                        data-phone="${restaurantPhoneNo}"
                        data-cuisine="${cuisine}"
                        data-id="${restaurantId}"
                        >Add to Favorite</button>`);;

                        faveBtn.click((event) =>{
                            var dataset = event.target.dataset;
                            var faveList = {"name": dataset.name, "cost": dataset.cost, "location": dataset.location, "phone": dataset.phone, "cuisine": dataset.cuisine, "id": dataset.id};
                            
                            for (var i = 0; i < storedFaves.length; i++) {
                                if (storedFaves[i].name === faveList.name) {
                                    storedFaves.splice(i, 1);
                                }
                            }
                            storedFaves.push(faveList);

                            if (storedFaves.length > 4) {
                                storedFaves.splice(0, 1);
                            }

                            storeFaves();
                            renderFavouritesList();
                        });
                        

                        resultDiv.append(restaurantNameDiv, cuisineDiv, averageCostForTwoDiv, restaurantLocationDiv, restaurantPhoneNoDiv, faveBtn);
                        resultsDiv.append(resultDiv);

                    }
                }
            })
        }
    })

    searchInputEl.val("");
})

// get API data on search history button click
searchHistoryList.on("click", function(event) {
    if (event.target.classList.contains("history-btn")) {
        resultsDiv.empty();
        // Zomato location API call
        var buttonName = event.target.textContent;

        $.ajax({
            headers: {"user-key": "9a1b7bbdae3e31891d3b697bed7433bc"},
            url: "https://developers.zomato.com/api/v2.1/locations?query=" + buttonName,
            method: "GET",
            error: function() {
                alert("Sorry, there was an error loading the data.");
                return;
            },
            success: function(response) {
                var entityId = response.location_suggestions[0].entity_id;
                var entityType = response.location_suggestions[0].entity_type;

                // Zomato restaurant search API call
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
                        console.log(response)
                        for (var i = 0; i < response.restaurants.length; i++) {
                            var resultDiv = $("<div>");
                            resultDiv.attr("id", "result-each");

                            var restaurantName = response.restaurants[i].restaurant.name;
                            var restaurantLocation = response.restaurants[i].restaurant.location.address;
                            var restaurantPhoneNo = response.restaurants[i].restaurant.phone_numbers;
                            var averageCostForTwo = response.restaurants[i].restaurant.average_cost_for_two;
                            var cuisine = response.restaurants[i].restaurant.cuisines;
                            var restaurantId = response.restaurants[i].restaurant.id;

                            var restaurantNameDiv = $("<div>" + restaurantName + "</div>");
                            var cuisineDiv = $("<div>" + cuisine + "Cuisine");
                            var averageCostForTwoDiv = $("<div>" + "Average Cost For Two: $" + averageCostForTwo + "</div>");
                            var restaurantLocationDiv = $("<div>" + restaurantLocation + "</div>");
                            var restaurantPhoneNoDiv = $("<div>" + restaurantPhoneNo + "</div>");
                            
                            var faveBtn = $(`<button 
                            class="add-fave-btn" 
                            data-name="${restaurantName}"
                            data-cost="${averageCostForTwo}"
                            data-location="${restaurantLocation}"
                            data-phone="${restaurantPhoneNo}"
                            data-cuisine="${cuisine}"
                            data-id="${restaurantId}"
                            >Add to Favorite</button>`);;

                            faveBtn.click((event) =>{
                                var dataset = event.target.dataset;
                                var faveList = {"name": dataset.name, "cost": dataset.cost, "location": dataset.location, "phone": dataset.phone, "cuisine": dataset.cuisine, "id": dataset.id};
                                
                                for (var i = 0; i < storedFaves.length; i++) {
                                    if (storedFaves[i].name === faveList.name) {
                                        storedFaves.splice(i, 1);
                                    }
                                }
                                storedFaves.push(faveList);

                                if (storedFaves.length > 4) {
                                    storedFaves.splice(0, 1);
                                }

                                storeFaves();
                                renderFavouritesList();
                            });



                            resultDiv.append(restaurantNameDiv, cuisineDiv, averageCostForTwoDiv, restaurantLocationDiv, restaurantPhoneNoDiv,faveBtn);
                            resultsDiv.append(resultDiv);
                        }
                    }
                })
            }
        })
    }
})
  
// delete favourite item 
favesList.on("click", function(event) {
    if (event.target.classList.contains("remove-fave-btn")) {
        var faveBtnId = event.target.id;
        console.log(faveBtnId)
        for (var i = 0; i < storedFaves.length; i++) {
            if (storedFaves[i].id === faveBtnId) {
                storedFaves.splice(i, 1);
            }
            storeFaves();
        }
        renderFavouritesList();
    }
})

// clear search history list and storage
$("#clear-search-btn").on("click", function() {
    var clearConfirm = confirm("Are you sure you want to clear your search history?");
    if (clearConfirm) {
        localStorage.removeItem("storedSearches");
        searchHistoryList.empty();
        storedSearches = [];
        $("#clear-search-btn").addClass("hide");
    } else {
        return;
    }
})
