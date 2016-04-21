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
    push: function(userIds, title, msg, payload, badge){
      badge = badge == null ? 1 : badge;
      var notification = {
            from:'Buzzar',
            title: title,
            text: msg,
            badge: badge,
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
        console.log('Pushing:');
        console.log(tokens);
        notification.tokens = tokens;
        Push.send(notification);
      }
    },
    registerTokenAndDeviceId: function(deviceId, token, userId){
      //console.log('registering deviceId: ' + deviceId + ', token: ' + token.apn || token.gcm);
      if (deviceId) {
        Meteor.users.update({}, {
          $pull: {deviceIds: deviceId}
        });
        if (userId) {
          var user = Meteor.users.findOne(userId);
          if (user) {
            user.deviceIds = user.deviceIds || [];
            user.deviceIds.push(deviceId);
            Meteor.users.update(userId, user);
          }
        }

        if (token && Object.keys(token).length > 0) {
          bz.cols.bulkTokens.remove({deviceId: deviceId});

          /*bz.cols.bulkTokens.insert({
            deviceId: deviceId,
            token: token,
            timestamp: new Date()
          });*/
        }
        if (userId) {
          bz.bus.pushHandler.assignTokenToUser(userId, deviceId, token);
        }
      }
    },
    //called on log in
    assignTokenToUser: function(userId, deviceId, token){
      var userTokens = bz.cols.userTokens.findOne({userId: userId}), bulkToken;
      if (token){
        //console.log('1');
        bulkToken = {
          deviceId: deviceId,
          token: token
        }
      } else {
        //console.log('2');
        bulkToken = bz.cols.bulkTokens.findOne({deviceId: deviceId});
      }
      if (bulkToken) {
        var existingUserToken, tokens = [];
        if (bulkToken.token.apn) {
          existingUserToken = bz.cols.userTokens.findOne({'tokens.token.apn': bulkToken.token.apn});
          if (existingUserToken) {
            _.each(existingUserToken.tokens, function (t) {
              if (t.apn !== bulkToken.token.apn) {
                tokens.push(t);
              }
            });

            existingUserToken.tokens = tokens;
            bz.cols.userTokens.update({_id: existingUserToken._id}, {
              $set: {
                tokens: tokens
              }
            });
          }
        } else if (bulkToken.token.gcm) {
          existingUserToken = bz.cols.userTokens.findOne({'tokens.token.gcm': bulkToken.token.gcm});
          if (existingUserToken) {
            _.each(existingUserToken.tokens, function (t) {
              if (t.gcm !== bulkToken.token.gcm) {
                tokens.push(t);
              }
            });
            existingUserToken.tokens = tokens;
            bz.cols.userTokens.update({_id: existingUserToken._id}, {
              $set: {
                tokens: tokens
              }
            });
          }
        }


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
        var user = Meteor.users.find({_id: userId});
        if (user && user.deviceIds && user.deviceIds.length > 0){
          user.deviceIds = _.filter(user.deviceIds, function(dId){return dId !== deviceId;});
          Meteor.users.update(userId, {$set: {deviceIds: user.deviceIds}});
        }
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