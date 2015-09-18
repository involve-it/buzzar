/**
 * Created by Ashot on 9/8/15.
 */
/*Template.bzControlSearch.rendered = function () {

 }
 Template.bzControlSearch.events({
 'keydown .js-search-text': function (e, v) {
 debugger;
 if (!isOn) {
 v.$('.js-search-posts-link').click();
 $('.js-search-text-modal').val($('.js-search-text').val())
 $('.js-search-text-modal').focus();
 }
 }
 });*/


Template.bzControlSearch.created = function () {
  bz.help.maps.initLocation();
  bz.help.maps.initPlaces();
  // doc.ready happened, so:
  bz.help.maps.googleMapsLoad();
}

Template.bzControlSearch.onRendered(function () {

  Meteor.typeahead.inject();
  this.autorun(function () {
    if (GoogleMaps.loaded() && Session.get('bz.api.loc')) {
      fillNearByPlacesFromLocation(Session.get('bz.api.loc'), 1000);
    }
  });

  /*$('.js-nearby-places').typeahead(/!* init *!/).on('typeahead:beforeclose', function($e) {
   debugger;
   $e.preventDefault();
   });
   $(document).on('click', function(e, e1){
   debugger;
   });*/
  /*  $('#typeahead-input').on('typeahead:closed', function(e, d) {
   $('#typeahead-input').focus();
   });
   ///

   */
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
      header: '<h3 class="league-name">Google Places</h3>',
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
  'click .js-current-location-a': function (e, v) {
    v.$('.js-current-location-a').toggleClass('button-clear');
    if (v.$('.js-current-location-a').hasClass('button-clear')) {
      bz.runtime.newPost.location.current = false;
    } else {
      bz.runtime.newPost.location.current = true;
    }
  },
  'blur .js-nearby-places': function () {
  },
  'click .js-search-btn': function (e, v) {
    var text = $('.js-nearby-places').val();
    if(text) {
      searchPostsReactive(text);
    }
  },

})

// HELPERS:
function fillNearByPlacesFromLocation(loc, radius) {
  var map = document.createElement('div');
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: loc,
    radius: radius,
    types: ['store']
  }, callbackNearbySearch);
}
function callbackNearbySearch(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      bz.runtime.maps.places._collection.insert(results[i]);
    }
  }
  //Session.set('bz.control.search.places', bz.runtime.maps.places.find().fetch());
  //return bz.runtime.maps.places;
}

function searchPostsReactive(searchText) {
  Tracker.autorun(function () {
    bz.cols.posts.find().count();
    var query = searchText,
        posts,
        map = GoogleMaps.maps.map.instance, latitude, longitude,
        activeCats = Session.get('bz.control.category-list.activeCategories');
    if (!query && query === undefined) {
      query = '';
    }
    Meteor.call('search', query, activeCats, {}, function (err, res) {
      posts = res;
      debugger;
    });
  });
}