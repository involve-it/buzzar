
Template.postDetailsHashesControl.helpers({
  getHashes: function(){
    var hash = this.details.hash;
    return hash;
  }
});
Template.postDetailsDetailsCommon.helpers({
  getTitle: function(){
    return this.details.title;
  },
  getDescription: function(){
    return this.details.description || '';
  }
});
//$('.backdrop.visible.active .popup .popup-title').text().toLowerCase()


Template.postDetailsPhoto.helpers({
  /*getImageSrc: function () {
    var ret = '/img/content/avatars/avatar-no.png';
    return Session.get('postDetailsImgSrc') || ret;
  },*/
  getPhotoUrl: function() {
    var ret = '/img/content/avatars/avatar-no.png';
    var photoId = Session.get('postDetailsImgSrc');

    if(photoId) {
      //ret = bz.cols.images.findOne({_id: photoId}).data;
    } else {
    }

    return ret;
  },
});
Template.postDetailsPhoto.onRendered(function(){
  if(this.data.details.photos) {
    Session.set('postDetailsImgSrc', this.data.details.photos[0]);
  }
  $(document).foundation();
  $(document).foundation('clearing', 'reflow');
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

     Template.bzAroundYouItem.helpers({

     })