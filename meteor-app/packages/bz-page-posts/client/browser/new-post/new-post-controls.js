Template.postsNewForm.events({});
Template.postTypeSelect.helpers({
  getSiteTypes: function () {
    return bz.cols.siteTypes.find();
  }
});
Template.postTypeSelect.events({
  'change .js-post-type-select': function (e, v) {
    var name = e.target.value.toCapitalCase();
    setPostDetailsTemplate(name, v);
  }
});
Template.postTypeSelect.rendered = function () {
  var name = this.$('.js-post-type-select').val().toCapitalCase();
  setPostDetailsTemplate(name, this);
}

Template.postHashesControl.destroyed = function () {
  $('[data-action="buttonTapped"]').off();
}
Template.postHashesControl.helpers({
  getHashes: function () {
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
    $('[data-action="buttonTapped"]').click(function (e) {
      var inpVal = $('input[name=prompt]').val();
      if ($(e.target).data().index === 0 && inpVal && inpVal.trim() !== '') {
        Session.set('hashes', inpVal.trim().split(' '));
      }
    });
  }
});
Template.postDetailsCommon.helpers({
  getTitle: function () {
    return Session.get('post-title') || '';
  },
  getDescription: function () {
    return Session.get('post-description') || '';
  }
});
//$('.backdrop.visible.active .popup .popup-title').text().toLowerCase()

Template.postDetailsTrade.helpers({
  getPrice: function () {
    return Session.get('post-price') || '';
  }
});

Template.postPhotoUpload.onCreated(function(){
 Tracker.autorun(function(){
   $('.js-preview').attr('src', Session.get('bz.posts.postImgSrc'));
 })
});
Template.postPhotoUpload.helpers({
  getImageSrc: function () {
    var ret = '/img/content/avatars/avatar-no.png';
    return Session.get('bz.posts.postImgSrc') || ret;
  }
});
Template.postPhotoUpload.events({
  'click .js-edit-avatar': function (event, template) {
    $('.js-avatar-upload-modal').foundation('reveal', 'open');
  },
  'click .js-plus-img': function(e,v){
    $('.js-avatar-upload-modal').foundation('reveal', 'open');
  }
});
Template.uploadImageModal.events({
  'click .js-photo-library': function (e, v) {
    var options = {
      width: 350,
      height: 350,
      quality: 75
    }
    if (typeof Camera !== 'undefined') {

      options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
      MeteorCamera.getPicture(options, function (err, data) {
        if (err) {
          console.log('error', err);
        }
        if (data) {
          Session.set('bz.posts.postImgSrc', data)
        }
      });

    } else {
      $('.js-library-not-available-alert').show();
    }
  },
  'click .js-take-photo': function (e, v) {
    //$('.js-avatar-upload-modal').foundation('reveal', 'close');

    var options = {
      width: 350,
      height: 350,
      quality: 75
    }

    MeteorCamera.getPicture(options, function (err, data) {
      if (err) {
        console.log('error', err);
      }
      if (data) {
        Session.set('bz.posts.postImgSrc', data)
      }
    });
  },
  'click .js-use-image-url': function (e, v) {
    if ($('.js-image-url').val()) {
      Session.set('bz.posts.postImgSrc', $('.js-image-url').val());
    }
  },
  'click .js-use-random-image-url': function (e, v) {
    var imgData,
        randomImgUrl = bz.const.randomImageSite + '?ts=' +  Date.now();

    getDataFromImgUrl(randomImgUrl, 400, 300, function(imgData){
      Session.set('bz.posts.postImgSrc', imgData);
    });
  },
  'click .js-ok-btn': function(){
    $('.js-avatar-upload-modal').foundation('reveal', 'close');
  }
});
// HELPERS:
function getDataFromImgUrl(url, w, h, cb){
  var img, canvas, ctx, ret;
  var img = $('#asdf')[0];
  img.setAttribute('crossOrigin', 'anonymous');
  canvas = document.createElement('canvas');

  ctx = canvas.getContext("2d");
  img.onload = function () {
    canvas.width = img.offsetWidth;
    canvas.height = img.offsetHeight;
    ctx.drawImage(img, 0, 0);
    ret = canvas.toDataURL();
    cb.call(this, ret);
  }
  img.src = url;


  return ret;
}
function setPostDetailsTemplate(name, v) {
  $('.js-post-details-categorized').empty();
  Blaze.renderWithData(Template['postDetails' + name], v.data, $('.js-post-details-categorized')[0]);
}
// set new image to db:
Meteor.startup(function () {

  Tracker.autorun(function () {
    bz.runtime.newPost.postImage = Session.get('bz.posts.postImgSrc');
    bz.runtime.newPost.hashes = Session.get('hashes');
  });
});

