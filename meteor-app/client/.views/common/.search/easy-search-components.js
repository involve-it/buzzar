/**
 * Created by ashot on 8/27/15.
 */
/*Template.playersOverview.onCreated(function () {
 // set up reactive computation
 /!*this.autorun(function () {
 var instance = EasySearch.getComponentInstance(
 { index : 'posts' }
 );

 instance.on('autosuggestSelected', function (values) {
 // run every time the autosuggest selection changes
 });
 });*!/
 });*/
Template.globalSearchField.rendered = function () {
  Meteor.typeahead.inject();
};
Template.globalSearchField.helpers({
  /* 'suggestion' : function () {
   debugger;
   var ret;
   Tracker.autorun(function(){
   ret =  Template.suggestionTpl
   })
   return ret;
   }*/
  /*nba: function() {
   //return bz.cols.posts.find().fetch();

   return bz.cols.posts.find().fetch().map(function(item){ return item.details.title; });
   },*/
  search: function (query, sync, callback) {
    alert('easy search!!!');
    Meteor.call('search', query, {}, function (err, res) {
      if (err) {
        console.log(err);
        return;
      }
      callback(_.unique(
        res.map(function (v) {
          return {
            value: v.details.title
          };
        }), false, function (obj, i) {
          return obj.value;
        }
      ));
    });
    /*EasySearch.search('posts', query, function (error, data) {
     // use data
     var resData = _.unique(
     data.results.map(function (v) {
     return {
     value: v.details.title
     };
     }));
     debugger;
     callback(resData, false, function (obj, i) {
     return obj.value;
     });
     });*/
  },
  selected: function (event, suggestion, datasetName) {
    Session.set('runtime.searchText', suggestion.value);
  }
});
/*
 Template.suggestionTpl.rendered = function(){
 debugger;
 }*/
