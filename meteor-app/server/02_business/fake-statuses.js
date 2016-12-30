/**
 * Created by c_aarutyunyan on 12/2/16.
 */
// always live posts, fake online users etc. :)
bz.help.makeNamespace('bz.bus.fake');
UserStatus.events.on("connectionLogout", function(fields) {
  updateStatusOnLogout(fields);
});
UserStatus.events.on("connectionIdle", function(fields) {
  updateStatusOnLogout(fields);
})
UserStatus.events.on("connectionLogin", function(fields) {
});


Meteor.startup(function () {
  SyncedCron.add({
    name: 'set fake users online status each 15 minutes',
    schedule: function (parser) {
      return parser.text('every 15 minutes');
    },
    job: function () {
      return UpdateAllAlwaysLiveUsers();
    }
  });
});


function updateStatusOnLogout(fields) {
  var user = Meteor.users.findOne(fields.userId);
  if (user && CheckAlwaysLiveRule(user._id)) {
    if (user.status) {
      var res = Meteor.users.update({ _id: user._id }, { $set: { 'status.onlineFake': true }});
    }
  }
}
CheckAlwaysLiveRule = function(userId) {
  var ret = false;
  ret = !!Meteor.users.findOne({ 'emails.0.address': { $regex : '.+\@shiners.ru' }, _id: userId });
  return ret;
}
UpdateAllAlwaysLiveUsers();
function UpdateAllAlwaysLiveUsers() {
  var ret = false;
  ret = Meteor.users.update({ 'emails.0.address': { $regex : '.+\@shiners.ru' } }, {
    // $set: { 'status.online': true },
    $set: {
      'status.onlineFake': true,
      'status.online': true,
      'presences.static': 'close'
    } // don't use status.online - it's used by https://github.com/mizzao/meteor-user-status package
  }, {
    multi: true
  });
  return ret;
}

bz.bus.fake.isBot = CheckAlwaysLiveRule;