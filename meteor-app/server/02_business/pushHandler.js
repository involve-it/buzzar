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
  Push.debug = true;
  bz.bus.pushHandler = {
    getTotalEventsCount: function(userId){
      var chats = bz.bus.messagesChatsHandler.getChats({take: 100, skip: 0}, userId),
        counter = 0;
      _.each(chats.result, function(chat){
        if (chat.lastMessage) {
          if (chat.lastMessage.seen == undefined) {
            chat.lastMessage.seen = true;
          }
          if (!chat.lastMessage.seen && chat.lastMessage.toUserId == userId) {
            counter++;
          }
        }
      });
      return counter;
    },
    push: function(userId, title, msg, payload, user){
      var notification = {
            from: 'Shiners',
            title: title,
            text: msg,
            payload: payload,
            sound: 'default',
            apn:{
              text: title + ': ' + msg
            }
          };

      user = user || Meteor.users.findOne({_id: userId});
      notification.badge = bz.bus.pushHandler.getTotalEventsCount(userId);
      if (user && user.tokens && user.tokens.length > 0){
        notification.tokens = _.filter(_.pluck(user.tokens, 'token'), function(token){return token;});
        Push.send(notification);
      }
    },
    registerPushToken: function(deviceId, userId, token, platform){
      if (deviceId && userId && token && userId === Meteor.userId()){
        var user = Meteor.user();
        !user.tokens && (user.tokens = []);
        if (bz.const.verification.pushPlatforms.indexOf(platform) !== -1){

          Meteor.users.update({_id: {$ne: userId}}, {$pull: {tokens: {deviceId: deviceId}}});
          var existing = _.find(user.tokens, function(t){return t.deviceId === deviceId});
          if (!existing) {
            var tokenObj = {
              deviceId: deviceId,
              token: {}
            };
            tokenObj.token[platform] = token;
            user.tokens.push(tokenObj);
          } else {
            existing.token = {};
            existing.token[platform]= token;
          }
          Meteor.users.update(user._id, user);
          return {success: true};
        }
      }

      return {success: false};
    },
    unregisterPushToken: function(deviceId, userId, platform){
      if (deviceId && userId && userId === Meteor.userId() && bz.const.verification.pushPlatforms.indexOf(platform) !== -1) {
        var user = Meteor.user();
        user.tokens && (user.tokens = _.filter(user.tokens, function(t){return t.deviceId !== deviceId || !t.token[platform] }));
        user.lastMobileLocationReport = 0;
        Meteor.users.update(user._id, user);
        return {success: true};
      }

      return {success: false};
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

  /*bz.cols.posts.after.update(function(userId, doc, fieldNames, modifier, options){
    debugger;
  });

  bz.cols.posts.before.update(function(userId, doc, fieldNames, modifier, options){
    debugger;
  });*/

  bz.cols.posts.after.insert(function(userId, doc){
    if (userId && doc && doc._id){
      var date = new Date((new Date).getTime() - 20 * 1000 * 60), coords, box;
      if (doc.details && doc.details.locations && Array.isArray(doc.details.locations)){
        _.find(doc.details.locations, function(loc){
          if (loc) {
            coords = loc.coords;

            if (coords && loc.placeType == bz.const.locations.type.DYNAMIC) {
              return true;
            }
          }
        });
        if (coords){
          box = bz.bus.proximityHandler.getLatLngBox(coords.lat, coords.lng, bz.bus.locationsHandler.nearbyRadius);
          if (box) {
            var users = Meteor.users.find({
              lastMobileLocationReport: {$gte: date},
              _id: {$ne: userId},
              'coords.lat': {$gte: box.lat1, $lte: box.lat2},
              'coords.lng': {$gte: box.lng1, $lte: box.lng2}
            }).fetch();

            _.each(users, function (user) {
              if (user.enableNearbyNotifications) {
                console.log('sending push new post to user id: ' + user._id);
                bz.bus.pushHandler.push(user._id, 'New post nearby', doc.details.title, {
                  type: bz.const.push.type.post,
                  id: doc._id
                });
              }
            });
          }
        }
      }
    }
  });

  //temporarily disabled since not implemented in the app
  /*bz.cols.reviews.after.insert(function(userId, doc){
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
  });*/

  bz.cols.messages.after.insert(function(userId, doc){
    if (doc && doc.text && doc.toUserId){
      //console.log('sending push: ' + doc.text);
      var user = Meteor.users.findOne({_id: userId}), title = 'New message';
      if (user){
        title = user.username;
      }
      var otherUser = Meteor.users.findOne({_id: doc.toUserId});
      if (otherUser){
        if (!otherUser.status || !otherUser.status.online){
          bz.bus.pushHandler.push(doc.toUserId, title, doc.text, {
            type: bz.const.push.type.chat,
            id: doc.chatId
          }, otherUser);
        } else {
          console.log('Delaying push');
          Meteor.setTimeout(function(){
            var messageDb = bz.cols.messages.findOne({_id: doc._id});
            if (!messageDb.seen){
              console.log('Sending delayed push');
              bz.bus.pushHandler.push(messageDb.toUserId, title, messageDb.text, {
                type: bz.const.push.type.chat,
                id: messageDb.chatId
              }, otherUser);
            } else {
              console.log('Push cancelled');
              console.log(messageDb);
            }
          }, 1000);
        }
      }

    }
  });
});