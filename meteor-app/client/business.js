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
    Push.Configure({
      badge: true,
      sound: true,
      alert: true
    });

    Push.addListener('token', function(token){
      Meteor.call('registerPushToken', device.uuid, token);
    });

    Push.addListener('message', function(notification){
      //TODO: display notification
    });

    Push.addListener('startup', function(notification){
      //TODO: display notification
    });

  });
}
