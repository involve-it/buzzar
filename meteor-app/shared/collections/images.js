/**
 * Created by arutu_000 on 2/14/2016.
 */

bz.cols.images = new Mongo.Collection('images');
bz.cols.images.helpers({
  _getThumbnail: function(){
    debugger;
  }
});
if(Meteor.isServer){
  bz.cols.images.allow({
    insert: function () {
      return true;
    },
    update: function(userId, doc, fieldNames, modifier){
      //todo: check security (http://docs.meteor.com/#/full/allow)
      return true;
    }
  });
}