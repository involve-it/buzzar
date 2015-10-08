/**
 * Created by ashot on 8/21/15.
 */

bz.cols.locations = new Mongo.Collection('bz.locations');
if(Meteor.isServer){
  //bz.cols.locations.remove({});
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
    name: 'Orinda ballet',
    placeType: 'bz',
    coords: {  //  49 Geary Street, San Francisco, CA
      lat: 37.787923,
      lng: -122.404342
    },
    public: false // private, user's place

  });
  bz.cols.locations.insert({
    userId: 'mvmkh8LKukaHmu7oy',
    name: 'Russian house #1',
    placeType: 'bz',
    coords: {  //  49 Geary Street, San Francisco, CA
      lat: 37.787923,
      lng: -122.404342
    },
    public: false // private, user's place
  });
}

// EXTERNAL:
bz.cols.locations.insertFromGoogleObject = function(googleObj) {
  var ret = {
    userId: Meteor.userId(),
    name: googleObj.name,
    placeType: 'google',
    coords: {
      lat: googleObj.geometry.location.J,
      lng: googleObj.geometry.location.M
    },
    public: true, // let's assume this is a public place, since it's from google
    origObj: googleObj
  }
  ret._id = bz.cols.locations.insert(ret);
  return ret;
}