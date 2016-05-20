Template.bzPostDetails.events({});

Template.bzPostDetails.helpers({
  getPostCreatedDate: function () {
    var ret = '';
    var options = {
     // era: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
     //timezone: 'UTC',
      //hour: 'numeric',
     // minute: 'numeric',
     // second: 'numeric'-->
    };
    if (this.timestamp) {
      ret = new Date(this.timestamp).toLocaleDateString( Session.get("bz.user.language"), options);
    }
    return ret;
  },
  postLikes: function() {
    return this.social && this.social.likes && this.social.likes.length || '-';
  }
  
  /* OLD CODE */
  /*categoryType: function() {
    //console.info(this);
    return bz.cols.posts.find({_id: this._id}).fetch()[0].type;
  }*/
});



Template.bzSocialButtons.events({
  'click .js-like-btn': function(e) {
    var el = $(e.target);
    var res = LikePostByUser(this._id);
  }
});

Template.bzSocialButtons.helpers({
  isLikedByUser: function(){
    return PostIsLikedByCurrentUser();
  },
  disabledIfIsBelongingToCurrentUser: function() {
    var postOwnerId = this._id;
    /* if user logged & yet not clicked into liked */
    //if(PostIsLikedByCurrentUser()) {

    if(PostBelongsToUser(postOwnerId)) {
      return 'disabled';
      //return '';
    } else {
      return '';
    }
  }
});


Template.postRatingInfo.events({
  'click.raty .js-rating': function(e,v){
    var curRate = $('.js-rating').raty('score');
    var res = RatePostByUser(this._id, curRate);

  }
})
Template.postRatingInfo.rendered = function() {
  /*init Rate*/
  var rating = GetPostRating();

  $('.js-rating').raty({
    starType: 'i',
    number: 5,
    numberMax: 5,
    score: rating
  });
};

Template.postRatingInfo.helpers({
  noReviews: function(){
    var r = GetPostRating();
    return !r;
  }
});


Template.postDetailsHashesControl.helpers({
  getHashes: function () {
    var hash = this.details.hash;
    return hash;
  }
});
Template.postDetailsDetailsCommon.events({
  'click .js-show-location-on-map': function(e, v){
    // show modal with map here:
    var coords = this.coords.lat + ', ' + this.coords.lng;
    //prompt('coords: ', coords);
    console.log('coords: ' + coords);
  }
});

Meteor.startup(function () {
  bz.ui.initMarked();
});

/* OLD CODE */
/*Template.postDetailsDetailsCommon.onCreated(function () {
  this.getPostData = new ReactiveVar(false);
});*/

Template.postDetailsDetailsCommon.helpers({
  getGoogleMapsHref: function(){
    var lat = this.coords.lat, lon = this.coords.lng;
    return `http://maps.google.com/maps?z=12&t=m&q=loc:${ lat }+${ lon }`;
  }
  
  /* OLD CODE */
  /*getPost: function() {
    var ins = Template.instance(), postId = Router.current().params._id;
    
    if (ins.getPostData.get() === false) {
      Meteor.call('getPost', postId, function(e, r) {
        if(r.success && r.result) {
          ins.getPostData.set(r.result);
        }
      });
    }

    return ins.getPostData.get();
  },
  getTitle: function () {
    return this.details.title;
  },
  getDescription: function () {
    return this.details.description;
  },
  getMyLocations: function () {
    return this.details.locations;
  }*/
  
});

Template.postDetailsPhoto.onRendered(function () {
  if (this.data.details.photos) {
    Session.set('postDetailsImgSrc', this.data.details.photos[0]);
  }
  $(document).foundation();
  $(document).foundation('clearing', 'reflow');
});

Template.postDetailsPhoto.events({
  'click .js-main-photo-large': function(e, v){
    v.$('.js-clearing-thumbs li:first-child a').click();
  }
});

Template.postDetailsPhoto.helpers({
  /*getImageSrc: function () {
   var ret = '/img/content/avatars/avatar-no.png';
   return Session.get('postDetailsImgSrc') || ret;
   },*/
  getPhotoUrl: function () {
    /*var ret = '/img/content/avatars/avatar-no.png';*/
    var photoId = Session.get('postDetailsImgSrc');

    if (photoId) {
      //ret = bz.cols.images.findOne({_id: photoId}).data;
    } else {
      return false;
    }
    /*return ret;*/

  },
  getPhotos: function(){
    bz.cols.images.find({}); // <- for reactiveness
    //bz.cols.images.find({_id: {$in: this.details.photos}}); // <- for reactiveness
    var ret = getPostPhotoObjectsByIds(this.details.photos);
    return ret;
  },
  getMainPhoto: function(){
    var ret = {
        data: '../img/content/no-photo.png'
      },
      main, photos = getPostPhotoObjectsByIds(this.details.photos);
    if (photos) {
      main = _.filter(photos, function(item){
        return item && item.isMain === true;
      });
      if (main && main.length > 0){
        ret = main[0];
      } else if(photos && photos[0]) {
        ret = photos[0];
      }
    }
    return ret.data;
  },
  moreThanOnePhotos: function(){
    var ret = false,
      photos = getPostPhotoObjectsByIds(this.details.photos);
    if (!photos || photos.length < 2){
      ret = false;
    } else {
      ret = true;
    }
    return ret;
  }
});

// HELPERS:PostDetails
/*function setTemplate(name, v) {
 $('.js-post-details-categorized').empty();
 Blaze.renderWithData(Template['postDetails' + name], v.data, $('.js-post-details-categorized')[0]);
 }*/

function setPostDetailsTemplate(name, v) {
  $('.js-post-details-categorized').empty();
  Blaze.renderWithData(Template['postDetailsDetails' + name], v.data, $('.js-post-details-categorized')[0]);
}