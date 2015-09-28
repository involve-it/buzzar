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
Template.postDetailsHelp.events({
  'click .panel': function(e,v){
    $(e.target).closest('.panel').toggleClass('callout');
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

