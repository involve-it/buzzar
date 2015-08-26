/**
 * Created by douson on 19.08.15.
 */

Template.globalSearchIon.rendered = function () {
  var classes = $('.bar');
  classes.addClass('global-search-bar');

  /*init Rate*/
  $('.rating').raty({
    starType: 'i'
  });
};


Template.globalSearchIon.helpers({
  searchResult: function () {
    var contacts = Meteor.users.find();
    /*console.log(contacts);*/
    return contacts;
  }
});
Template.globalSearch.rendered = function () {
  var classes = $('.bar');
  classes.addClass('global-search-bar');

  /*init Rate*/
  $('.rating').raty({
    starType: 'i'
  });
  $(window).scrollTop();
};


Template.globalSearch.helpers({
  searchResult: function () {
    var contacts = Meteor.users.find();
    /*console.log(contacts);*/
    return contacts;
  }
});


Template.panelSearchResult.helpers({});

Template.multipleResult.events({
    'click .save .button': function(e) {
        console.log('click e');
    }
});