var map, infoWindow, table; // map - map object reference, infoWindow - show the location info., table - show up the location list
var markerImage = 'resource/marker.png';    //markerImage - resoruce path for the marker image
var markers = [];   //markers - array for storing the map pin marker

$(document).ready(function () {
    table = $('#dtBasic').DataTable();
});

$(function () {
    //declare the location i want to centre my map on
    var location = new google.maps.LatLng(22.337347, 114.150731);   //RedSo location

    //when the page is loaded, the initMap() function is called
    google.maps.event.addDomListener(window, 'load', initMap);
    /**
     * Function for init the map config and info window
     */
    function initMap() {
        //define the basic map option (zoom level, map type)
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: location,
            zoom: 17,
            panControl: true,
            scrollwheel: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        // create new Google maps object and pass my configuration to it
        map = new google.maps.Map(mapCanvas, mapOptions);
        infoWindow = new google.maps.InfoWindow();
        google.maps.event.addListener(map, 'bounds_changed', function () {  //add a 'bounds_changed' event listener
            // delete the previous markers when the bounds changed
            deleteMarkers();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                bounds: map.getBounds(),
                type: ['restaurant']
            }, nearbySearchCallback);   //nearbySearchCallback will be called when the search is ended
        });
    }
    /**
     * Callback for nearbySeach service
     * @param {*} results 
     * @param {*} status 
     */
    function nearbySearchCallback(results, status) {
        table.clear();  // Clear the data table
        if (status === google.maps.places.PlacesServiceStatus.OK) { // service status OK checking
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);   // add the pin to the map
                var name = results[i].name != undefined ? results[i].name.toString() : 'N/A';
                var vicinity = results[i].vicinity != undefined ? results[i].vicinity.toString() : 'N/A';
                if(results[i].opening_hours != undefined)
                    opening_hours = (results[i].opening_hours.open_now) ? 'Open' : 'Closed';
                var rating = results[i].rating != undefined ? results[i].rating.toString() : 'N/A';
                var price_level = results[i].price_level != undefined ? results[i].price_level.toString() : 'N/A';
                // table row insert new element (name, vicinity, opening hours, rating, price level)
                table.row.add([name,vicinity,opening_hours,rating,price_level]).draw();
            }
        }
    }
    /**
     * Function for creating marker pin on the map
     * @param {*} place 
     */
    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            position: placeLoc,
            map: map,
            icon: markerImage
        });
        // add marker to the markers array
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function () {    //add a 'click' event listener
            var name = place.name != undefined ? place.name.toString() : 'N/A';
            var vicinity = place.vicinity != undefined ? place.vicinity.toString() : 'N/A';
            if(place.opening_hours != undefined)
                opening_hours = (place.opening_hours.open_now) ? 'Open' : 'Closed';
            var rating = place.rating != undefined ? place.rating.toString() : 'N/A';
            var price_level = place.price_level != undefined ? place.price_level.toString() : 'N/A';

            var contentString = '<div class="info-window">' +
            '<h3>'+ name +'</h3>' +
            '<div class="info-content">' +
            '<p>Location: '+ vicinity +'</p>' +
            '<p>Opening hours: '+ opening_hours +'</p>' +
            '<p>Rating: '+ rating +'</p>' +
            '<p>Price level: '+ price_level +'</p>' +
            '</div>' +
            '</div>';
            // setup location content in the infoWindow
            infoWindow.setContent(contentString);
            infoWindow.open(map, this);
        });
    }
    /**
     * Sets the map on all markers in the array
     * @param {*} map 
     */
    function clearMarkers(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }
    /**
     * Function for Deleting all markers in the array by removing references to them.
     */
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }
});