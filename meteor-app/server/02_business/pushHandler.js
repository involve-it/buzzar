/**
 * Created by syurdor on 9/14/2015.
 */

/**
 * token format (from Push plugin):
 * {
 *  apn: 'example'
 * }
 *
 * bulkToken format:
 * {
 *  deviceId: example,
 *  token: {** see token format **},
 *  timestamp: 01/01/2015
 * }
 *
 * userToken format:
 * {
 *  userId: example,
 *  tokens: [** see bulkToken format **]
 * }
 *
 */

Meteor.startup(function(){
  bz.bus.pushHandler = {
    push: function(userIds, title, msg, payload){
      var notification = {
            from:'Buzzar',
            title: title,
            text: msg,
            badge: 1,
            payload: payload
          };
      var tokens = [];
      if (!Array.isArray(userIds)) {
        userIds = [userIds];
      }
      var userTokens = bz.cols.userTokens.find({userId: {$in: userIds}}).fetch();
      _.each(userTokens, function(e){
        _.each(e.tokens, function(bulkToken){
          tokens.push(bulkToken.token);
        });
      });
      if (tokens.length > 0) {
        notification.tokens = tokens;
        Push.send(notification);
      }
    },
    registerToken: function(deviceId, token, userId){
      console.log('registering deviceId: ' + deviceId + ', token: ' + token.apn || token.gcm);
      if (deviceId && token && Object.keys(token).length > 0) {
        bz.cols.bulkTokens.remove({deviceId: deviceId});

        bz.cols.bulkTokens.insert({
          deviceId: deviceId,
          token: token,
          timestamp: new Date()
        });
      }
      if (userId){
        bz.bus.pushHandler.assignTokenToUser(userId, deviceId);
      }
    },
    //called on log in
    assignTokenToUser: function(userId, deviceId){
      var userTokens = bz.cols.userTokens.findOne({userId: userId});
      var bulkToken = bz.cols.bulkTokens.findOne({deviceId: deviceId});
      if (bulkToken) {
        if (userTokens) {
          var exists = false;
          _.each(userTokens.tokens, function(token){
            if (token.deviceId === deviceId){
              token.token = bulkToken.token;
              exists = true;
            }
          });

          if (!exists){
            userTokens.tokens.push(bulkToken);
          }

          bz.cols.userTokens.update({_id: userTokens._id}, userTokens);
        } else {
          userTokens = {
            userId: userId,
            tokens: [bulkToken]
          };
          bz.cols.userTokens.insert(userTokens);
        }
        bz.cols.bulkTokens.remove({_id: bulkToken._id});
      } else {
        console.log('WARNING: no token assigned, device id is not found in bulkTokens. Device id: ' + deviceId);
      }
    },
    //called on log out
    unassignTokenFromUser: function(userId, deviceId){
      var userTokens = bz.cols.userTokens.findOne({userId: userId});
      if (userTokens){
        userTokens.tokens = _.filter(userTokens.tokens, function(bulkToken){return bulkToken.deviceId !== deviceId});
        bz.cols.userTokens.update({_id: userTokens._id}, userTokens);
      } else {
        console.log('WARNING: userTokens table does not contain a record with userId: ' + userId);
      }
    }
  };


  bz.cols.reviews.after.insert(function(userId, doc){
    if (userId && doc && doc.entityId && doc.text){
      //console.log('sending push: ' + doc.text);
      var post = bz.cols.posts.findOne({_id: doc.entityId});
      if (post && post.userId !== doc.userId){
        bz.bus.pushHandler.push(post.userId, 'New comment', doc.text, {
          type: bz.const.push.type.comment,
          id: post._id
        });
      }
    }
  });

  bz.cols.messages.after.insert(function(userId, doc){
    if (doc && doc.text && doc.toUserId){
      //console.log('sending push: ' + doc.text);
      bz.bus.pushHandler.push(doc.toUserId, 'New message', doc.text, {
        type: bz.const.push.type.chat,
        id: doc.chatId
      });
    }
  });
});