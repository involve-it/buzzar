/**
 * Created by xvolkx48 on 27.06.2016.
 */
bz.bus.socialLogInHandler={
  socialLogIn: function(request){
    var user,ret,email, name, social_id, platform, profile;
    check(request,{
      email: Match.Maybe(String),
      name: String,
      id: String,
      platform: String
    });
    email= request.email;
    name=request.name;
    social_id= request.id;
    platform=request.platform;
    user=Meteor.users.findOne({SSO_id: social_id});
    if(!user) {
      //create account
      profile = AccountsEntry.settings.defaultProfile || {};
      user = Accounts.createUser({
        email: email,
        social_id: social_id,
        profile:_.extend(profile,{
          platform: platform,
          name:name
        })
      });
      if(user){
        ret={success:true, result: user}
      }
    }
    return ret;
  }
};