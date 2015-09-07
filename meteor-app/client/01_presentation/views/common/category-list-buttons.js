/**
 * Created by root on 9/5/15.
 */
/* Make category list */
Template.categoryListButtons.helpers({
  getCategoryItems: function () {
    data = bz.cols.siteTypes.find().fetch();
    return data;
  },
  isActive: function (a, b) {
    var cats = Session.get('activeCategoryIds') || [];
    return (cats && cats.indexOf(this._id) !== -1) ? 'active' : '';
  }
});

Template.categoryListButtons.events({
  'click .item-category': function (e, v) {
    var cats = Session.get('activeCategoryIds') || [],
        ind = cats.indexOf(this._id);
    if (ind !== -1) {
      cats.splice(ind, 1);
    } else {
      cats.push(this._id);
    }
    Session.set('activeCategoryIds', cats);
    //Session.set('activeTemplate', 'singleSearchTemplate');
    Session.set('activeTemplate', null);
  }
});