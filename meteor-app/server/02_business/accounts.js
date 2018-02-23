/**
 * Created by root on 9/5/15.
 */

Accounts.validateNewUser(function(user) {
  return true;
  if (user.username && user.username.lastIndexOf('djan') === user.username.length - 4)
    return true;
  throw new Meteor.Error(403, "Registration is private now. Please come back later.");
  // disable automatic registration for now:
  return false;
});

Accounts.onLogin(function(user){
  //console.log(user);
});

bz.help.makeNamespace('bz.config');
bz.config.sendAdminNotificationEmail = function(userId, useremail) {
 var options = {
   header: 'Регистрация нового пользователя на ужине в платьях',
     title: 'Регистрация нового пользователя на ужине в платьях',
     msg: `Регистрация нового пользователя на ужине в платьях <a href="http://shiners.mobi/users/${ userId }">${ userId }</a>, email: ${ useremail }"`
 }
 bz.bus.notifications.sendEmailToClubAdmins(options);
}