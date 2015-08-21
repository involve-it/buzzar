Template.postTypeSelect.helpers({
  getSiteTypes: function () {
    return bz.cols.siteTypes.find();
  }
});
Template.postTypeSelect.events({
  'change .js-post-type-select': function (e, v) {
    var name = e.target.value.toCapitalCase();
    setPostDetailsTemplate(name, v);
  },

});
Template.postTypeSelect.rendered = function () {
  var name = this.$('.js-post-type-select').val().toCapitalCase();
  setPostDetailsTemplate(name, this);
}

Template.postHashesControl.destroyed = function(){
  $('[data-action="buttonTapped"]').off();
}
Template.postHashesControl.helpers({
  getHashes: function(){
    var arr = Session.get('hashes') || [];
    return arr.join(', ');
  }
})
Template.postHashesControl.events({
  'click [data-action="showPrompt"]': function (o, t) {
    a = IonPopup.prompt({
      title: "Hashes",
      template: "Please enter hashes, separated by space",
      okText: "Submit",
      inputType: "text",
      text: 'IonPopup',
      inputPlaceholder: "Your Hashes"
      //js-hashes-holder
    });
    $('[data-action="buttonTapped"]').click(function(e){
      var inpVal = $('input[name=prompt]').val();
      if ($(e.target).data().index === 0 && inpVal && inpVal.trim() !== '') {
        Session.set('hashes', inpVal.trim().split(' ')) ;
      }
    });
  }
});

//$('.backdrop.visible.active .popup .popup-title').text().toLowerCase()
Template.postPhotoUpload.helpers({
  getImageSrc: function () {
    var ret = '/img/content/avatars/avatar-no.png';
    return Session.get('postImgSrc') || ret;
  }
})
Template.postPhotoUpload.events({
  'click [data-action=edit-avatar]': function (event, template) {
    IonActionSheet.show({
      titleText: 'Edit picture',
      buttons: [
        {text: 'Photo Library'},
        {text: 'Take Photo'}
      ],
      cancelText: 'Cancel',
      cancel: function (res) {
      },
      buttonClicked: function (index, res) {
        var options = {
          width: 350,
          height: 350,
          quality: 75
        }
        if (index === 0 && typeof Camera !== 'undefined') {
          options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
          MeteorCamera.getPicture(options, function (err, data) {
            if (err) {
              console.log('error', err);
            }
            if (data) {
              Session.set('postImgSrc', data)
            }
          });
        } else if (index === 1) {
          MeteorCamera.getPicture(options, function (err, data) {
            if (err) {
              console.log('error', err);
            }
            if (data) {
              Session.set('postImgSrc', data)
            }
          });
        }
        return true;
      }
    });
  }
});
// HELPERS:
function setPostDetailsTemplate(name, v) {
  $('.js-post-details-categorized').empty();
  Blaze.renderWithData(Template['postDetails' + name], v.data, $('.js-post-details-categorized')[0]);
}

// set new image to db:
Meteor.startup(function () {

  Tracker.autorun(function () {
    bz.runtime.newPost.postImage =  Session.get('postImgSrc');
    bz.runtime.newPost.hashes =     Session.get('hashes');
  });
});

