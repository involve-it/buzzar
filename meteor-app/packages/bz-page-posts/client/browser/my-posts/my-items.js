/**
 * Created by douson on 24.08.15.
 */

Template.myItems.onCreated(function () {
  //return Meteor.subscribe('posts-images');
});


Template.onePostRowItem.rendered = function() {
  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });
};

Template.myItems.helpers({
  posts: function () {
    //debugger;
    var posts = bz.cols.posts.find({userId: Meteor.userId()}).fetch();
    return posts.length !== 0;
  },
  activePosts: function () {
    //debugger;
    var posts = bz.cols.posts.find({userId: Meteor.userId()}).fetch();
    return posts;
  },
  inactivePosts: function () {
    var posts = bz.cols.posts.find({userId: Meteor.userId()}).fetch();
    return posts;
  }
});

Template.onePostRowItem.helpers({
  getPhotoUrl: function () {
    var photo = bz.cols.posts.findOne({_id: this._id}),
      photoId = photo.details.photos && photo.details.photos[0] || undefined;

    if (photoId) {
      var image = bz.cols.images.findOne({_id: photoId});
    }

    return image;

  },
  getPrice: function () {},
  categoryType: function() {
    return bz.cols.posts.find({_id: this._id}).fetch()[0].type;
  },
  getAvatarImg: function () {
    var ret ='';

    console.log(Meteor.users.findOne(this.userId));
    
    if(this.userId && Meteor.users.findOne(this.userId) && Meteor.users.findOne(this.userId).profile.image) {
      return ret = Meteor.users.findOne(this.userId).profile.image;
    } else {
      return '/img/content/avatars/avatar-no.png';
    }
  },
  getUserName: function() {
    var ret = '';
    if(this.userId && Meteor.users.findOne(this.userId)) {
      ret = Meteor.users.findOne(this.userId).username.toCapitalCase();
    }
    return ret;
  }
});








