var searchInputEl = $("#zipcode");
var searchBtn = $("#search-btn");
var searchHistoryList = $("#search-history-list");
var resultsDiv = $("#results");

searchBtn.on("click", function(event) {
    event.preventDefault();

    var searchInput = $("#zipcode").val();

    // $.ajax({
    //     url: "https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest",
    //     method: "GET"
    // }).then(function(response) {
    //     console.log(response);
    // })
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
            var entityId = response.location_suggestions[0].entity_id;
            var entityType = response.location_suggestions[0].entity_type;
    
            $.ajax({
                url: "https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=" + searchInput,
                method: "GET",
                error: function() {
                    alert("Sorry, there was an error loading the data.");
                    return;
                },
                success: function(response) {
                    console.log(response);
                    var zipcode = response.records[0].fields.zip;
                    var queryURL = "https://cors-anywhere.herokuapp.com/https://localcoviddata.com/covid19/v1/locations?zipCode=" + zipcode;    

                    $.ajax({ 
                        url: queryURL,
                        method: "GET"
                    }).then(function(response) {
                        console.log(response);
                    });
                }
            })

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

            // $.ajax({
            //     headers: {"user-key": "9a1b7bbdae3e31891d3b697bed7433bc"},
            //     url: "https://developers.zomato.com/api/v2.1/geocode?lat=" + latitude + "&lon=" + longitude,
            //     method: "GET",
            //     error: function() {
            //         alert("Sorry, there was an error loading the data.");
            //         return;
            //     },
            //     success: function(response) {}
            // })

        }
    })
})

