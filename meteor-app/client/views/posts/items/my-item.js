/**
 * Created by douson on 24.08.15.
 */

Template.myItems.onCreated(function() {
  return Meteor.subscribe('posts-images');
});


Template.myItems.helpers({
    posts: function() {
        var posts = bz.cols.posts.find({userId: Meteor.userId()}).fetch();
        return posts;
    }
});

Template.oneItem.helpers({
    getPhotoUrl: function() {
        var photo = bz.cols.posts.findOne({_id: this._id}),
            photoId = photo.details.photos[0];
        
        if(photoId) {
            var image = bz.cols.images.findOne({_id: photoId});
        }
        
        return image;
        
    },
    getPrice: function() {
        
    }
});








