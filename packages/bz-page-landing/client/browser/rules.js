/**
 * Created by douson on 7/18/16.
 */

Template.bzRules.onCreated( function() {
  this.template = new ReactiveVar( "" );
});

Template.bzRules.onRendered(function() {

  var tmpl = this,
      lang = Session.get('bz.user.language');

  if (lang === 'ru') {
    tmpl.template.set("bzRulesRU");
  } else if(lang === 'en') {
    tmpl.template.set("bzRulesEN");
  }
  
});

Template.bzRules.helpers({
  templateLoading: function() {
    var lang = Session.get('bz.user.language');
    
    if (lang === 'ru') {
      Template.instance().template.set("bzRulesRU");
    } else if(lang === 'en') {
      Template.instance().template.set("bzRulesEN");
    }
    
    return Template.instance().template.get();
  }
});