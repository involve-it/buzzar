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
function updateStatusOnLogout(fields) {
  var user = Meteor.users.findOne(fields.userId);
  if (user && CheckAlwaysLiveRule(user._id)) {
    if (user.status) {
      var res = Meteor.users.update({ _id: user._id }, { $set: { 'status.online': true }});
      // var r = Meteor.users.findOne({ 'emails.0.address': { $regex : '.+\@shiners.ru' }, _id: user._id }).status.online;
    }
  }
}
CheckAlwaysLiveRule = function(userId) {
  var ret = false;
  ret = !!Meteor.users.findOne({ 'emails.0.address': { $regex : '.+\@shiners.ru' }, _id: userId }); // user exists
  return ret;
}
bz.bus.fake.isBot = CheckAlwaysLiveRule;
