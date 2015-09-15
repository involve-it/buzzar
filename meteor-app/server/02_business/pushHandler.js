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
    registerToken: function(deviceId, token){
      console.log('registering deviceId: ' + deviceId + ', token: ' + token.apn);
      if (deviceId && token && Object.keys(token).length > 0) {

        bz.cols.bulkTokens.remove({deviceId: deviceId});

        bz.cols.bulkTokens.insert({
          deviceId: deviceId,
          token: token,
          timestamp: new Date()
        });
      }
    },
    //called on log in
    assignTokenToUser: function(userId, deviceId){
      var userTokens = bz.cols.userTokens.findOne({userId: userId});
      var bulkToken = bz.cols.bulkTokens.findOne({deviceId: deviceId});
      if (bulkToken) {
        if (userTokens) {
          userTokens.tokens.push(bulkToken);
        } else {
          userTokens = {
            userId: userId,
            tokens: [bulkToken]
          };
          bz.cols.tokens.insert(userTokens);
        }
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
});