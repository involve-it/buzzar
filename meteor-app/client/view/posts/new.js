Template.postsNew.created = function(){
  var data = o.runtime.newPost = {}

  this.data ? _.extend(this.data, data) : _.extend({}, data);
}
Template.postsNew.events({
  'click .js-scan-url': function (e, v) {
    // scan is done:
    v.$('.js-post-details-link').removeClass('disabled');
  },
  'keydown .original-url': function(e, v){
    if(e.keyCode === 13 && e.target.value.trim() !== '') {
      v.$('.js-scan-url').click();
    }
  }
});
