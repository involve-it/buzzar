/**
 * Created by xvolkx48 on 02.06.2016.
 */

/* OLD CODE */
/*Meteor.publish('comments', function(postId){
  check(postId, String);
  
  var post, time, fields, ret, newComments;
  fields={
    _id: 1,
    text: 1,
    userId: 1,
    dateTime: 1
  };
  
  time = Date.now()- 5000;
  post = bz.cols.posts.findOne({_id:postId});
  
  /!*if(post){
    newComments = bz.cols.reviews.find({entityId:postId, dateTime: {$gte: time}},{fields: fields});
    ret=newComments;
  }else{
    ret=[];
  }
  return ret;*!/

  if(post){
    return [
        bz.cols.reviews.find({entityId:postId, dateTime: {$gte: time}},{fields: fields}),
        Meteor.users.find({_id: 'ZiEnFPeDzfxE3xmfN'})
    ]
  }

  return this.ready();
  
});*/

/* USEGE to Notification */
Meteor.publish('comments-my', function(){
  var ret, currentUser, time, postsMy, newComments, fields;
  fields={
    _id: 1,
    text: 1,
    userId: 1,
    dateTime: 1
  };
  currentUser=Meteor.userId();
  if(currentUser){
    time = Date.now() - 5000;
    postsMy = _.map(bz.cols.posts.find({userId: currentUser}).fetch(), function (item) {
      return item._id
    });
    newComments = bz.cols.reviews.find({entityId: {$in: postsMy}, dateTime: {$gte: time}}, {fields: fields});
    ret=newComments;
  }else{
    ret=[];
  }
  return ret;
});


Meteor.publish('comments', function(postId) {
  //check(postId, String);
  
  var subscribe = this,
      reviewsFields = {},
      handler = [],
      time = Date.now()- 5000,
      comments = null;

  reviewsFields = {_id:1, text:1, dateTime:1, userId:1};

  function publishUserData(userId){
    var user = {}, userDoc, userFields = {_id:1, username:1, profile:1};
    userDoc = Meteor.users.findOne({_id:userId}, {fields: userFields});
    //handler[userId] = Meteor.Collection._publishCursor(userCursor, subscribe, 'users');
    //console.log('Inside publishUserData, for the current user (Id=' + userId + ') comment count is: ', Meteor.users.find({_id:userId}, {fields: userFields}).fetch());
    
    //Create new user object
    user._id = userDoc._id;
    user.username = userDoc.username;
    user.image = userDoc.profile.image;
    
    return user;
  }

  comments = bz.cols.reviews.find({entityId:postId, dateTime: {$gte: time}}, {fields: reviewsFields}).observeChanges({
    added: function(id, comment) {
      
      comment.user = publishUserData(comment.userId);
      subscribe.added('bz.reviews', id, comment);
    },
    
    changed: function(id, fields) {
      subscribe.changed('bz.reviews', id, fields);
    },

    removed: function(id) {
      //handler[id] && handler[id].stop();
      subscribe.removed('bz.reviews', id);
    }
  });

  subscribe.ready();


  subscribe.onStop(function() { comments.stop(); });
  
});