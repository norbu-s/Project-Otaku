var queryURL = "https://cors-anywhere.herokuapp.com/https://localcoviddata.com/covid19/v1/locations?zipCode="+searchInputEl;

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
});

