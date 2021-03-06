// create markers array (to later enable us to remove displayed markers)
var markers = [];

//Create infoWindow global variable (to ensure only 1 infoWindow can be open at any time)
var infoWindow = new google.maps.InfoWindow();

// Wait for site to load before initiating js
$(document).ready(function () {

    // function to scroll to the main map section if the arrow is clicked
    $(function scrollToMainMap() {
        $("#arrow").click(function () {
            $('html,body').animate({
                scrollTop: $("#mainmap").offset().top
            },
                '400ms');
        });
    });

    // Used to return to the 'home' page when the logo is selected
    $(function logoToHome() {
        $(".logo").click(function () {
              $("#home, #mainmap").removeClass("hide");
              $("#activities, #fooddrink ,#accomodation, #locationdetails").addClass("hide");
        });
    });
    
    // Used to display and hide feature sections when a nav item is selected.
    $(function navHideSections() {
        //when a nav-link is selected
        $(".nav-link").click(function () {
            // if the ID of that navlink = navhome
            if ($(this).attr("id") === "navhome") {
                //display the home section
                $("#home, #mainmap").removeClass("hide");
                //hide all other sections
                $("#activities, #fooddrink ,#accomodation, #locationdetails").addClass("hide");
                // if the ID of that navlink = navactivities
            } else if ($(this).attr("id") === "navactivities") {
                //display the activities section
                $("#activities").removeClass("hide");
                //hide all other sections
                $("#home, #mainmap, #fooddrink, #accomodation, #locationdetails").addClass("hide");
                // if the ID of that navlink = navfooddrink
            } else if ($(this).attr("id") === "navfooddrink") {
                //display the fooddrink section
                $("#fooddrink").removeClass("hide");
                //hide all other sections
                $("#home, #mainmap, #activities, #accomodation, #locationdetails").addClass("hide");
                // if the ID of that navlink = navaccomodation
            } else if ($(this).attr("id") === "navaccomodation") {
                //display the Accomodation section
                $("#accomodation").removeClass("hide");
                //hide all other sections
                $("#home, #mainmap, #activities, #fooddrink, #locationdetails").addClass("hide");
            }
        });
    });

    // Used to display and hide feature sections when a one of the home 'buttons' is selected on the landing screen.

    $(function homeHideSections() {
        // when a div with the feature class is selected
        $(".feature").click(function () {
            // if the ID of that div = homeactivities
            if ($(this).attr("id") === "homeactivities") {
                //display the activities section
                $("#activities").removeClass("hide");
                //hide all other sections
                $("#home, #mainmap, #fooddrink, #accomodation, #locationdetails").addClass("hide");
            // if the ID of that div = homefooddrink
            } else if ($(this).attr("id") === "homefooddrink") {
                //display the fooddrink section
                $("#fooddrink").removeClass("hide");
                //hide all other sections
                $("#home, #mainmap, #activities, #accomodation, #locationdetails").addClass("hide");
            // if the ID of that div = homefooddrink
            } else if ($(this).attr("id") === "homeaccomodation") {
                //display the Accomodation section
                $("#accomodation").removeClass("hide");
                //hide all other sections
                $("#home, #mainmap, #activities, #fooddrink, #locationdetails").addClass("hide");
            }
        });
    });

    // Used add styling to location divs when hovered over
    $(function transformLocationImage() {
        //When a locationimage is hovered over
        $(".locationimage").hover(function () {
            // scale the image 1.2x over 400ms
            $(this).css({ 'transform': 'scale(1.2)', 'transition': 'transform 400ms ease-in-out' });
            // scale sibling location name 1.2x over 400ms
            $(this).siblings('.locationname').css({ 'transform': 'scale(1.2)', 'transition': 'transform 400ms ease-in-out' });
        }, function () {
            //when not hovered, return the scale to normal over 400ms
            $(this).css({ 'transform': 'scale(1)', 'transition': 'transform 400ms ease-in-out' });
            //when not hovered, return sibling locationname scale to normal over 400ms
            $(this).siblings('.locationname').css({ 'transform': 'scale(1)', 'transition': 'transform 400ms ease-in-out' });
        });
    });

    // used to hide feature sections and display the location details section.

    $(function displayLocationDetails() {
        //when a location is selected
        $(".location").click(function () {
            //display the location details section
            $("#locationdetails").removeClass("hide");
            //hide all other sections
            $("#home, #activities, #fooddrink, #accomodation").addClass("hide");
        });
    });

});

