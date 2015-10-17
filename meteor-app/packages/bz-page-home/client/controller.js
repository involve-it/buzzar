/**
 * Created by Ashot on 9/19/15.
 */

setSearchTextFromQs = function(qs) {
  var qs = qs || {}

  if(qs.searchText){
    Session.set('bz.control.search.searchedText', qs.searchText);
  }
}

setSearchLocationFromQs = function(qs){
  var qs = qs || {}

  if(qs.locationName){ // there is a location defined, need to put it in the search field:
    //var loc = Session.get('bz.control.search.location'),
    var  userId = Meteor.userId(), locObj;
    if(!userId) {
      bz.help.logError('home qs error: userId not defined');
    }
    locObj = bz.cols.locations.searchByLocationNamedUserId(qs.locationName, userId);

    if(locObj){
      Session.set('bz.control.search.location', locObj);
    }
  }
}
getUserImageFromRecord = function(userId) {


  var ret;
  if (userId && Meteor.users.findOne(userId)) {
    ret = Meteor.users.findOne(userId).profile.image;
    ret = ret && ret.data;
  }
  return ret;
}