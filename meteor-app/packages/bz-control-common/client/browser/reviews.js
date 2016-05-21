/**
 * Created by Ashot on 9/26/15.
 */

Template.bzControlReviews.onCreated(function() {
  this.getCommentsData = new ReactiveVar(false);
});

Template.bzControlReviews.helpers({
  getComments: function() {
    var request = {}, ins = Template.instance();
    request.postId = this.postId;
    
    if(request && this.postId) {
      
      if (ins.getCommentsData.get() === false) {
        
        Meteor.call('getComments', request, function(e, r) {
          
          console.info(r);
          
          if(e) {
            //error
          } else if(r.success && r.result) {
            ins.getCommentsData.set(r.result);
          } else {
            bz.ui.alert('Error ID: ' + r.error.errorId, {type:'error', timeout: 2000});
          }
        });
        
      }
      
    }
    console.info(ins.getCommentsData.get());
    return ins.getCommentsData.get();
  }
  
  /* OLD CODE */
  /*getReviews: function(){
    return bz.cols.reviews.find({type: 'postType', entityId: this.postId}, { sort: { dateTime: 1}});
  },
  getCountsReviews: function() {
    var counts = bz.cols.reviews.find({type: 'postType', entityId: this.postId}).count();
    return counts || '';
  }*/
});

Template.bzControlReviewItem.events({
  'click .js-delete-comment': function(e, v){
    if(Meteor.userId() === v.data.userId){
      bz.cols.reviews.remove(v.data._id);
    }
  }
});

Template.bzControlReviewItem.helpers({
  getTime: function(){
    var date = new Date(this.dateTime);
    return date && date.toLocaleString();
  },
  isUserCommentOwner: function(e, v){
    return Meteor.userId() === this.user._id;
  }
  /* OLD CODE */
  /*
  getProfileImage: function(){
    var user = Meteor.users.findOne(this.userId);
    return user && user._getAvatarImage();
  }*/
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
      bz.ui.validateFoundationForm().done(function(res) {
        if(res.isValid){
          if(text.trim() && postId){
            bz.cols.reviews.insert({
              entityId: postId,
              type: 'postType',
              user: {
                _id: Meteor.user()._id,
                username:  Meteor.user().username,
                profile:
              {
                image:  Meteor.user().profile.image
              }
              },
              userId: Meteor.userId(),
              text: text.trim(),
              dateTime: Date.now()
            });
            $('.js-post-text-input').val('');
          }
        } else {
          bz.ui.error(res.errorMessages);
        }
      });

    }
  }
});