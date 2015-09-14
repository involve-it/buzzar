/**
 * Created by root on 9/5/15.
 */
bz.help.makeNamespace('bz.buz');
buz = {
  test: function(){
    console.log('test');
  }
}
_.extend(bz.buz, buz);

if (Meteor.isCordova){
  Meteor.startup(function(){
    CordovaPush.Configure({
      badge: true,
      sound: true,
      alert: true
    });

    CordovaPush.addListener('token', function(token){
      Meteor.call('registerPushToken', Meteor.userId(), token);
    });

    CordovaPush.addListener('message', function(notification){
      //TODO: display notification
    });

    CordovaPush.addListener('startup', function(notification){
      //TODO: display notification
    });
  });
}