/**
 * Created by ashot on 8/19/15.
 */
bz.cols.settings = new Mongo.Collection('settings');
if(Meteor.isServer)  {
  bz.cols.settings.remove({});
  bz.cols.settings.insert({
    name: 'mapsKey',
    value: 'AIzaSyALawhBQHnhXiXDFhwZ-OSgS-ZZPHvDsRQ'
  });
  Meteor.publish('settings', function(){
    return bz.cols.settings.find();
  });
}
if(Meteor.isClient) {
  bz.runtime.settings = {}
  // see router - waitOn
}

