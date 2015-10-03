/**
 * Created by ashot on 8/21/15.
 */

bz.cols.locations = new Mongo.Collection('bz.locations');
if(Meteor.isServer){
  bz.cols.locations.remove({});
}

bz.cols.locations.before.insert(function (userId, doc) {
});

//bz.cols.imagesData.remove({});
if (Meteor.isServer) {
  if(bz.config.env === 'dev'){  // todo: this is non-secure!
    bz.cols.locations.allow({
      insert: function () {
        return true;
      },
      remove: function(){
        return true;
      }
    });
  }
}
if(Meteor.isServer){
  Meteor.publish('locations-all', function(){
    return bz.cols.locations.find();
  });
  Meteor.publish('locations-my', function(){
    return bz.cols.locations.find({
      userId: this.userId
    });
  });
}
if(Meteor.isClient){
  Meteor.subscribe('locations-all');
  Meteor.subscribe('locations-my');
}


// post schema:
if (Meteor.isServer && false) {
// see http://sfbay.craigslist.org/sby/prk/5147998963.html
// click google map link, see: 37.3715461,-121.996919
  bz.cols.locations.insert({
    userId: 'mvmkh8LKukaHmu7oy',
    placeId: '',
    name: 'Orinda ballet'
  });
  bz.cols.locations.insert({
    userId: 'mvmkh8LKukaHmu7oy',
    placeId: '',
    name: 'Russian house #1'
  });
}