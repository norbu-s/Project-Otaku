var storedImages = [];
initialise();

// Creating card from local storage information 
var cardCounter = 1;
renderFaveCards();
function renderFaveCards() {
    $(".cell").empty();

    for (var i = storedFaves.length - 1; i >= 0; i--) {
        // Individual card div 
        var faveCard = $("<div class='fave card'></div>");
    
        // Card heading 
        var cardHeadingDiv = $("<div id='divider" + cardCounter + "' class='fave-name card-divider'>" + storedFaves[i].name + "</div>");
    
        // Button section
        var buttonsDiv = $("<div></div>");
        var viewMapBtn = $("<button id='map-btn" + cardCounter + "' class='map-btn'>View on Map</button>");
        var removeCardBtn = $("<button id='remove-fave-btn" + storedFaves[i].id + "' class='remove-fave-btn'>Remove</button>");
        buttonsDiv.append(viewMapBtn, removeCardBtn);
    
        // Map section
        var mapDiv = $("<div class='card-section map hide'></div>");
        var mapFrame = $("<iframe id='map" + cardCounter + "' width='100%' height='100%' frameborder='0' style='border:0' src=''></iframe>")
        mapDiv.append(mapFrame);
        
        // Image section
        var cardImgDiv = $("<div id='img-div" + cardCounter + "' class='card-section img'></div>");
        var uploadImgForm = $("<form action='/action_page.php'></form>");
        var uploadImgBtn = $("<input type='file' id='imgInput" + cardCounter + "' accept='image/*'>");
        uploadImgForm.append(uploadImgBtn);
        var img = $("<img id='img" + cardCounter + "' src='#'>");
        cardImgDiv.append(uploadImgForm, img);
        
        // Info section
        var cardInfo = $("<div id='info" + cardCounter + "' class='card-section info'></div>");
        var cuisine = $("<div class='cuisine'><strong>Cuisine: </strong>" + storedFaves[i].cuisine + "</div>");
        var cost = $("<div class='cost'><strong>Average Cost For Two: </strong>$" + storedFaves[i].cost + "</div>");
        var address = $("<div class='location'><strong>Address: </strong>" + storedFaves[i].location + "</div>");
        var phone = $("<div class='phone'><strong>Phone: </strong>" + storedFaves[i].phone + "</div>");
        cardInfo.append(cuisine, cost, address, phone);
        
        // Notes section
        var cardNotes = $("<div id='notes" + cardCounter + "' class='card-section notes'><strong>Notes:</strong></div>");
        var cardDisplayNote = $("<div class='notes-display' id='displayNote"+[i]+"'></div>");
        var noteLabel = $("<label for='note-input" + cardCounter + "'></label>");
        var noteTextArea = $("<textarea type='text' class='input"+[i]+"' id='note-input" + cardCounter + "' placeholder='Add Personal Notes'></textarea>");
        var submitbutton = $("<button class='note-submit-btn' data-order='"+ [i] +"'>SUBMIT</button>")
        cardNotes.append(cardDisplayNote, noteLabel, noteTextArea, submitbutton);
    
        // Append heading and sections to individual card
        faveCard.append(cardHeadingDiv, buttonsDiv, mapDiv, cardImgDiv, cardInfo, cardNotes);
        
        // Append individual card to <div class="cell">
        $(".cell").append(faveCard);
        cardCounter++;
    
        renderImages();

        $(".remove-fave-btn").on("click", function(event){
            event.preventDefault();
            console.log("yes")
            var btnId = event.target.id.substring(15, event.target.id.length)
            for (var i = 0; i < storedFaves.length; i++) {
                if (storedFaves[i].id === btnId) {
                    storedFaves.splice(i, 1);
                }
            }
            storeFaves();
            renderFaveCards();
            renderNotes();

        })
        
    }
}


$(".note-submit-btn").each(function() {
    $(this).click(function(){
        var target = this.getAttribute("data-order");
        if (storedFaves[target].notes == null) {
            storedFaves[target].notes = [];
        };
        var currentDate = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
        var inputValue = $(".input"+target).val();
        var newArry = new Array(currentDate, inputValue)
        storedFaves[target].notes.push(newArry);
        storeFaves();
        renderNotes();
        $(".input"+target).val("");
    });
});

