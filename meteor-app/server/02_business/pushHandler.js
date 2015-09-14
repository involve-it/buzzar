/**
 * Created by syurdor on 9/14/2015.
 */

Meteor.startup(function(){
  bz.bus.pushHandler = {
    push: function(userIds, title, msg){
      var notification = {
            from:'',
            title: title,
            text: msg,
            badge: 1
          };
      var tokens = [];
      if (!Array.isArray(userIds)) {
        userIds = [userIds];
      }
      var userTokens = bz.cols.tokens.find({userId: {$in: userIds}}).fetch();
      _.each(userTokens, function(e){
        _.each(e.tokens, function(token){
          tokens.push(token);
        });
      });
      if (tokens.length > 0) {
        notification.tokens = tokens;
        CordovaPush.send(notification);
      }
    },
    registerToken: function(userId, token){
      if (userId && token && Object.keys(token).length > 0) {
        var userTokens = bz.cols.tokens.findOne({userId: userId});
        if (userTokens) {
          userTokens.tokens.push(token);
        } else {
          userTokens = {
            userId: userId,
            tokens: [token]
          };
          bz.cols.tokens.insert(userTokens);
        }
      }
    }
  };
});