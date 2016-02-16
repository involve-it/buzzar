var data = bz.help.makeNamespace('bz.runtime.editPost');

Template.pagePostsEdit.rendered = function () {
  TrackNewPostTypeChange('js-new-post-placeholder', this.data);
  bz.ui.initCodeMirror($('.js-post-description'));
};

Template.pagePostsEdit.created = function () {
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
  FillPostData(this.data);
};
Template.pagePostsEdit.helpers({
});
Template.pagePostsEdit.events({
  'click .js-edit-post': function (e, v) {
    var res = true;
    e.preventDefault();
    validatePostsNewPage(v).then((ret)=>{
      if(ret.res){
        !!ret.msg.length && bz.ui.alert(ret.msg.join('; '));
        SavePostFromView(v, v.data);
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
      msg.push('Please select at least one location');
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
      msg.push('Some fields did not pass validation');
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