var data = bz.help.makeNamespace('bz.runtime.newPost');
Template.postsNew.created = function(){
  this.data ? _.extend(this.data, data) : _.extend({}, data);

  //temp
  /*Meteor.call('parseUrl', 'http://sacramento.craigslist.org/tag/5171787559.html', function(error, response){
    if (response.success) {
      console.log('success\ntitle: ' + response.title + '\nurl: ' + response.imageUrl + '\ncontent: ' + response.content);
    } else {
      console.log('failed');
    }
  });*/

};
Template.postsNew.events({
   'click .js-create-post': function(e, v) {
     var userId = Meteor.userId(), imgId;
     // gather all data and submit for post-create:
     if(userId) {
       if(bz.runtime.newPost.postImage) {
         imgId = bz.cols.images.insert({
           data: bz.runtime.newPost.postImage,
           userId: userId
         });
       }
       var newPost = {

         userId: userId,
         details: {
           type: v.$('.js-post-type-select').val(),
           hashes: bz.runtime.newPost.hashes,
           location: bz.runtime.newPost.location,
           url: v.$('.js-original-url').val(),
           //details:
           title: v.$('.js-post-title').val(),
           description: v.$('.js-post-description').val(),
           photos: [imgId],
           // specific:
           other: {
             whatHappened: v.$('.js-charity-type-select').val()    //?
           }
         },
         status: {
           visible: bz.const.posts.status.VISIBLE
         }
       }
     }
     bz.cols.posts.insert(newPost);
   }
});
