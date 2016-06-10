/**
 * Created by xvolkx48 on 02.06.2016.
 */
Meteor.publish('comments', function(postId){
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
  
  /*if(post){
    newComments = bz.cols.reviews.find({entityId:postId, dateTime: {$gte: time}},{fields: fields});
    ret=newComments;
  }else{
    ret=[];
  }
  return ret;*/

  if(post){
    return bz.cols.reviews.find({entityId:postId, dateTime: {$gte: time}},{fields: fields});
  }

  return this.ready();
  
});

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