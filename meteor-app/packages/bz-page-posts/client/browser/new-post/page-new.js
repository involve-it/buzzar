var data = bz.help.makeNamespace('bz.runtime.newPost');


Template.postsNew.rendered = function () {
  TrackNewPostTypeChange('js-new-post-placeholder');
  var view = this,
      input = view.$('.js-post-description');
  
  setTimeout(function(){
    // let's lazy-load code mirror plugin:
    bz.ui.initCodeMirror($('.js-post-description'));
  }, 100);
};


Template.postsNew.created = function () {
  this.data ? _.extend(this.data, data) : _.extend({}, data);
  //$('.js-new-post-placeholder').append();
  //temp
  /*Meteor.call('parseUrl', 'https://en.wikipedia.org/wiki/NASA', function(error, response){
   if (response.success) {
   console.log('success\ntitle: ' + response.title + '\nurl: ' + response.imageUrl + '\ncontent: ' + response.content);
   } else {
   console.log('failed');
   }
   });*/
  clearPostData();
};
Template.postsNew.helpers({
  isNotGenericForm: function(){
    return newPostType.get() !== undefined;
  }
});
Template.postsNew.events({
  'click .js-create-post': function (e, v) {
    var res = true;
    e.preventDefault();
    validatePostsNewPage(v).then((ret)=>{
      if(ret.res){
        !!ret.msg.length && bz.ui.alert(ret.msg.join('; '));
        CreateNewPostFromView(v);
      } else {
        bz.ui.error(ret.msg.join('; '));
      }
    });
  },
  'submit form[data-abide]': function(e,v){
    e.preventDefault();
  }
});


// HELPERS:
function validatePostsNewPage (v){
  return new Promise((resolve, reject) => {
    var ret = true, msg = [];
    // 0. synchronous validation:
    if (!Session.get(bz.const.posts.location1) && !Session.get(bz.const.posts.location2)) {
      if (Session.get("bz.user.language")=='ru'){
        msg.push('Пожалуйста, выберите хотя бы одно местоположение');
      }
      else {
        msg.push('Please select at least one location');
      }
      ret = false;
    }

    // 1. add abide event listeners:
    $('form[data-abide]').on('valid.fndtn.abide', function () {
      // Handle the submission of the form
      resolve({
        res: true && ret,
        msg: msg
      });
    });
    $('form[data-abide]').on('invalid.fndtn.abide', function () {
      // Handle the submission of the form
      if (Session.get("bz.user.language")=='ru'){
        msg.push('Некоторые поля не прошли проверку');
      }
      else {
        msg.push('Some fields did not pass validation');
      }
      resolve({
        res: false,
        msg: msg
      });
    });
    // 2. submit abide forms to trigger validation:
    $('form[data-abide]').submit();

    // 3. remove event listeners:
    $('form[data-abide]').off('valid.fndtn.abide');
    $('form[data-abide]').off('invalid.fndtn.abide');
  });
}