/**
 * Created by Ashot on 9/26/15.
 */
Template.bzControlReviews.onCreated(function(){
});
Template.bzControlReviews.events({

});
Template.bzControlReviews.helpers({
  getReviews: function(){
    return bz.cols.reviews.find({type: 'postType', entityId: this.postId}, { sort: { dateTime: -1}});
  },
  getCountsReviews: function() {
    var counts = bz.cols.reviews.find({type: 'postType', entityId: this.postId}).count();
    return counts || '';
  }
});
Template.bzControlReviewItem.helpers({
  getTime: function(){
    var d = new Date(this.dateTime);
    return d.toLocaleString();
  },
  getProfileImage: function(){
    var user = Meteor.users.findOne(this.userId);
    return user && user._getAvatarImage();
  }
});
Template.bzControlAddReview.onCreated(function(){
  //this.data.postId = this.data.toString();
});
Template.bzControlAddReview.onRendered(function(){
  $('.js-rating-select').foundationSelect();
});
Template.bzControlAddReview.events({
  'click .js-post-btn': function(e, v){
    var text = $('.js-post-text-input').val(),
        userId = Meteor.userId(),
        postId = this.postId,
        rating = $('.js-rating-select').val();
    if(!userId){
      // todo: after login the process should be continued
      /*var loginFunc = accountsClientOrServer.onLogin(function(){

      });*/
      if(confirm('please login to leave comments')){
        Router.signIn(true);
      }
    } else {
      if(text.trim() && postId){
        bz.cols.reviews.insert({
          entityId: postId,
          type: 'postType',
          user: Meteor.user(),
          userId: Meteor.userId(),
          text: text.trim(),
          rating: rating || undefined,
          dateTime: Date.now()
        });
        $('.js-post-text-input').val('');
      }
    }


  }
})