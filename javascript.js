var searchInputEl = $("#zipcode");
var searchBtn = $("#search-btn");
var searchHistoryList = $("#search-history-list");
var resultsDiv = $("#results");

searchBtn.on("click", function(event) {
    event.preventDefault();
    var searchInput = $("#zipcode").val();
    console.log(searchInput)

    $.ajax({
        headers: {"user-key": "9a1b7bbdae3e31891d3b697bed7433bc"},
        url: "https://developers.zomato.com/api/v2.1/locations?query=" + searchInput,
        method: "GET",
        error: function() {
            alert("Sorry, there was an error loading the data.");
            return;
        },
        success: function(response) {
            var entityId = response.location_suggestions[0].entity_id;
            var entityType = response.location_suggestions[0].entity_type;
    
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
                        var averageCostForTwoDiv = $("<div>" + "Average Cost For Two: " + averageCostForTwo + "</div>");
                        var restaurantLocationDiv = $("<div>" + restaurantLocation + "</div>");
                        var restaurantPhoneNoDiv = $("<div>" + restaurantPhoneNo + "</div>");

                        resultDiv.append(restaurantNameDiv, cuisineDiv, averageCostForTwoDiv, restaurantLocationDiv, restaurantPhoneNoDiv);
                        resultsDiv.append(resultDiv);
                    }
                }
            })
        }
    })
})