function renderNotes() {
    var updatedStoredFaves = JSON.parse(localStorage.getItem("storedFaves"));
    if (updatedStoredFaves !== null) {
        storedFaves = updatedStoredFaves;
    }

    $(".notes-display").text('');
    for (i=0; i < updatedStoredFaves.length; i++) {
        if (updatedStoredFaves[i].notes !== undefined) {
            var targetDiv = $("#displayNote"+[i]);
            var noteArry = updatedStoredFaves[i].notes;
            for (n=0; n < noteArry.length; n++) {
                var notesData = noteArry[n];
                    var newDiv = $("<div class='notes-bar'></div>")
                    var newPDate = $("<p class='notes-date'>("+notesData[0]+")</p>");
                    var newP = $("<p class='notes-text'>"+notesData[1]+"</p>");
                    var newDeleteBtn = $("<div class='notes-buttons'><button class='notes-delete-btn' data-target='"+n+"' data-order='"+i+"'>Delete</button></div>");
                    newDiv.append(newPDate, newP, newDeleteBtn);
                targetDiv.append(newDiv);
            }
        };
    };

    $(".notes-delete-btn").on("click", function() {
        event.preventDefault();
        var target = this.getAttribute("data-target");
        var order = this.getAttribute("data-order");

        var updatedStoredFaves = JSON.parse(localStorage.getItem("storedFaves"));
        if (updatedStoredFaves !== null) {
            storedFaves = updatedStoredFaves;
        }
        var targetArry = updatedStoredFaves[order].notes;
        targetArry.splice(target, 1);
 
        storeFaves(); 
        renderNotes(); 
    });
};

renderNotes();


// hiding/showing "You have no favourites message"
if (storedFaves.length > 0) {
    $("#no-fave-msg").attr("class", "hide");
} else {
    $("#no-fave-msg").attr("class", "");
}

// functionality for 'upload image' button
var cardNumber = 0;
var cardRestaurant = "";

$(function() {
    $(":file").change(function(e) {
        if (this.files[0].size > 450000) {
            console.log("max file size is 450kb");
            return;
        }

        if (this.files && this.files[0]) {
            cardNumber = parseInt(e.target.id[e.target.id.length - 1]);
            cardRestaurant = e.target.parentElement.parentElement.parentElement.firstElementChild.textContent;
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
});

function imageIsLoaded(e) {
    $("#img" + cardNumber).removeAttr("class");
    $("#img" + cardNumber).attr("src", e.target.result);
    for (var i = 0; i < storedImages.length; i++) {
        if (storedImages[i][0] === cardRestaurant) {
            storedImages.splice(i, 1);
        }
    }
    storedImages.push([cardRestaurant, e.target.result]);

    storeImages();
}

// local storage for saved imgs
function renderImages() {
    for (var i = 0; i < storedImages.length; i++) {         
        var restaurantName = storedImages[i][0];
        var divContainingRestaurantName = $("div:contains('" + restaurantName + "')")[$("div:contains('" + restaurantName + "')").length - 1];
        if (typeof divContainingRestaurantName !== "undefined") {
            var cardNumber = divContainingRestaurantName.id[divContainingRestaurantName.id.length - 1];
            $("#img" + cardNumber).attr("src", storedImages[i][1]);
        }
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
        var mapLocation = event.target.parentElement.firstElementChild.textContent;
        var specialCharacters = [
            ["$", "24"],
            ["&", "26"],
            ["+", "2B"],
            [",", "2C"],
            ["/", "2F"],
            [":", "3A"],
            [";", "3B"],
            ["=", "3D"],
            ["?", "3F"],
            ["@", "40"]
        ]

        console.log(specialCharacters.hasOwnProperty("$"))
        for (var i = 0; i < mapLocation.length; i++) {
            for (var j = 0; j < specialCharacters.length; j++) {
                if (mapLocation[i] === specialCharacters[j][0]) {
                    mapLocation = mapLocation.substring(0, i) + specialCharacters[j][1] + mapLocation.substring(i + 1, mapLocation.length);
                }
            }
        }

        var mapFrame = $("#map" + mapNumber);
        mapFrame.attr("src", "https://www.google.com/maps/embed/v1/place?key=AIzaSyBMo1myYnlmnCYMJc5fwiGiDZPqXar03ps&q=" + mapLocation);
        // can't use certain special characters in URL e.g. &
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

/* Remove restaurant from faves when remove btn is clickd */


/*Expanding and minimising card
var cardStatus = "closed";
$(".card-divider").on("click", function(event) {
    var cardNumber = event.target.id[event.target.id.length - 1];
    if (cardStatus === "closed") {
        cardStatus = "opened";
        $("#map-btn" + cardNumber).removeClass("hide");
        $("#map-btn" + cardNumber).text("View on Map");
        $("#img-div" + cardNumber).removeClass("hide");
        $("#info" + cardNumber).removeClass("hide");
        $("#notes" + cardNumber).removeClass("hide");
    } else {
        cardStatus = "closed";
        $("#map-btn" + cardNumber).addClass("hide");
        $("#map" + cardNumber).parent().addClass("hide");
        $("#img-div" + cardNumber).addClass("hide");
        $("#info" + cardNumber).addClass("hide");
        $("#notes" + cardNumber).addClass("hide");
    }
})*/