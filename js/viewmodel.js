//Declare all the places to map
var places = [
    {name: "Home", address: "1239 Westbury Dr, San Jose, CA 95131, USA", wiki: "San_Jose,_California", lat: "37.395069", lon: "-121.90247999999997", id: "home" },
    {name: "Rental", address: "6391 Byron Ln, San Ramon, CA 94582, USA", wiki: "San_Ramon,_California", lat: "37.748945", lon: "-121.89883399999997", id: "other"},
    {name: "UC Berkeley", address: "Barrow Lane, Berkeley, CA 94704 United States", wiki: "University_of_California,_Berkeley", lat: "37.869507", lon: "-122.258778", id: "college"},
    {name: "Oracle", address: "488 S Almaden Ave San Jose, CA 95110 United States", wiki: "Oracle_Corporation", lat: "37.3272039", lon: "-121.8889516", id: "work"},
    {name: "El Pollo Loco", address: "2505 El Camino Real Santa Clara, CA 95051 United States", wiki: "El_Pollo_Loco", lat: "37.3527426", lon: "-121.9710566", id: "work"},
    {name: "Udacity", address: "2465 Latham St Mountain View, CA 94040 United States", wiki: "Udacity", lat: "37.3998641", lon: "-122.1083996", id: "class"}
    ];

//The Global ViewModel for knockout
var myViewModel;

function viewModel() {
  var self = this;

  self.query = ko.observable('');  //The user's search criterea

  //This Observable Array contains all the places
  self.locations = ko.observableArray(places);

  // This computed function limits creates a dynamic array,
  // this array is limited by the search query
  // In addition it only set marker visibility to true for all
  // elements in the array
  self.searchplaces = ko.computed(function() {
    var search = this.query().toLowerCase();

    //Set all the markers to invisible
    ko.utils.arrayForEach(this.locations(), function(place) {
        if (place.marker) {
          place.marker.setVisible(false);
        }
     });

    return ko.utils.arrayFilter(places, function(place) {
        //Only display the filtered markers
        if (place.name.toLowerCase().indexOf(search) >= 0) {
          if (place.marker) {
            place.marker.setVisible(true);
          }
        }

        //Return the filtered value
        return place.name.toLowerCase().indexOf(search) >= 0;
      });
    }, self);

   self.select = function(place) {
      place.openfunction();
    };
}

//Create and load the viewmodel only after the document has been loaded
$( document ).ready(function() {
    myViewModel = new viewModel();
    ko.applyBindings(myViewModel);
  }
);