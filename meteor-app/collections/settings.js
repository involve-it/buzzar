/**
 * Created by ashot on 8/19/15.
 */
bz.cols.settings = new Mongo.Collection('settings');
if(Meteor.isServer)  {
  bz.cols.settings.remove({});
  bz.cols.settings.allow({
    insert: function(id, doc){
      var ret = false;
      if(doc.name === 'isMobile'){
        ret = true;
      }
      return ret;
    }
  });
  bz.cols.settings.insert({
    name: 'mode',    // Cordova/phonegap mobile application flag
    value: 'dev'     // other options: prod, beta
  });
  bz.cols.settings.insert({
    name: 'isCordova',    // Cordova/phonegap mobile application flag
    value: Meteor.isCordova
  });
  bz.cols.settings.insert({
    name: 'mapsKey',
    //value: 'AIzaSyALawhBQHnhXiXDFhwZ-OSgS-ZZPHvDsRQ'
    value: null
  });

  Meteor.publish('settings', function(){
    return bz.cols.settings.find();
  });
}
if(Meteor.isClient) {
  bz.config = {}
  // see router - waitOn
}
if(Meteor.isClient){
  bz.cols.settings.insert({
    name: 'isMobile',  // Web mobile flag
    value: Meteor.isMobile // taken from this: meteor add mquandalle:ismobile
  });
}

