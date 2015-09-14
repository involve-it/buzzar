/**
 * Created by syurdor on 9/14/2015.
 */

Meteor.startup(function(){
  bz.bus.pushHandler = {
    push: function(token, title, msg, type){
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

      CordovaPush.send(notification);
    },
    registerToken: function(userId, token){
      if (userId && token && Object.keys(token).length > 0) {
        var userTokens = bz.cols.tokens.findOne({userId: userId});
        if (userTokens) {
          var platform = Object.keys(token)[0];
          userTokens.tokens[platform] = token[platform];
        } else {
          userTokens = {
            userId: userId,
            tokens: token
          };
          bz.cols.tokens.insert(userTokens);
        }
      }
    }
  };
});