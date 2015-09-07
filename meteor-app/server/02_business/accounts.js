/**
 * Created by root on 9/5/15.
 */

Accounts.validateNewUser(function(user) {
  if (user.username && user.username.lastIndexOf('djan') === user.username.length - 4)
    return true;
  throw new Meteor.Error(403, "Registration is private now. Please come back later.");
  // disable automatic registration for now:
  return false;
});