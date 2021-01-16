var storedImages = [];
initialise();

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
