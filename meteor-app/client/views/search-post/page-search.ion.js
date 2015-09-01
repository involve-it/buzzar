/**
 * Created by douson on 27.08.15.
 */

Template.globalSearchIon.onCreated(function () {
  // keep track of the selected post, if it has value, set active template to single:
  setActiveTemplateSessionToSingleIfSelectedPostHasValue();
});

Template.globalSearchIon.rendered = function () {
};

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

/* Make category list */
Template.boxCategory.helpers({
  getCategoryItems: function () {
    var data = data || [];

    data = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
    return _.map(data, function (value, index) {
      return {value: value, index: index};
    });
  },
  active: function () {
    return (Session.get('activeCategory') === this.value) ? 'active' : '';
  }
});

Template.boxCategory.events({
  'click .item-category': function (event, template) {
    Session.set('activeCategory', this.value);
    Session.set('activeTemplate', 'singleSearchTemplate');
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



