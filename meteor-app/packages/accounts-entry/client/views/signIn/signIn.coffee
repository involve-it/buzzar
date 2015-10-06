AccountsEntry.entrySignInHelpers = {
  emailInputType: ->
    if AccountsEntry.settings.passwordSignupFields is 'EMAIL_ONLY'
      'email'
    else
      'string'

  emailPlaceholder: ->
    fields = AccountsEntry.settings.passwordSignupFields

    if _.contains([
      'USERNAME_AND_EMAIL'
      'USERNAME_AND_OPTIONAL_EMAIL'
      ], fields)
      return t9n("usernameOrEmail")
    else if fields == "USERNAME_ONLY"
      return t9n("username")

    return t9n("email")

  logo: ->
    AccountsEntry.settings.logo

  isUsernameOnly: ->
    return AccountsEntry.settings.passwordSignupFields == 'USERNAME_ONLY'

}

AccountsEntry.entrySignInEvents = {
  'submit #signIn': (event) ->
    event.preventDefault()

    email = $('input[name="email"]').val()
    if (AccountsEntry.isStringEmail(email) and AccountsEntry.settings.emailToLower) or
     (not AccountsEntry.isStringEmail(email) and AccountsEntry.settings.usernameToLower)
      email = email.toLowerCase()

    Session.set('email', email)
    Session.set('password', $('input[name="password"]').val())
    Session.set 'talkingToServer', true

    Meteor.loginWithPassword(Session.get('email'), Session.get('password'), (error)->
      Session.set('password', undefined)
      Session.set 'talkingToServer', false
      if error
        T9NHelper.accountsError error
      else if Session.get('fromWhere')
        Router.go Session.get('fromWhere')
        Session.set('fromWhere', undefined)
      else
        Router.go AccountsEntry.settings.dashboardRoute
    )
  'click .js-login-with-fb-btn': (e,v) ->
    debugger
    Meteor.signInWithFacebook({}, ()->
      debugger
    );
}

Template.entrySignIn.helpers(AccountsEntry.entrySignInHelpers)

Template.entrySignIn.events(AccountsEntry.entrySignInEvents)

Template.entrySignIn.rendered = ->
  $(document).foundation abide:
    live_validate: true
    validate_on_blur: true
    focus_on_invalid: true
    error_labels: true
    timeout: 1000
    patterns: email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return