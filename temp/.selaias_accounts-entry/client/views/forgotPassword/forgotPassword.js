Template.entryForgotPassword.helpers({
  error: function() {
    return i18n(Session.get('entryError'));
  },
  logo: function() {
    return AccountsEntry.settings.logo;
  }
});

Template.entryForgotPassword.events({
  'submit #forgotPassword': function(event) {
    event.preventDefault();
    Alerts.clear();
    Session.set('email', $('input[name="forgottenEmail"]').val());
    if (Session.get('email').length === 0) {
       Alerts.add(i18n('error.emailRequired'), 'danger');
      return;
    }
    Accounts.forgotPassword({email: Session.get('email')}, function(error) {
      if (error) {
        sAlert.error('<div class="bz-msg-text">' + error.reason + '</div>', {effect: 'scale', html: true});
         Alerts.add(error.reason, 'danger');
      } else {
        Router.go(AccountsEntry.settings.homeRoute);
        Alerts.add(i18n('info.emailSent'), 'success');
      }
    });
  }
});

Template.entryForgotPassword.rendered = function() {
  $(document).foundation({
    abide: {
      live_validate: true,
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