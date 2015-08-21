Template.postsNewUrl.created = function(){
};
Template.postsNewUrl.events({
  'keydown .js-original-url': function(e,v){
    var url = e.target.value;
    if(e.keyCode === 13 &&  url!== '' && isUrl(url)) {
      v.$('.js-scan-url').click();
    }
  },
  'blur .js-original-url': function(e,v){
    var url = e.target.value;
    if(e.target.value !== '' && isUrl(url)) {
      v.$('.js-scan-url').click();
    }
  },
  'click .js-scan-url': function (e, v) {
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
          Session.set('postImgSrc', res.imageUrl);
        }
      }
      v.$('.js-post-details-link').removeClass('disabled');
    })

  }
});

// HELPERS:
function isUrl(str){
  var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
  return urlRegEx.test(str);
}