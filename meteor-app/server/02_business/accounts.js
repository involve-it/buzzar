/**
 * Created by root on 9/5/15.
 */
var validateSignupCode = function(signupCode, email) {
    var codeIsValid, isInDb, isAdminUser, code;
    check(signupCode, Match.OneOf(String, null, undefined));

    code = bz.cols.invitationCodes.findOne({ _id: signupCode });
    !code && (code = bz.cols.invitationCodes.findOne({ _id: { $regex : signupCode, '$options' : 'i' }}));
    console.log(code);
    isInDb = !!code;
    isAdminUser = !!bz.const.adminsList.find(e => e == email);
    codeIsValid = signupCode && isInDb || isAdminUser;
    if(codeIsValid) {
        return code;
    } else {
        return false;
    }
}
Accounts.validateNewUser(function(user) {
    if (user.profile.inviteCode) {
        var myInvCodes, code, res = validateSignupCode(user.profile.inviteCode, user.emails[0].address);
        if (res) {
            // set role:
            code = res;
            user.profile.role = code.codeType && code.codeType.name;
            // set city:
            user.profile.city = 'Lipetsk';

            myInvCodes = bz.bus.invitationCodes.generateUserCodes(user);
            user.profile.myInvitationCodes = myInvCodes;
            return true;
        } else {
            throw new Meteor.Error(403, "Указан неверный код регистрации");

            return false;
        }
    } else {
        throw new Meteor.Error(403, "Не указан код регистрации");
        // disable automatic registration for now:
        return false;
    }

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

