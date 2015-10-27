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


Template.bzDistance.rendered = function () {
  //$("#selectDis").trigger("change", true);
  $('select').foundationSelect();
};

Template.bzDistance.events({
  'change #selectDis': function (e) {
    var $this = $(this);
    console.log($this);
  },
  'click #select-selectDis li': function(e) {
    var target = $(e.target);
    if (target.is('li.disable')) {
      return false;
    }

    var ret = target.text();
    console.log(ret);
  },
  'click #select-selectDis11 li': function(e, v){
    var distStr = e.target.dataset.value,
      dist = Number.parseFloat(distStr);
    if(dist !== NaN) {
      Session.set('bz.control.search.distance', dist);
    }
  }
});


Meteor.startup(function () {
  bz.help.maps.getCurrentLocation(function (loc) {
    Session.set('bz.control.search.location', {
      coords: loc,
      name: bz.const.places.CURRENT_LOCATION
    });
  });
});


Template.bzControlSearch.created = function () {
  //bzControlSearchCreated();
}

Template.bzControlSearch.onRendered(function () {
  Meteor.typeahead.inject();
  Session.set('bz.control.search.searchedText', '');
});

Template.bzControlSearch.helpers({
  placesArray: function () {
    return bz.runtime.maps.places.find().fetch().map(function (object) {
      return {id: object._id, value: object.name};
    });
  },
  joinedArray: function () {
    var ret = [
      /*{
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
      },
      {
        name: 'yelp-places',
        valueKey: 'name',
        displayKey: 'name',
        template: 'googlePlacesItem',
        header: '<h3 class="league-name">Yelp Places Nearby</h3>',
        local: function () {
          ret = bz.runtime.maps.places.find().fetch().map(function (item) {
            return item;
          });

          return ret;
        }
      },*/
      {
        name: 'post-found',
        valueKey: 'name',
        displayKey: 'name',
        template: 'postFoundItem',
        header: '<h3 class="league-name">Posts found</h3>',
        local: function () {
          //console.log(Session.get('bz.control.category-list.activeCategories'));
          var searchSelector = {
                'status.visible': bz.const.posts.status.visibility.VISIBLE
              },
              catList = Session.get('bz.control.category-list.activeCategories');

          if (catList && catList.length > 0) {
            searchSelector.type = {$in: catList};
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
  searchItemSelected: function (event, suggestion, datasetName) {
    var mapsPlaceId = suggestion && suggestion.id;
    //bz.runtime.newPost.location.mapsPlaceId = mapsPlaceId;
    // make it look selected:
    $('.js-location-nearby').addClass('selected');
  },
  searchTagIsVisible: function(e, v){
    return Session.get('bz.control.search.searchedText') !== '' && Session.get('bz.control.search.searchedText') !== undefined;
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
    if (e.keyCode === 13) {
      // enter bnt hit
      $('.js-nearby-places').typeahead('close');
      $('.js-nearby-places').blur();
    }
  }

});

Template.bzSearchHashTagLabel.rendered = function() {
  var el = $('.bz-hash-tag-label');
  
  if(el) {
    var elHeight = $('.bz-hash-tag-label').height(),
        elHeigtZero = $('.bz-hash-tag-label').height(0);
    
    setTimeout(function() {
      el.height(elHeight);
    } ,250);
  }

  
  
};

Template.bzSearchHashTagLabel.helpers({
  getLookingForPhrase: function(){
    var loc = Session.get('bz.control.search.location') || '',
      dist = Session.get('bz.control.search.distance') || '',
      text = Session.get('bz.control.search.searchedText') || 'buzz',
    ret = 'Looking for '  + text + ' around ';
    if(loc.name){
      loc = loc.name;
    }
    if(dist){
      dist = ' within ' + dist + ' mile';
    }
    ret += loc + dist;

    return ret;
  },
  isHashTagLabel: function() {
    
    var userTypeHash = Session.get('bz.control.search.searchedText');
    
    var isHashTag = bz.cols.hashes.find({userId: Meteor.userId()}).fetch().map(function(obj) {
      return {value: obj.details.text}
    });
    
    for(var i = 0; i < isHashTag.length; i++) {
      if(userTypeHash == isHashTag[i].value) {
        var result = isHashTag[i].value; 
        return result;
      }
    }
    
    /*_.each(isHashTag, function(obj) {
      if(userTypeHash == obj.value) {
        return console.log(obj.value);
      }
    });*/
            
  }
});
Template.bzSearchHashTagLabel.events({
  'click .js-save-hash-btn': function(e, v) {
    var loc = Session.get('bz.control.search.location') || {
          coords: {}
        },
        dist = Session.get('bz.control.search.distance') || '',
        text = Session.get('bz.control.search.searchedText') || '';
    
    bz.cols.hashes.insert({
      userId: Meteor.userId(),
      details: {
        text: text,
        distance: dist,
        coords: loc.coords,
        locName: loc.name
      }
    });
    
    
    
    return false;
  }
});
