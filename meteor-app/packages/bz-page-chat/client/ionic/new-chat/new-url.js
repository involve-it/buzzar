Template.postsNewUrl.created = function(){
};
Template.postsNewUrl.events({
  'keydown .js-original-url': function(e,v){
    var url = e.target.value;
    if(e.keyCode === 13 &&  url!== '' && isUrl(url)) {
      v.$('.js-post-details-link').click();
      //v.$('.js-scan-url').click();
    } else {
      /*CONSOLE CLEAR
      console.log('keydown');
      */
      if(isUrl(url)) {
        v.$('.js-post-details-link').removeClass('disabled');
      }
    }
  },
  'paste .js-original-url': function(e,v){
    var pastedText = getClipBoardDataFromEvent(e);
    if(isUrl(pastedText)) {
      v.$('.js-post-details-link').removeClass('disabled');
    }
  },
  'blur .js-original-url': function(e,v){
    var url = e.target.value;
    if(isUrl(url)) {
      v.$('.js-post-details-link').removeClass('disabled');
    }
  },
  'click .js-post-details-link': function (e, v) {
    Meteor.call('parseUrl', v.$('.js-original-url').val(), function(err, res) {
      // async scan is done:
      if(res && res.success) {
        if (res.title){
          Session.set('post-title', res.title);
        }
        if (res.content){
          Session.set('post-description', res.content);
        }
        if (res.imageUrl){
          Session.set('bz.posts.postImgSrc', res.imageUrl);
        }
      }
      v.$('.js-post-details-link').removeClass('disabled');
    })

  }
});
Template.parsedPostDetailsModal.helpers({
  getTitle: function() {
    return Session.get('post-title');
  }
})
// HELPERS:
function isUrl(str){
  var ret = false;
  if(ret !== '') {
    var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
    ret = urlRegEx.test(str);
  }
  return ret;
}
function getClipBoardDataFromEvent(e){
  var pastedText;

  if (window.clipboardData && window.clipboardData.getData) { // IE
    pastedText = window.clipboardData.getData('Text');
  } else if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
    pastedText = e.originalEvent.clipboardData.getData('text/plain');
  } else if (window.event && window.event.clipboardData && window.event.clipboardData.getData) {
    pastedText = window.event.clipboardData.getData('text/plain');
  }
  return pastedText;
}