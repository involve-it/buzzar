/**
 * Created by Ashot on 9/19/15.
 */
Template.searchResults.onCreated(function () {
  //Session.get('bz.control.search.location');
});
Template.searchResults.helpers({
  getSearchedResults: function(){
    return bz.cols.searchRt.find().fetch();
  }
});