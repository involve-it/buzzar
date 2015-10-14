Template.bzPostDetails.events({});
Template.bzPostDetails.helpers({
  getPostCreatedDate: function () {
    var ret = '';
    if (this.timestamp) {
      ret = new Date(this.timestamp).toDateString();
    }
    return ret;
  }
})


Template.postDetailsHashesControl.helpers({
  getHashes: function () {
    var hash = this.details.hash;
    return hash;
  }
});
Template.postDetailsDetailsCommon.events({
  'click .js-show-location-on-map': function(e, v){
    debugger;
    // show modal with map here:

  }
})
Template.postDetailsDetailsCommon.helpers({
  getTitle: function () {
    return this.details.title;
  },
  getDescription: function () {
    return this.details.description || '';
  },
  getMyLocations: function () {
    return this.details.locations;
  }
});
//$('.backdrop.visible.active .popup .popup-title').text().toLowerCase()

Template.postDetailsPhoto.onCreated(function () {
  var photos = this.data.details.photos, ret = [];
  _.each(photos, function(id){
    ret.push(bz.cols.images.findOne(id));
  });
  this.data._photos = ret;
});
Template.postDetailsPhoto.onRendered(function () {
  if (this.data.details.photos) {
    Session.set('postDetailsImgSrc', this.data.details.photos[0]);
  }
  $(document).foundation();
  $(document).foundation('clearing', 'reflow');
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
    var ret = this._photos;
    return ret;
  },
  getMainPhoto: function(){
    var ret = '../img/content/no-photo.png', main;
    if (this._photos) {
      main = _.filter(this._photos, function(item){
        return item.isMain === true;
      });
      if (main && main.length > 0){
        ret = main[0];
      } else {
        ret = this._photos[0];
      }
    }
    return ret.data;
  },
  moreThanOnePhotos: function(){
    var ret = false;
    if (!this._photos || this._photos.length < 2){
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
// set new image to db:
Meteor.startup(function () {
});

Template.bzAroundYouItem.helpers({})