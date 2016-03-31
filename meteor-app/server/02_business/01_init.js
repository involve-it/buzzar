/**
 * Created by ashot on 8/20/15.
 */
var Business = function() {}

bz.help.makeNamespace({
  path: 'bz.bus',
  object: Business
});

Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://info%40shiners.ru:Shiners77@smtp.timeweb.ru:465';
});

/* version app */
Meteor.startup(function(){
  if (Version.find().count() > 0){
    Version.remove({});
  }

  console.log(JSON.parse(Assets.getText("version.json")));
  
  //Version.insert(JSON.parse(Assets.getText("version.json")));
})