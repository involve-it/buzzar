/**
 * Created by douson on 27.08.15.
 */

Template.pageMap.onCreated(function () {
  // keep track of the selected post, if it has value, set active template to single:
  setActiveTemplateSessionToSingleIfSelectedPostHasValue();
});

Template.pageMap.rendered = function () {
};

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



