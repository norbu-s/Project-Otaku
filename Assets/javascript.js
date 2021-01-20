var storedSearches = [];
var storedFaves = [];

var searchInputEl = $("#zipcode");
var searchBtn = $("#search-btn");
var favesList = $("#faves-list");
var searchHistoryList = $("#search-history-list");
var resultsDiv = $("#results");

var locationErrorModal = new Foundation.Reveal($("#error-modal"));
var apiErrorModal = new Foundation.Reveal($("#error-modal2"));
var clearSearchConfirmModal = new Foundation.Reveal($("#error-modal3"));
var numberInputModal = new Foundation.Reveal($("#error-modal4"));

// render the stored search history and favourites list 
initialise();

// if there are no items in storedSearches, display message
if (storedSearches.length < 1) {
    welcomeMessage();
    $("#nearest-restaurant").addClass("hide");
    $("#page-of").addClass("hide");
    $("#page-btn-div").addClass("hide");
}

function welcomeMessage() {
    var welcomeDiv = $("<div class='welcome-div'></div>");
    var welcomeHeading = $("<h1 class='welcome-heading'>Welcome to Restaurant Otaku!</h1>");
    var welcomeMsg = $("<ol class='welcome-ol'><li><p>Use the searchbar on the left to search a suburb or city for restaurants</p></li><li><p>Click on the <strong>'Add to Favourite'</strong> button on any search result to add it to your favourites list</p></li><li><p>Navigate to the <strong>'Favourites'</strong> page to personalise your favourite cards with images and notes</p></li></ol>")
   
    welcomeDiv.append(welcomeHeading, welcomeMsg);
    resultsDiv.append(welcomeDiv);
}

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
        id="divid-${storedFaves[i].id}" 
        href="fave-restaurants.html"
        class="button fave-btn" 
        data-name="${storedFaves[i].name}"
        data-cost="${storedFaves[i].cost}"
        data-location="${storedFaves[i].location}"
        data-phone="${storedFaves[i].phone}"
        data-cuisine="${storedFaves[i].cuisine}"
        data-id="${storedFaves[i].id}"
        >` + storedFaves[i].name + `</a>`);;
        var removeFaveBtn = $("<button id='btnid-" + storedFaves[i].id + "' class='remove-fave-btn'>&times;</i></button");
        storedFaveLi.append(storedFaveBtn, removeFaveBtn);

        favesList.prepend(storedFaveLi);

        removeFaveBtn.outerHeight(storedFaveBtn.outerHeight());
        
    }
}

$(window).on("resize", function() {
    var faveIds = [];
    for (var i = 0; i < storedFaves.length; i++) {
        faveIds.push([$("#divid-" + storedFaves[i].id), $("#btnid-" + storedFaves[i].id)]);
    }

    for (var i = 0; i < faveIds.length; i++) {
        var faveBtnHeight = faveIds[i][0].outerHeight();
        var removeFaveBtn = faveIds[i][1];
        removeFaveBtn.outerHeight(faveBtnHeight);
    }
})

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
}

// store searches/favourites
function storeSearches() {
    localStorage.setItem("storedSearches", JSON.stringify(storedSearches));
}

function storeFaves() {
    localStorage.setItem("storedFaves", JSON.stringify(storedFaves));
}

// hide/show clear search history btn depending on if there is anything in the list 
if (storedSearches.length === 0) {
    $("#clear-search-btn").addClass("hide");
} else {
    $("#clear-search-btn").removeClass("hide");
}
function checkIfRestaurantIsInFavourite(restaurantId){
    let found = storedFaves.find(function (favItem) {
        return favItem.id === restaurantId;
    })
    return found !== undefined;
}

function createFaveBtn(restaurant) {

    let buttonContent = 'Add to Favourite';
    if (checkIfRestaurantIsInFavourite(restaurant.id)){
        buttonContent = 'Added';     
    }

    var faveBtn = $(`<button 
                        class="add-fave-btn" 
                        id="id-${restaurant.id}"
                        data-name="${restaurant.name}"
                        data-cost="${restaurant.average_cost_for_two}"
                        data-location="${restaurant.location.address}"
                        data-phone="${restaurant.phone_numbers}"
                        data-cuisine="${restaurant.cuisines}"
                        data-id="${restaurant.id}"
                        >${buttonContent}</button>`);
                       

    faveBtn.click((event) => {
        var btnText = event.target.textContent;
        var dataset = event.target.dataset;
        var faveList = { "name": dataset.name, "cost": dataset.cost, "location": dataset.location, "phone": dataset.phone, "cuisine": dataset.cuisine, "id": dataset.id, "image": []};

        if (btnText === "Add to Favourite") {
            for (var i = 0; i < storedFaves.length; i++) {
                if (storedFaves[i].location === faveList.location) {
                    storedFaves.splice(i, 1);
                }
            }
            storedFaves.push(faveList);
    
            if (storedFaves.length > 4) {
                console.log(storedFaves[0].id)
                $("#id-" + storedFaves[0].id).text("Add to Favourite");
                storedFaves.splice(0, 1);
            }
            event.target.textContent = "Added";

        } else {
            for (var i = 0; i < storedFaves.length; i++) {
                if (event.target.id === "id-" + storedFaves[i].id) {
                    storedFaves.splice(i, 1);
                };
            }
            event.target.textContent = "Add to Favourite";
        }

        storeFaves();
        renderFavouritesList();
    });

    return faveBtn;
};

if (storedSearches.length > 0) {
    renderLastSearched();
}

// API call for last searched location 
function renderLastSearched() {
    $.ajax({
        headers: { "user-key": "9a1b7bbdae3e31891d3b697bed7433bc" },
        url: "https://developers.zomato.com/api/v2.1/locations?query=" + storedSearches[storedSearches.length - 1],
        method: "GET",
        error: function() {
            apiErrorModal.open();
            return;
        },
        success: function(response) {
            console.log(response) 
            if (response.location_suggestions.length === 0) {
                locationErrorModal.open();
                return;
            }

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

            // Zomato restaurant search API call
            $.ajax({
                headers: {
                    "Accept": "application/json",
                    "user-key": "9a1b7bbdae3e31891d3b697bed7433bc"
                },
                url: "https://developers.zomato.com/api/v2.1/search?entity_id=" + entityId + "&entity_type=" + entityType + "&count=20",
                method: "GET",
                error: function() {
                    apiErrorModal.open();
                    return;
                },
                success: function (response) {
                    console.log(response);
                    var resultContainer1 = $("<div id='result-container1'></div>");
                    var resultContainer2 = $("<div id='result-container2'></div>")
                    resultContainer2.addClass("hide");

                    for (var i = 0; i < response.restaurants.length; i++) {
                        var resultDiv = $("<div>");
                        resultDiv.attr("class", "result-each");
                        const restaurant = response.restaurants[i].restaurant;

                        var restaurantName = response.restaurants[i].restaurant.name;
                        var restaurantLocation = response.restaurants[i].restaurant.location.address;
                        var restaurantPhoneNo = response.restaurants[i].restaurant.phone_numbers;
                        var averageCostForTwo = response.restaurants[i].restaurant.average_cost_for_two;
                        var cuisine = response.restaurants[i].restaurant.cuisines;
                        var restaurantId = response.restaurants[i].restaurant.id;

                        var restaurantNameDiv = $("<div class='restaurant-name'>" + restaurantName + "</div>");
                        var cuisineDiv = $("<div>" + cuisine + "Cuisine");
                        var averageCostForTwoDiv = $("<div>" + "Average Cost For Two: $" + averageCostForTwo + "</div>");
                        var restaurantLocationDiv = $("<div>" + restaurantLocation + "</div>");
                        var restaurantPhoneNoDiv = $("<div>" + restaurantPhoneNo + "</div>");

                        const faveBtn = createFaveBtn(restaurant);
                        resultDiv.append(restaurantNameDiv, cuisineDiv, averageCostForTwoDiv, restaurantLocationDiv, restaurantPhoneNoDiv, faveBtn);

                        if (i < 10) {
                            resultContainer1.append(resultDiv);
                        } else {
                            resultContainer2.append(resultDiv);
                        }

                    }
                    resultsDiv.append(resultContainer1, resultContainer2);
                    $("#page-no").text("1");
                    $("#page-outof").removeClass("hide");
                    $("#nearest-restaurant").removeClass("hide");
                    $("#page-btn-div").removeClass("hide");
                }
            })
        }
    })
}


// search button click event 
searchBtn.on("click", function (event) {
    event.preventDefault();

    resultsDiv.empty();
    var searchInput = $("#zipcode").val();
    
    var nums = "0123456789";

    if (searchInput === "") {
        return;
    } else if (nums.includes(searchInput[0])) {
        numberInputModal.open()
        searchInputEl.val("");
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
        headers: { "user-key": "9a1b7bbdae3e31891d3b697bed7433bc" },
        url: "https://developers.zomato.com/api/v2.1/locations?query=" + searchInput,
        method: "GET",
        error: function() {
            apiErrorModal.open();
            return;
        },
        success: function(response) {
            console.log(response) 
            if (response.location_suggestions.length === 0) {
                locationErrorModal.open();
                return;
            }

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

            // Zomato restaurant search API call
            $.ajax({
                headers: {
                    "Accept": "application/json",
                    "user-key": "9a1b7bbdae3e31891d3b697bed7433bc"
                },
                url: "https://developers.zomato.com/api/v2.1/search?entity_id=" + entityId + "&entity_type=" + entityType + "&count=20",
                method: "GET",
                error: function() {
                    apiErrorModal.open();
                    return;
                },
                success: function (response) {
                    console.log(response);
                    var resultContainer1 = $("<div id='result-container1'></div>");
                    var resultContainer2 = $("<div id='result-container2'></div>")
                    resultContainer2.addClass("hide");

                    for (var i = 0; i < response.restaurants.length; i++) {
                        var resultDiv = $("<div>");
                        resultDiv.attr("class", "result-each");
                        const restaurant = response.restaurants[i].restaurant;

                        var restaurantName = response.restaurants[i].restaurant.name;
                        var restaurantLocation = response.restaurants[i].restaurant.location.address;
                        var restaurantPhoneNo = response.restaurants[i].restaurant.phone_numbers;
                        var averageCostForTwo = response.restaurants[i].restaurant.average_cost_for_two;
                        var cuisine = response.restaurants[i].restaurant.cuisines;
                        var restaurantId = response.restaurants[i].restaurant.id;

                        var restaurantNameDiv = $("<div>" + restaurantName + "</div>");
                        restaurantNameDiv.attr("class","restaurant-name" );
                        var cuisineDiv = $("<div>" + cuisine + "Cuisine");
                        var averageCostForTwoDiv = $("<div>" + "Average Cost For Two: $" + averageCostForTwo + "</div>");
                        var restaurantLocationDiv = $("<div>" + restaurantLocation + "</div>");
                        var restaurantPhoneNoDiv = $("<div>" + restaurantPhoneNo + "</div>");

                        const faveBtn = createFaveBtn(restaurant);
                        resultDiv.append(restaurantNameDiv, cuisineDiv, averageCostForTwoDiv, restaurantLocationDiv, restaurantPhoneNoDiv, faveBtn);

                        if (i < 10) {
                            resultContainer1.append(resultDiv);
                        } else {
                            resultContainer2.append(resultDiv);
                        }

                    }
                    resultsDiv.append(resultContainer1, resultContainer2);
                    $("#page-no").text("1");
                    $("#page-outof").removeClass("hide");
                    $("#nearest-restaurant").removeClass("hide");
                    $("#page-btn-div").removeClass("hide");
                }
            })
        }
    })

    searchInputEl.val("");
})

// get API data on search history button click
searchHistoryList.on("click", function (event) {
    if (event.target.classList.contains("history-btn")) {
        resultsDiv.empty();
        // Zomato location API call
        var buttonName = event.target.textContent;

        $.ajax({
            headers: { "user-key": "9a1b7bbdae3e31891d3b697bed7433bc" },
            url: "https://developers.zomato.com/api/v2.1/locations?query=" + buttonName,
            method: "GET",
            error: function() {
                apiErrorModal.open();
                return;
            },
            success: function (response) {
                storedSearches.splice(storedSearches.indexOf(buttonName), 1);
                storedSearches.push(buttonName);

                storeSearches();
                renderSearchHistory();

                var entityId = response.location_suggestions[0].entity_id;
                var entityType = response.location_suggestions[0].entity_type;

                // Zomato restaurant search API call
                $.ajax({
                    headers: {
                        "Accept": "application/json",
                        "user-key": "9a1b7bbdae3e31891d3b697bed7433bc"
                    },
                    url: "https://developers.zomato.com/api/v2.1/search?entity_id=" + entityId + "&entity_type=" + entityType + "&count=20",
                    method: "GET",
                    error: function() {
                        apiErrorModal.open();
                        return;
                    },
                    success: function (response) {
                        console.log(response)
                        var resultContainer1 = $("<div id='result-container1'></div>");
                        var resultContainer2 = $("<div id='result-container2'></div>")
                        resultContainer2.addClass("hide");

                        for (var i = 0; i < response.restaurants.length; i++) {
                            var resultDiv = $("<div>");
                            resultDiv.attr("class", "result-each");
                            const restaurant = response.restaurants[i].restaurant;

                            var restaurantName = response.restaurants[i].restaurant.name;
                            
                            var restaurantLocation = response.restaurants[i].restaurant.location.address;
                            var restaurantPhoneNo = response.restaurants[i].restaurant.phone_numbers;
                            var averageCostForTwo = response.restaurants[i].restaurant.average_cost_for_two;
                            var cuisine = response.restaurants[i].restaurant.cuisines;
                            var restaurantId = response.restaurants[i].restaurant.id;

                            var restaurantNameDiv = $("<div>" + restaurantName + "</div>");
                            restaurantNameDiv.attr("class","restaurant-name" );
                            var cuisineDiv = $("<div>" + cuisine + "Cuisine");
                            var averageCostForTwoDiv = $("<div>" + "Average Cost For Two: $" + averageCostForTwo + "</div>");
                            var restaurantLocationDiv = $("<div>" + restaurantLocation + "</div>");
                            var restaurantPhoneNoDiv = $("<div>" + restaurantPhoneNo + "</div>");

                            const faveBtn = createFaveBtn(restaurant);
                            resultDiv.append(restaurantNameDiv, cuisineDiv, averageCostForTwoDiv, restaurantLocationDiv, restaurantPhoneNoDiv, faveBtn);

                            if (i < 10) {
                                resultContainer1.append(resultDiv);
                            } else {
                                resultContainer2.append(resultDiv);
                            }

                        }
                        resultsDiv.append(resultContainer1, resultContainer2);
                        $("#page-no").text("1");
                        $("#page-outof").removeClass("hide");
                        $("#nearest-restaurant").removeClass("hide");
                        $("#page-btn-div").removeClass("hide");
                    }
                })
            }
        })
    }
})

$("#page-btn1").on("click", function() {
    $("#result-container1").removeClass("hide");
    $("#result-container2").addClass("hide");
    $("#page-no").text("1");
    $("#page-outof").removeClass("hide");
})

$("#page-btn2").on("click", function() {
    $("#result-container2").removeClass("hide");
    $("#result-container1").addClass("hide");
    $("#page-no").text("2");
    $("#page-outof").removeClass("hide");
})

// delete favourite item 
favesList.on("click", function (event) {
    if (event.target.classList.contains("remove-fave-btn")) {
        var faveBtnId = event.target.id.substring(6, event.target.id.length);
        var addToFaveBtn = $("#id-" + faveBtnId);
        addToFaveBtn.text("Add to Favourite");
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
    // var clearConfirm = confirm("Are you sure you want to clear your search history?");
    clearSearchConfirmModal.open();

    $("#clear-search-yes").on("click", function() {
        localStorage.removeItem("storedSearches");
        searchHistoryList.empty();
        storedSearches = [];
        $("#clear-search-btn").addClass("hide");
        $(".reveal-overlay").attr("style", "display: none");
    })
    $("#clear-search-no").on("click", function() {
        $(".reveal-overlay").attr("style", "display: none");
    })
    
})

// number input in search 
$("#wrong-input-ok").on("click", function() {
    $(".reveal-overlay").attr("style", "display: none");
})

// grid layout changes on resize
responsiveCells();
$(window).on("resize", function() {
    if ($(window).width() + 14 < 768) {
        $("#search-cell").attr("class", "cell medium-12 large-12");
        $("#result-cell").attr("class", "cell medium-12 large-12");
    } else {
        $("#search-cell").attr("class", "cell medium-4 large-4");
        $("#result-cell").attr("class", "cell medium-5 large-5");
    }
});

function responsiveCells() {
    if ($(window).width() + 16 < 768) {
        $("#search-cell").attr("class", "cell medium-12 large-12");
        $("#result-cell").attr("class", "cell medium-12 large-12");
    } else {
        $("#search-cell").attr("class", "cell medium-4 large-4");
        $("#result-cell").attr("class", "cell medium-5 large-5");
    }
}
