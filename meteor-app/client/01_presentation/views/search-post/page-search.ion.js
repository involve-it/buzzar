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
    data = bz.cols.siteTypes.find().fetch();
    return data;
  },
  isActive: function (a, b) {
    var cats = Session.get('activeCategoryIds') || [];
    return (cats && cats.indexOf(this._id) !== -1) ? 'active' : '';
  }
});

Template.boxCategory.events({
  'click .item-category': function (e, v) {
    var cats = Session.get('activeCategoryIds') || [],
        ind = cats.indexOf(this._id);
    if (ind !== -1) {
      cats.splice(ind, 1);
    } else {
      cats.push(this._id);
    }
    Session.set('activeCategoryIds', cats);
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