// Function to load & style map
function initMap() {
    //default the map center, zoom and styling
    var mapDefault = {
        center: new google.maps.LatLng(53.483959, -2.244644),
        zoom: 12,
        styles:
            [
                {
                    "featureType": "poi",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "saturation": 30
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                }
            ]
    };
    //define new google map variables (for each map) and apply the mapDefault styles
    map = new google.maps.Map(document.getElementById("map"), mapDefault);
    map2 = new google.maps.Map(document.getElementById("map2"), mapDefault);
}

function mainMapMarkers() {
    $(".locationbutton").click(function () {
        //call the initMap function
        initMap();
        //remove any markers currently displayed on the map
        deleteMarkers();
        //Create labels to allow each marker to be assigned a unique letter.
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        //Set the index to 0, so each time the function is called, the first marker will be 'A'
        var labelIndex = 0;
        // define the type variable as the ID of the selected button (to allow us to identify applicable details in the JSON data)
        if ($(this).attr("id") === "activitiesbutton") {
            var type = "Activities";
        }
        else if ($(this).attr("id") === "fooddrinkbutton") {
            var type = "Food & Drink";
        }
        else if ($(this).attr("id") === "accomodationbutton") {
            var type = "Accomodation";
        }
        // get the JSON file
        $.getJSON('assets/data/location_details.json', function (data) {
            //iterate through each object
            $.each(data.location_details, function (i, value) {
                
                //Where the ID of the selected type matches the Type within the array
                if (value.Type === type) {
                    //identify the lat,lng location
                    var markerLocation = new google.maps.LatLng(value.lat, value.lng);
                    //add a marker (with letter label) to the map at the relevant locations
                    var marker = new google.maps.Marker({
                        position: markerLocation,
                        label: labels[labelIndex++ % labels.length],
                        map: map2,
                    });
                    // add marker details into the marker array (to be able to remove later)
                    markers.push(marker);

                    //create infoWindow variable & multiple variables to create the infoWindoContent
                    var infoWindowTitle = value.Name;
                    var infoWindowSubType = value.Subtype;
                    var infoWindowDescription = value.Description;
                    var infoWindowWebsite = value.Website;
                   
                    //Create infoWindowContent variable and interpolate above variables
                    var infoWindowContent = `<h6><b>${infoWindowTitle}</b><h6><p>${infoWindowSubType}</p> <p>${infoWindowDescription}</p><a href=${infoWindowWebsite} target="_blank">Visit website</a>` ;

                    //Create infoWindowContent variable to allow content to be populated in the info Window
                        marker.addListener('mouseover', function () {
                            infoWindow.setContent(infoWindowContent);
                            infoWindow.open(map, marker);
                        });
                    
                }
            });
            //add the marker clusterer, and pass in the map, markers array and clusterer image
            var markerCluster = new MarkerClusterer(map2, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
        });
    });
}

// Function to display details and map marker of the selected location 
function displayDetails() {
    //call the initMap function
    initMap();
    $(".location").click(function () {
        // define the thisLocation variable as the ID of the selected location (to allow us to identify applicable details in the JSON data)
        var thisLocation = this.id;
        //remove any markers currently displayed on the map
        deleteMarkers();
        // get the JSON file
        $.getJSON('assets/data/location_details.json', function (data) {
            //iterate through each object
            $.each(data.location_details, function (i, value) {
                //Where the ID of the selected location matches the an ID within the array
                if (value.ID === thisLocation) {
                    //identify the lat,lng location
                    var markerLocation = new google.maps.LatLng(value.lat, value.lng);
                    // define a varible centre and add the lat/lng position as the marker location
                    var center = markerLocation;
                    //add a marker to the map at the relevant location
                    var marker = new google.maps.Marker({
                        position: markerLocation,
                        map: map,
                    });
                    // center the map over the markerlocation
                    map.panTo(center);
                    // Zoom into map
                    map.setZoom(15);
                    // add marker details into the marker array (to be able to remove later)
                    markers.push(marker);
                    //Display the applicable details of the selected location
                    document.getElementById("locationvenue").innerHTML = value.Name;
                    document.getElementById("locationtype").innerHTML = value.Type + " - " + value.Subtype;
                    document.getElementById("locationwebsite").href = value.Website;
                    document.getElementById("locationphone").innerHTML = value.PhoneNumber;
                    document.getElementById("locationdescription").innerHTML = value.Description;
                }
            });
        });
    });
}

// function to iterate through the markers array, and set a clear map again
function deleteMarkers(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
    //clear the markers array
    markers = [];
}

// Call the functions
displayDetails();
mainMapMarkers();