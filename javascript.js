var searchInputEl = $("#zipcode");
var searchBtn = $("#search-btn");
var searchHistoryList = $("#search-history-list");
var resultsDiv = $("#results");

var states =
  {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District Of Columbia': 'DC',
    'Federated States Of Micronesia': 'FM',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Marshall Islands': 'MH',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands': 'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Palau': 'PW',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
  }

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
            var city = response.location_suggestions[0].title.slice(0, response.location_suggestions[0].title.indexOf(","));
            var state = response.location_suggestions[0].title.slice(response.location_suggestions[0].title.indexOf(",") + 2, response.location_suggestions[0].title.length);

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
                    var zipcode = response.restaurants[0].restaurant.location.zipcode;
                    var queryURL = "https://cors-anywhere.herokuapp.com/https://localcoviddata.com/covid19/v1/locations?zipCode=" + zipcode;    

                    $.ajax({ 
                        url: queryURL,
                        method: "GET"
                    }).then(function(response) {
                        console.log(response);
                    });

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

