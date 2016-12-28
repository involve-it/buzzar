/**
 * Created by douson on 4/4/16.
 */

Template.bzAnonymousPostBtn.onCreated(function() {
  Session.set('anonymousPostChecked', false);
});

Template.bzAnonymousPostBtn.helpers({
  checked: function() {
    var ret = '';
    if (this._id) {
      if(this.details.anonymousPost) {
        ret = 'checked'
      } else {
        ret = false;
      }
    } else {
      ret = Session.get('anonymousPostChecked');
    }
    
    return ret;
  }
});

Template.bzAnonymousPostBtn.events({
  'click .js-toggle-checked': function(e, v) {
    
    const target = e.target;
    const checked = target.checked;
    //console.info(v.$('.js-toggle-checked').prop("checked"));
    
    Session.set('anonymousPostChecked', checked);
  }
});