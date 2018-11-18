if (typeof AccountsEntry === "undefined") {
  AccountsEntry = {};
}

AccountsEntry = {
  settings: {
    wrapLinks: true,
    homeRoute: '/home',
    dashboardRoute: '/dashboard',
    passwordSignupFields: 'EMAIL_ONLY',
    emailToLower: true,
    usernameToLower: false,
    entrySignUp: '/sign-up',
    emailVerificationPendingRoute: '/verification-pending',
    showOtherLoginServices: true,
    fluidLayout: false,
    requirePasswordConfirmation: true,
    showSpinner: true,
    waitEmailVerification: true,
      extraSignUpFields: [{                      // Add extra signup fields on the signup page
          field: "phone",                           // The database property you want to store the data in
          name: "",  // An initial value for the field, if you want one
          label: "Телефон",                      // The html lable for the field
          placeholder: "Телефон",                 // A placeholder for the field
          type: "text",                            // The type of field you want
          required: true                           // Adds html 5 required property if true
      }, {                      // Add extra signup fields on the signup page
          field: "city",                           // The database property you want to store the data in
          name: "Липецк",  // An initial value for the field, if you want one
          label: "Город",                      // The html lable for the field
          placeholder: "Город",                 // A placeholder for the field
          type: "text",                            // The type of field you want
          required: true                           // Adds html 5 required property if true
      }]
  },
  isStringEmail: function(email) {
    var emailPattern;
    emailPattern = /^([\w.-]+)@([\w.-]+)\.([a-zA-Z.]{2,6})$/i;
    if (email.match(emailPattern)) {
      return true;
    } else {
      return false;
    }
  },
  config: function(appConfig) {
    var signUpRoute;
    this.settings = _.extend(this.settings, appConfig);
    i18n.setDefaultLanguage = "ru";
    if (appConfig.language) {
      i18n.setLanguage = appConfig.language;
    }
    if (appConfig.signUpTemplate) {
      signUpRoute = Router.routes['entrySignUp'];
      return signUpRoute.options.template || appConfig.signUpTemplate;
    }
  },
  signInRequired: function(router, extraCondition) {
    if (extraCondition === null) {
      extraCondition = true;
    }
    if (!Meteor.user()){
      Session.set('fromWhere', router.url);
      Router.go('entrySignIn');
      Session.set('entryError', i18n('error.signInRequired'));
    }
  }
};
