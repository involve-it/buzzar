/**
 * Created by ashot on 8/19/15.
 */
bz.cols.config = new Mongo.Collection('config');
Ground.Collection(bz.cols.config);
if(Meteor.isServer)  {
  bz.cols.config.remove({});
  bz.cols.config.allow({
    insert: function(id, doc){
      var ret = false;
      if(doc.name === 'isMobile'){
        ret = true;
      }
      return ret;
    }
  });
  _.each(_.keys(bz.config), function(item, i1){
    bz.cols.config.insert({
      name: item,
      value: bz.config[item]
    });

  });
  Meteor.publish('settings', function(){
    return bz.cols.config.find();
  });
}
if(Meteor.isClient) {
  bz.config = {
    isDev: function(){
      return document.location.origin.indexOf('localhost:') >= 0;
    }
  }
  // see router - waitOn
}
if(Meteor.isClient){
  bz.cols.config.insert({
    name: 'isMobile',  // Web mobile flag
    value: Meteor.isMobile // taken from this: meteor add mquandalle:ismobile
  });
}
if(Meteor.isClient) {
  Tracker.autorun(function(){
    if(bz.cols.config) {
      _.each(bz.cols.config.find().fetch(), function (item) {
        bz.config[item.name] = item.value;
      });
    }
  })
}

