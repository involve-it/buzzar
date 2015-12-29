/**
 * Created by root on 9/5/15.
 */
/* Make category list */
Template.categoryListButtons.helpers({
  getCategoryItems: function () {
    data = bz.cols.postAdTypes.find().fetch();
    return data;
  },
  isActive: function (a, b) {
    var cats = Session.get('bz.control.category-list.activeCategories') || [];
    return (cats && cats.indexOf(this.name) !== -1) ? 'active' : '';
  }
});

Template.categoryListButtons.events({
  'click .item-category': function (e, v) {
    var cats = Session.get('bz.control.category-list.activeCategories') || [],
        ind = cats.indexOf(this.name);
    if (ind !== -1) {
      cats.splice(ind, 1);
    } else {
      //cats.push(this.id);
      cats.push(this.name);
    }
    Session.set('bz.control.category-list.activeCategories', cats);
    //Session.set('activeTemplate', 'singleSearchTemplate');
    Session.set('activeTemplate', null);
  }
});