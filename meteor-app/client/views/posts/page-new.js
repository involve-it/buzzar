Template.postsNew.created = function(){
  var data = bz.runtime.newPost = {}

  this.data ? _.extend(this.data, data) : _.extend({}, data);
}
Template.postsNew.events({

});
