/**
 * Created by Ashot on 9/27/15.
 */
bz.cols.hashes =  new Mongo.Collection('bz.hashes');
if(Meteor.isServer) {
  Meteor.publish('bz.hashes.all', function () {
    return bz.cols.hashes.find();
  });
}
if (Meteor.isServer) {
  //if(bz.config.env === 'dev'){  // todo: this is non-secure!
    bz.cols.hashes.allow({
      insert: function () {
        return true;
      },
      remove: function(){
        return true;
      }
    });
  //}
}