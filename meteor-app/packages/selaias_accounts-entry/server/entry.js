Meteor.startup(function() {
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  };

  AccountsEntry = {
    settings: {},
    config: function(appConfig) {
      this.settings = _.extend(this.settings, appConfig);
    }
  };
  this.AccountsEntry = AccountsEntry;

  Accounts.validateLoginAttempt(function(attemptInfo) {

    var requirePasswordConfirmation = AccountsEntry.settings.requirePasswordConfirmation || false;

    if ( requirePasswordConfirmation === true){

      if (attemptInfo.type == 'resume') {
        return true;
      } 

      if (attemptInfo.methodName == 'createUser') {
        return false;
      } 

      if (attemptInfo.methodName == 'login' && attemptInfo.allowed) {

        var verified = false;
        var email = attemptInfo.methodArguments[0].user.email;
        attemptInfo.user.emails.forEach(function(value, index) {
          if (email == value.address && value.verified) {
            verified = true;
          }
        });
        if (!verified) {
          throw new Meteor.Error(403, 'Verify Email first!');
        }
      }
    }
    return true;
  });

});
Meteor.methods({
  entryValidateSignupCode: function(signupCode) {
    var codeIsValid = !AccountsEntry.settings.signupCode || signupCode === AccountsEntry.settings.signupCode; // original
    return codeIsValid;
  },
  entryCreateUser: function(user) {
    var profile, userId;
    try{
      check(user, Object);
      profile = AccountsEntry.settings.defaultProfile || {};

      if (user.username) {
        userId = Accounts.createUser({
          username: user.username,
          email: user.email,
          password: user.password,
          profile: _.extend(profile, user.profile)
        });
      } else {
        userId = Accounts.createUser({email: user.email, password: user.password, profile: _.extend(profile, user.profile)});
      }
      if (userId){
        Meteor.users.update({_id: userId}, {$set: {enableNearbyNotifications: true}});
      }
      if (user.email && Accounts._options.sendVerificationEmail) {
        Accounts.sendVerificationEmail(userId, user.email);
      }
      if (bz.config.sendAdminNotificationEmail) {
          bz.config.sendAdminNotificationEmail(userId, user.email);
      }
    }catch(ex){
      console.log(ex)
      throw new Meteor.Error(403, ex.message);
    }
  }
});


