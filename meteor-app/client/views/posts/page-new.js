var data = bz.help.makeNamespace('bz.runtime.newPost');
Template.postsNew.created = function(){
  this.data ? _.extend(this.data, data) : _.extend({}, data);
}
Template.postsNew.events({

});
