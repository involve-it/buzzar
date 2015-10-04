/**
 * Created by Ashot on 9/8/15.
 */

/*Meteor.startup(function () {
  bz.help.maps.getCurrentLocation(function (loc) {
    Session.set('bz.control.search.location', {
      coords: loc,
      name: 'My Location'
    });
  });
});*/

Template.bzControlSearchLocation.created = function () {
  /*bz.help.maps.initLocation();
  bz.help.maps.initPlaces();
  // doc.ready happened, so:
  bz.help.maps.googleMapsLoad();*/

}

Template.bzControlSearchLocation.onRendered(function () {

  Meteor.typeahead.inject();

});

Template.bzControlSearchLocation.helpers({
  placesArray: function () {
    return bz.runtime.maps.places.find().fetch().map(function (object) {
      return {id: object._id, value: object.name};
    });
  },
  joinedArray: function () {
    var ret = [
      {
        name: 'google-places',
        valueKey: 'name',
        displayKey: 'name',
        template: 'googlePlacesItem',
        header: '<h3 class="league-name">Google Places Nearby</h3>',
        local: function () {
          ret = bz.runtime.maps.places.find({searchEngine: 'google'}).fetch().map(function (item) {
            return item;
          });

          return ret;
        }
      }/*,
      {
        name: 'yelp-places',
        valueKey: 'name',
        displayKey: 'name',
        template: 'googlePlacesItem',
        header: '<h3 class="league-name">Yelp Places Nearby</h3>',
        local: function () {
          ret = bz.runtime.maps.places.find({searchEngine: 'yelp'}).fetch().map(function (item) {
            return item;
          });

          return ret;
        }
      }*/
    ];
    return ret;


    /* {
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

     return ret;
     }
     }*/
  },
  selected: function (event, suggestion, datasetName) {
    var mapsPlaceId = suggestion && suggestion.id;
    //bz.runtime.newPost.location.mapsPlaceId = mapsPlaceId;
    // make it look selected:
    $('.js-location-nearby').addClass('selected');
  }
});
Template.bzControlSearchLocation.events({
  'blur .js-nearby-places': function () {
  },
  'click .js-search-btn': function (e, v) {
    var text = $('.js-nearby-places.tt-input').val();
    if (text) {
      setSearchedText(text);
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
