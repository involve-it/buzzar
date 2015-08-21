var data = bz.help.makeNamespace('bz.runtime.newPost');
Template.postsNew.created = function(){
  this.data ? _.extend(this.data, data) : _.extend({}, data);

  //temp
  Meteor.call('parseUrl', 'http://sacramento.craigslist.org/tag/5171787559.html', function(error, response){
    if (response.success) {
      console.log('success\ntitle: ' + response.title + '\nurl: ' + response.imageUrl + '\ncontent: ' + response.content);
    } else {
      console.log('failed');
    }
  });

};
Template.postsNew.events({

});
