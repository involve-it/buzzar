/**
 * Created by Ashot on 9/8/15.
 */
/*Template.bzControlSearch.rendered = function () {

 }
 Template.bzControlSearch.events({
 'keydown .js-search-text': function (e, v) {
 if (!isOn) {
 v.$('.js-search-posts-link').click();
 $('.js-search-text-modal').val($('.js-search-text').val())
 $('.js-search-text-modal').focus();
 }
 }
 });*/
Meteor.startup(function () {
  bz.help.maps.getCurrentLocation(function (loc) {
    Session.set('bz.control.search.location', {
      coords: loc,
      name: 'My Location'
    });
  });
});

Template.bzControlSearch.created = function () {
  bz.help.maps.initLocation();
  bz.help.maps.initPlaces();
  // doc.ready happened, so:
  bz.help.maps.googleMapsLoad();
}

Template.bzControlSearch.onRendered(function () {

  Meteor.typeahead.inject();
  this.autorun(function () {
    if (GoogleMaps.loaded() && Session.get('bz.control.search.location')) {
      fillNearByPlacesFromLocation(Session.get('bz.control.search.location'), 1);   // 1km ~ 10 min walk
    }
  });

  /*$('.js-nearby-places').typeahead(/!* init *!/).on('typeahead:beforeclose', function($e) {
   $e.preventDefault();
   });
   $(document).on('click', function(e, e1){
   });*/
  /*  $('#typeahead-input').on('typeahead:closed', function(e, d) {
   $('#typeahead-input').focus();
   });
   ///

   */
  Session.set('bz.control.search.searchedText', '');
});

Template.bzControlSearch.helpers({
  placesArray: function () {
    return bz.runtime.maps.places.find().fetch().map(function (object) {
      return {id: object._id, value: object.name};
    });
  },
  joinedArray: function () {
    var ret = [{
      name: 'google-places',
      valueKey: 'name',
      displayKey: 'name',
      template: 'googlePlacesItem',
      header: '<h3 class="league-name">Places Nearby</h3>',
      local: function () {
        ret = bz.runtime.maps.places.find().fetch().map(function (item) {
          return item;
        });

        return ret;
      }
    },
      {
        name: 'post-found',
        valueKey: 'name',
        displayKey: 'name',
        template: 'postFoundItem',
        header: '<h3 class="league-name">Post found</h3>',
        local: function () {
          //console.log(Session.get('bz.control.category-list.activeCategories'));
          var searchSelector, catList = Session.get('bz.control.category-list.activeCategories');
          if (!catList || catList.length === 0) {
            searchSelector = {}
          } else {
            searchSelector = {type: {$in: catList}}
          }
          Session.set('bz.control.search-selector', searchSelector);
          var ret = _.unique(bz.cols.posts.find(searchSelector).fetch().map(function (item) {
            item.name = item.details.title;
            return item;
          }), function (item) {
            return item.name
          });
          /*
           var ret = bz.cols.posts.find(searchSelector).fetch().map(function (item) {
           item.name = item.details.title;
           return item;
           });*/
          return ret;
        }
      }];

    return ret;
    /*var ret = {
     id: object._id,
     value: object.name
     };*/
    /*{
     name: 'nba-teams',
     local: function() { return Nba.find().fetch().map(function(it){ return it.name; }); },
     header: '<h3 class="league-name">NBA Teams</h3>'
     }
     return bz.runtime.maps.places.find().fetch().map(function (object) {
     return ret;
     });*/
  },
  selected: function (event, suggestion, datasetName) {
    var mapsPlaceId = suggestion && suggestion.id;
    //bz.runtime.newPost.location.mapsPlaceId = mapsPlaceId;
    // make it look selected:
    $('.js-location-nearby').addClass('selected');
  }
});
Template.bzControlSearch.events({
  'blur .js-nearby-places': function () {
  },
  'click .js-search-btn': function (e, v) {
    var text = $('.js-nearby-places.tt-input').val();
    if (text) {
      Session.set('bz.control.search.searchedText', text);
    }
    return false;
  },
  //typeahead:
  'change .js-nearby-places': function (e) {
    var val = e.target.value;
    if (!val || val.trim() === '') {
      Session.set('bz.control.search.searchedText', '');
    }
  },
  'typeahead:change .js-nearby-places': function (e, v, val) {
    val = val && val.trim() || '';
    Session.set('bz.control.search.searchedText', val);
  },
  'typeahead:select .js-nearby-places': function (e, v, val) {
    val = val.name && val.name.trim() || '';
    Session.set('bz.control.search.searchedText', val);
    $('.js-nearby-places').typeahead('close');
    $('.js-nearby-places').blur();
  },
  'keydown .js-nearby-places': function (e, v, val) {
    if(e.keyCode === 13){
      // enter bnt hit
      $('.js-nearby-places').typeahead('close');
      $('.js-nearby-places').blur();
    }
  }

});

// HELPERS:
function fillNearByPlacesFromLocation(loc, radius) {
  var map = document.createElement('div');
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: loc.coords,
    radius: radius,
    //types: ['store']
  }, callbackNearbySearch);
}
function callbackNearbySearch(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      bz.runtime.maps.places._collection.upsert({name: results[i].name}, results[i]);
    }
  }
  //Session.set('bz.control.search.places', bz.runtime.maps.places.find().fetch());
  //return bz.runtime.maps.places;
}
