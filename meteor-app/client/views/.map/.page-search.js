/**
 * Created by douson on 19.08.15.
 */

Template.postsMap.rendered = function () {
  var classes = $('.bar');
  classes.addClass('global-search-bar');

  /*init Rate*/
  $('.rating').raty({
    starType: 'i'
  });
};


Template.postsMap.helpers({
  searchResult: function () {
    var contacts = Meteor.users.find();
    /*console.log(contacts);*/
    return contacts;
  }
});
/*Template.postsMap.rendered = function () {
  var classes = $('.bar');
  classes.addClass('global-search-bar');

  /!*init Rate*!/
  $('.rating').raty({
    starType: 'i'
  });
  $(window).scrollTop();
};*/


/*Template.postsMap.helpers({
  searchResult: function () {
    var contacts = Meteor.users.find();
    /!*console.log(contacts);*!/
    return contacts;
  }
});*/

Template.panelSearchResult.helpers({});







