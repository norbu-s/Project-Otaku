var storedImages = [];
initialise();

// functionality for 'upload image' button
var cardNumber = 0;

$(function() {
    $(":file").change(function(e) {
        if (this.files[0].size > 450000) {
            console.log("max file size is 450kb");
            return;
        }

        if (this.files && this.files[0]) {
            cardNumber = e.target.id[e.target.id.length - 1];
        
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
});

function imageIsLoaded(e) {
    $("#uploadImg" + cardNumber).removeAttr("class");
    $("#uploadImg" + cardNumber).attr("src", e.target.result);
    for (var i = 0; i < storedImages.length; i++) {
        if (storedImages[i][0] === cardNumber) {
            storedImages.splice(i, 1);
        }
    }
    storedImages.push([cardNumber, e.target.result]);

    storeImages();
}

// local storage for saved imgs
function renderImages() {
    for (var i = 0; i < storedImages.length; i++) {
        $("#uploadImg" + storedImages[i][0]).attr("src", storedImages[i][1]);
    }
}

function initialise() {
    var savedImages = JSON.parse(localStorage.getItem("storedImages"));
    if (savedImages !== null) {
        storedImages = savedImages;
    }

    renderImages();
}

function storeImages() {
    localStorage.setItem("storedImages", JSON.stringify(storedImages));
}

// Google Maps rendering
var mapBtns = document.querySelectorAll(".map-btn");

document.body.addEventListener("click", function(event) {
    if (event.target.classList.contains("map-btn")) {
        var mapNumber = event.target.id[event.target.id.length - 1];
        var mapFrame = $("#map" + mapNumber);
        mapFrame.attr("src", "https://www.google.com/maps/embed/v1/place?key=AIzaSyBMo1myYnlmnCYMJc5fwiGiDZPqXar03ps&q=Opera+House");
        
        var mapDiv = mapFrame.parent();
        if (event.target.textContent === "View on Map") {
            event.target.textContent = "Hide Map";
            mapDiv.removeClass("hide");
        } else {
            event.target.textContent = "View on Map";
            mapDiv.addClass("hide");
        }
    }
})

// Creating card from local storage information 
var cardCounter = 1;
for (var i = storedSearches.length - 1; i >= 0; i--) {
    var faveCard = $("<div class='fave card'></div>");
    var cardHeadingDiv = $("<div class='fave-name card-divider'>" + storedFaves[i].name + "</div>");
    var viewMapBtn = $("<button id='map-btn" + cardCounter + "' class='map-btn hide'>View on Map</button>");
    var mapDiv = $("<div class='card-section map hide'></div>");
    var mapFrame = $("<iframe id='map" + cardCounter + "' width='100%' height='100%' frameborder='0' style='border:0' src=''></iframe>")
    mapDiv.append(mapFrame);
    var cardImgDiv = $("<div id='img-div" + cardCounter + "' class='card-section img hide'></div>");
    var uploadImgForm = $("<form action='/action_page.php'></form>");
    var uploadImgBtn = $("<input type='file' id='imgInput" + cardCounter + "' accept='image/*'>");
    uploadImgForm.append(uploadImgBtn);
    var img = $("<img id='img" + cardCounter + "' src='#'>");
    cardImgDiv.append(uploadImgForm, img);
    var cardInfo = $("<div id='info" + cardCounter + "' class='card-section info hide'></div>");
    var cuisine = $("<div class='cuisine'><strong>Cuisine: </strong>" + storedFaves[i].cuisine + "</div>");
    var cost = $("<div class='cost'><strong>Average Cost For Two: </strong>" + storedFaves[i].cost + "</div>");
    var location = $("<div class='location'><strong>Address: </strong>" + storedFaves[i].location + "</div>");
    var phone = $("<div class='phone'><strong>Phone: </strong>" + storedFaves[i].phone + "</div>");
    cardInfo.append(cuisine, cost, location, phone);
    var cardNotes = $("<div id='notes" + cardCounter + "' class='card-section notes hide'></div>");
    var noteLabel = $("<label for='note-input" + cardNumber + "'>Notes:</label>");
    var noteTextArea = $("<textarea type='text' id='note-input" + cardNumber + "' placeholder='Personal notes'></textarea>");
    cardNotes.append(noteLabel, noteTextArea);
    faveCard.append(cardHeadingDiv, viewMapBtn, mapDiv, cardImgDiv, cardInfo, cardNotes);

    $(".cell").append(faveCard);
}

// Expanding and minimising card
var cardStatus = "closed";
$(".card-divider").on("click", function(event) {
    var cardNumber = event.target.id[event.target.id.length - 1];
    if (cardStatus === "closed") {
        cardStatus = "opened";
        $("#map-btn" + cardNumber).removeClass("hide");
        $("#map-btn" + cardNumber).text("View on Map");
        $("#img" + cardNumber).removeClass("hide");
        $("#info" + cardNumber).removeClass("hide");
        $("#notes" + cardNumber).removeClass("hide");
    } else {
        cardStatus = "closed";
        $("#map-btn" + cardNumber).addClass("hide");
        $("#map" + cardNumber).parent().addClass("hide");
        $("#img" + cardNumber).addClass("hide");
        $("#info" + cardNumber).addClass("hide");
        $("#notes" + cardNumber).addClass("hide");
    }
})