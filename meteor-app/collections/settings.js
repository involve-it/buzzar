/**
 * Created by ashot on 8/19/15.
 */
bz.cols.settings = new Mongo.Collection('settings');
if(Meteor.isServer)  {
  bz.cols.settings.remove({});
  bz.cols.settings.allow({
    insert: function(){
      return true;
    }
  })
  bz.cols.settings.insert({
    name: 'mapsKey',
    value: 'AIzaSyALawhBQHnhXiXDFhwZ-OSgS-ZZPHvDsRQ'
  });
  bz.cols.settings.insert({
    name: 'isCordova',    // Cordova/phonegap mobile application flag
    value: Meteor.isCordova
  });

  Meteor.publish('settings', function(){
    return bz.cols.settings.find();
  });
}
if(Meteor.isClient) {
  bz.runtime.settings = {}
  // see router - waitOn
}
if(Meteor.isClient){
  bz.cols.settings.insert({
    name: 'isMobile',  // Web mobile flag
    value: Meteor.isMobile // taken from this: meteor add mquandalle:ismobile
  });
}

