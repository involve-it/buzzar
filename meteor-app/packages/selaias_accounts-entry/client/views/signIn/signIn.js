AccountsEntry.entrySignInHelpers = {
  emailInputType: function() {
    if (AccountsEntry.settings.passwordSignupFields === 'EMAIL_ONLY') {
      return 'email';
    } else {
      return 'string';
    }
  },
  emailPlaceholder: function() {
    var fields;
    fields = AccountsEntry.settings.passwordSignupFields;
    if (_.contains(['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL'], fields)) {
      return T9n.get("usernameOrEmail");
    } else if (fields === "USERNAME_ONLY") {
      return T9n.get("username");
    }
    return T9n.get("email");
  },
  logo: function() {
    return AccountsEntry.settings.logo;
  },
  isUsernameOnly: function() {
    return AccountsEntry.settings.passwordSignupFields === 'USERNAME_ONLY';
  },
  SocialSignIn: function(userData){
    Meteor.call('socialLogIn', userData, function(e, r){
      var res;
      if(e) {
        //error
      } else {
        Meteor.loginWithPassword(userData.email, r.result, function(error) {
          Session.set('password', null);
          if (error) {
            sAlert.error('<div class="bz-msg-text">' + error.reason + '</div>', {effect: 'scale', html: true});
            //Alerts.add(error, 'danger')
          } else {
            bz.help.location.startWatchingLocation();
            bz.mobile.processLogin();

            if (Session.get('fromWhere') && Session.get('fromWhere') === '/sign-in' || Session.get('fromWhere') === '/forgot-password' || Session.get('fromWhere') === '/sign-up') {
              return Router.go('home');
              Session.set('fromWhere', null);
            } else if (Session.get('fromWhere')) {
              Router.go(Session.get('fromWhere'));
              Session.set('fromWhere', null);
            } else {
              Router.go(AccountsEntry.settings.dashboardRoute);
            }
          }
        });
      }
    });
  }
};

AccountsEntry.entrySignInEvents = {
  'submit #signIn': function(event) {
    var email;
    event.preventDefault();
    //Alerts.clear();
    email = $('input[name="email"]').val();
    if ((AccountsEntry.isStringEmail(email) && AccountsEntry.settings.emailToLower) || (!AccountsEntry.isStringEmail(email) && AccountsEntry.settings.usernameToLower)) {
      email = email.toLowerCase();
    }
    Session.set('email', email);
    Session.set('password', $('input[name="password"]').val());

    Meteor.loginWithPassword(Session.get('email'), Session.get('password'), function(error) {
      Session.set('password', null);
      if (error) {
        sAlert.error('<div class="bz-msg-text">' + error.reason + '</div>', {effect: 'scale', html: true});
        //Alerts.add(error, 'danger')
      } else {
        /*var location = Session.get('currentLocation');
        if (location){
          Meteor.call('reportLocation', {
            userId: Meteor.userId(),
            lat: location.latitude,
            lng: location.longitude,
            sessionId: Meteor.connection._lastSessionId
          }, function (err, posts) { });
        }*/

        bz.help.location.startWatchingLocation();
        bz.mobile.processLogin();
        
        if (Session.get('fromWhere') && Session.get('fromWhere') === '/sign-in' || Session.get('fromWhere') === '/forgot-password' || Session.get('fromWhere') === '/sign-up') {
          return Router.go('home');
          Session.set('fromWhere', null);
        } else if (Session.get('fromWhere')) {
          Router.go(Session.get('fromWhere'));
          Session.set('fromWhere', null);
        } else {
          Router.go(AccountsEntry.settings.dashboardRoute);
        }

        /* for example, see   https://github.com/involve-it/buzzar/issues/94*/
        /*
        if (Router.current().route.path() === '/sign-in') {
          // if we are on the login route, we want to redirect the user
          return Router.go('home');
        }
        */
        
      }
    });
    
    return false;
  }
};



Template.entrySignIn.helpers(AccountsEntry.entrySignInHelpers);
Template.entrySignIn.events(AccountsEntry.entrySignInEvents);

Template.entrySignIn.rendered = function() {
  $(document).foundation({
    abide: {
      live_validate: false,
      validate_on_blur: true,
      focus_on_invalid: true,
      error_labels: true,
      timeout: 1000,
      patterns: {
        email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      }
    }
  });
};