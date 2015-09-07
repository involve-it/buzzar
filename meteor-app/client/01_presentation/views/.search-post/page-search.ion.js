/**
 * Created by douson on 27.08.15.
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
    debugger;
    var contacts = Meteor.users.find();
    /*console.log(contacts);*/
    return contacts;
  }
});

Template.globalSearchIon.onCreated(function () {
  // keep track of the selected post, if it has value, set active template to single:
  setActiveTemplateSessionToSingleIfSelectedPostHasValue();
});

Template.showListMap.events({
  'click [data-menu=multipleSearchTemplate]': function (event, template) {
    event.preventDefault();

    var name = template.$(event.target).data('menu');
    console.log(name);
    Session.set('activeTemplate', name);

    var showSearchList = $('.multipleResult');
    showSearchList.addClass('animated  flipInY').toggleClass('show');
  }
});

/* Dynamic template */
Template.panelSearchResult.helpers({
  activeTemplate: function () {
    return Session.get('activeTemplate');
  },
  getData: function () {
    var ret = {};
    Session.get('search.selectedPost');

    if (Session.get('activeTemplate') === 'singleSearchTemplate') {
      ret = Session.get('search.selectedPost');
    }
    return ret;
  }
});

//HELPERS:

function setActiveTemplateSessionToSingleIfSelectedPostHasValue() {
  Tracker.autorun(function () {
    var selPost = Session.get('search.selectedPost');
    if (Session.get('search.selectedPost') && typeof Session.get('search.selectedPost') === 'object' && Session.get('activeTemplate') !== 'singleSearchTemplate') {
      Session.set('activeTemplate', 'singleSearchTemplate');
    }
  });
}



