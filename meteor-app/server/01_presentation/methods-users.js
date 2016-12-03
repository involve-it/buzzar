Meteor.methods({
  /*getCurrentLocation : function(a, b, c) {
   },*/
  'bz.user.setLanguage' : function(lang) {
    var ret, user;

    user = Meteor.userId();
    ret = Meteor.users.update({'_id': user}, {
      $set: { 'profile.language': lang }
    });
    return ret;
  },
  'bz.user.getLanguage' : function(detectedLang){
    var ret;
    ret = Meteor.user() && Meteor.user()._getLanguage() || undefined;
    if(!ret && detectedLang){
      a = Meteor.call('bz.user.setLanguage', detectedLang);
      ret = detectedLang;
    }
    return ret;
  },
  'bz.user.getUsersAround': function (request) {
    request = request || {};
    return bz.bus.usersHandler.getNearbyUsers(request);
  }
});