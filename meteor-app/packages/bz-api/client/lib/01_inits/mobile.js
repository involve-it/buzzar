/**
 * Created by syurdor on 3/21/2016.
 */
bz.help.makeNamespace('bz.mobile');

bz.mobile.processLogin = function() {
    if (Meteor.isCordova) {
        Meteor.call('registerTokenAndDeviceId', device.uuid, bz.mobile.token, Meteor.userId(), function (error) { });
    }
};

if (Meteor.isCordova){
    Meteor.startup(function(){
        Tracker.autorun(function(){
            if (Meteor.userId()){
                Meteor.call('assignTokenToUser', device.uuid, Meteor.userId());
            }
        });

        Push.addListener('token', function(token){
            bz.mobile.token = token;
            setTimeout(function(){
                Meteor.call('registerTokenAndDeviceId', device.uuid, token, Meteor.userId());
            }, 1000);
        });

        Push.addListener('message', function(notification){
            //TODO: display notification
            //do nothing, probably
            Push.setBadge(0);
        });

        Push.addListener('startup', function(notification){
            Push.setBadge(0);

            if (notification && notification.payload && notification.payload.id && notification.payload.type){
                switch (notification.payload.type){
                    case bz.const.push.type.chat:
                        Router.go('/chat/' + notification.payload.id);
                        break;
                    case bz.const.push.type.comment:
                        Router.go('/post/' + notification.payload.id);
                        break;
                    case bz.const.push.type.post:
                        break;
                    default:
                        console.log('Unknown payload type: ' + (payload.type || '(null)'));
                }
            }

            //TODO: display notification
            //open a corresponding view
        });

        Push.addListener('alert', function(notification) {
            Push.setBadge(0);
            //foreground
        });

        Push.addListener('error', function(err){
            console.log(err);
        });
    });
}