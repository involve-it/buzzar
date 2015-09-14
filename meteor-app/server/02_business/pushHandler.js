/**
 * Created by syurdor on 9/14/2015.
 */


bz.bus.pushHandler = {
  queue: [],
  queuePushNotification: function(token, title, msg, type){
    type = type || 'apn';
    var notification = {
          from:'',
          title: title,
          text: msg,
          badge: 1
        },
      t = {};
    if (Array.isArray(token)){
      notification.tokens = [];
      _.each(token, function(e){
        t = {};
        t[type] = e;
        notification.tokens.push(t);
      });
    } else {
      t[type] = token;
      notification.token = t;
    }
    if (!CordovaPush){
      bz.bus.pushHandler.queue.push(notification);
    } else {
      CordovaPush.send(notification);
    }
  }
};

Meteor.startup(function(){
  if (CordovaPush && bz.bus.pushHandler.queue.length > 0){
    _.each(bz.bus.pushHandler.queue, function(notification){
      CordovaPush.send(notification);
    });
  }
});