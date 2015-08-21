Template.postsNewUrl.created = function(){
}
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
    Meteor.call('parseUrl', 'http://sfbay.craigslist.org/eby/msg/5184098353.html', function(err, res) {
      // async scan is done:
      if(res ) {
        if (res.title){
          Session.set('post-title', res.title);
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