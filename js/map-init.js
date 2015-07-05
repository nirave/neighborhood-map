var map;    // declares a global map variable

function initializeMap() {
  // infoWindows are the little helper windows that open when you click
  // or hover over a pin on a map. They usually contain more information
  // about a location.
  var oneInfoWindow;

  //Using bootstrap, the height of a google map needs to be explicitely set,
  //this function sets the height of the map
  setHeight();

  oneInfoWindow = new google.maps.InfoWindow();

  var mapOptions = {
    disableDefaultUI: true
  };

  // This next line makes `map` a new Google Map JavaScript Object and attaches it to
  // <div id="map">
  map = new google.maps.Map(document.querySelector('#map'), mapOptions);

  /*
  pinPoster() takes in the observable array of places
  and fires off Google place searches for each location
  */
  function pinPoster() {

    // Iterates through the array of locations, creates a search object for each location
    ko.utils.arrayForEach(myViewModel.locations(), function(place) {

    //Create the marker
    place.marker = createMapMarker(place.lat, place.lon, place.name);

    //This allows the marker to bounch 3 times when a place is selected
    var bounceFunction = function() {
      bounceThrice(place.marker);
    };

    //This creates an instance of a function that represents all actions
    //when a user selects a place
    var openFunction =  function() {
      openWindow(place.wiki, map, place.marker, place.name, bounceFunction);
    };

    //Store that function in the observable array so the list view can use it
    place.openfunction = openFunction;

    //Add listener to set the openFunction when the user selects a place
    google.maps.event.addListener(place.marker, 'click', openFunction);
    });
  }

  /* openWindow(wiki, map, marker, name, bounce) sets the actions for
     when a user selects a place.  This includes getting the information from
     the wiki, opening the infowindow and placing that information there,
     and then having the marker bounce on the map. */
  function openWindow(wiki, map, marker, name, bounce) {
    $.getJSON( "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles="+wiki+"&callback=?",
          function(data) {
            $.each(data.query.pages, function(k,v){
                 var wholePage = data.query.pages[k].extract;
                 //Only display the first paragraph of the wiki page
                 var contentString = "<div id=\"map-marker\">" +
                    "<b>" + name + "</b>" +
                     wholePage.substring(0, wholePage.indexOf("</p>")) +
                    "</div>";

                 oneInfoWindow.setContent(contentString);
                 oneInfoWindow.open(map, marker);
                 return;
            });
          }
      )
      .error(function() { //Inform the user that their may be a connectivity issue
         var contentString = "Error - it seems like there is a connectivity problem and you are offline";
         oneInfoWindow.setContent(contentString);
         oneInfoWindow.open(map, marker);
         return;
      });

      bounce();
  }

  // This function causes the marker to bounce three times
  function bounceThrice(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 2100);
  }

  // createMapMarker(lat, lon, name) creates map pins and returns the marker
  function createMapMarker(lat, lon, name) {
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(lat,lon),
      animation: google.maps.Animation.DROP,
      title: name
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());

    return marker;
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // pinPoster() creates pins on the map for each location
  pinPoster();
}

/* setHeight() - This is required to run maps in bootstrap
   Since bootstrap requires a height in pixels to display the map,
   this calculates the height from the css */
function setHeight() {
  var h = $(window).height(),
        offsetTop = 0;
    $('#map').css('height', (h - offsetTop));
}

// Calls the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  setHeight();

  // Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
});
