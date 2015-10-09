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

};
Template.postsNew.events({
  'click .js-create-post': function (e, v) {
    debugger;
    var userId = Meteor.userId(), imgId, imgArr = [], locationsArr = [],
        locDef = $.Deferred(),
        rad = $('.js-radius-slider').attr('data-slider') && Number.parseInt($('.js-radius-slider').attr('data-slider'));

    // gather all data and submit for post-create:
    if (userId) {

      if (bz.runtime.newPost.postImage) {
        imgId = bz.cols.images.insert({
          data: bz.runtime.newPost.postImage,
          userId: userId
        });
        imgArr.push(imgId);
      }
      ;
      // set location:
      if (bz.runtime.newPost.location && bz.runtime.newPost.location.current) {
        bz.help.maps.getCurrentLocation(function (loc) {
          locationsArr.push({
            coords: loc,
            type: bz.const.posts.location.type.STATIC
          });
          locDef.resolve();
        });
      } else {
        locDef.resolve();
      }
      debugger;
      var newPost = {

        userId: userId,
        type: v.$('.js-post-type-select').val(),
        details: {

          hashes: bz.runtime.newPost.hashes,
          //location: bz.runtime.newPost.location,
          locations: locationsArr,
          radius: rad,
          url: v.$('.js-original-url').val(),

          //details:
          title: v.$('.js-post-title').val(),
          description: v.$('.js-post-description').val(),
          price: v.$('.js-post-price').val(),
          photos: imgArr,

          // specific:
          other: {
            whatHappened: v.$('.js-charity-type-select').val()    //?
          }
        },
        status: {
          visible: bz.const.posts.status.VISIBLE
        }
      }

      $.when(locDef).then(function () {
        Meteor.call('addNewPost', newPost, function (err, res) {
          if (!err && res && res !== '') {
            cleanPostData();
            bz.runtime.newPost.postId = res;
            Router.go('/posts/my');
          }
        });
      });
    }
  }
});

//HELPERS:

function cleanPostData() {

}