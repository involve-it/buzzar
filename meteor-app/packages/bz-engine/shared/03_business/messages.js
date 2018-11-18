/**
 * Created by xvolkx48 on 09.06.2016.
 */
Meteor.publish('messages-new', function(){
  var ret,messages, time,currentUser, fields;
  fields={
    _id: 1,
    userId: 1,
    toUserId: 1,
    chatId: 1,
    text: 1,
    timestamp: 1,
    keyMessage: 1,
    seen:1
  };
  currentUser=this.userId;
  time= Date.now()-5000;
  if (currentUser){
    messages= bz.cols.messages.find({$or: [{userId:currentUser}, {toUserId:currentUser}], timestamp: {$gte: time}},{fields: fields});
    ret=messages;
  }else{
    ret=[];
  }
  return ret;
});