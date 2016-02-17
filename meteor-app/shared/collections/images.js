/**
 * Created by arutu_000 on 2/14/2016.
 */

bz.cols.images = new Mongo.Collection('images');
bz.cols.images.helpers({
  _getThumbnailUrl: function(){
    var image = this;

    // try to get thumb:
    if(image) {
      if(image.thumbnail && typeof image.thumbnail === 'string'){
        image = image.thumbnail;
      } else if(image.thumbnail && image.thumbnail.src) {
        image = image.thumbnail.src
      } else if(image.data){
        image = image.data
      } else {
        image = '/img/content/no-photo.png';
      }
    }
    return image;
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