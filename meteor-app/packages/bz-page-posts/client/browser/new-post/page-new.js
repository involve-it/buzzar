var data = bz.help.makeNamespace('bz.runtime.newPost');
Template.postsNew.created = function () {
  this.data ? _.extend(this.data, data) : _.extend({}, data);

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
Template.postsNew.events({
  'click .js-create-post': function (e, v) {
    createNewPostFromView(v);
  }
});
