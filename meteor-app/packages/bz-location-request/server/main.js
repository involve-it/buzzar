// import { HTTP } from 'meteor/http';
import { Email } from 'meteor/email';

Meteor.startup(function () {

});
const MESSAGE_TEMPLATE_SHORT = function (data) {
  return `Пользователь ${ data.username } запрашивает вашу локацию: `;
}
const MESSAGE_TEMPLATE = function (data) {
  return `Пользователь <i>${ data.username }</i> запрашивает вашу локацию <br/>
     <!--<button text="разрешить" onClick="javascript: alert('requestLocationHere')">Разрешить</button>, -->
     закройте окно, чтобы перестать отсылать положение
    `;
}
Meteor.methods({
  'bz.generateMessageForSharingLocation': function(requesterUserId) {
    var requesterUser = Meteor.users.findOne(requesterUserId), link = '';
    if (requesterUser) {
      link = MESSAGE_TEMPLATE(requesterUser);
    } else {
      throw 'no toAddress or requesterUserId defined'
    }
    return link;
  },
  'bz.generateNotificationLink': function(userId, trackId) {
    userId = userId || Meteor.userId();
    if (userId) {
      var link = `http://localhost:3000/share-location?requesterUserId=${ userId }&trackId=${ trackId }`;
      // var link = `https://shiners.mobi/shasre-location?requesterUserId=${ userId }`;
    } else {
      throw 'no userId defined'
    }
    return {
      link: link,
      user: Meteor.users.findOne(userId)
    };
  },
  'bz.sendNotificationLink': function(toAddress, trackId, text = '') {
    if (!toAddress) {
      throw 'to address not defined'
    } else {
      var res = Meteor.call('bz.generateNotificationLink', Meteor.userId(), trackId);
      var requestMessage = MESSAGE_TEMPLATE_SHORT(res.user);
      var emailResult = Email.send({
        to: toAddress,
        from: 'info@shiners.ru',
        subject: 'Request for location',
        text: text + '  ' + requestMessage +  res.link
      });
      return emailResult;
    }
  },
  'bz.initTrackedLocation': function(pos, trackId) {
    var ret;
    if (pos && trackId) {
      ret = bz.cols.locationTrackings.insert({
        coords: pos,
        status: 'started',
        trackId: trackId
      })
    }
    return ret;
  },
  'bz.sendTrackedLocation': function(loc, trackId) {
    if (loc && trackId) {

    }
  }
});
