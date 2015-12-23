var data = bz.help.makeNamespace('bz.runtime.newPost');
Template.postsNew.rendered = function () {
  trackNewPostTypeChange('js-new-post-placeholder');
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

    if(validatePostsNewPage(v)){
      res = res && true;
    }
    
    if(res){
      createNewPostFromView(v);
    }
  }
});


// HELPERS:
function validatePostsNewPage (v){
  
  // 1. add abide event listeners:
  
  //var form = $('[data-abide]');
  var form = v.$('#myform');
  form.submit();
  
        form.on('invalid.fndtn.abide', function () {
          var invalid_fields = $(this).find('[data-invalid]');
          console.log(invalid_fields);
          return res = false;
        });

  
  
  // 2. submit abide forms to trigger validation:
  /*if (!v.$('.js-post-title').val()) {
   alert('Title can not be empty');
   res = false;
   }*/

  if (!Session.get(bz.const.posts.location1) && !Session.get(bz.const.posts.location2)) {
    alert('Please select at least one location');
    res = false;
  }

  
  // 3. remove event listeners:
}