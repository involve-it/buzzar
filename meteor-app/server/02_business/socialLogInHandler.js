/**
 * Created by xvolkx48 on 27.06.2016.
 */
bz.bus.socialLogInHandler={
  socialLogIn: function(request){
    var user,ret,email, name, social_id, platform, profile, password;
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
    password=_.guid();
    user=Meteor.users.findOne({social_id: social_id});
    if(!user) {
      //create account
      profile = AccountsEntry.settings.defaultProfile || {};
      user = Accounts.createUser({
        email: email,
        password: password,
        social_id: social_id,
        profile:_.extend(profile,{
          platform: platform,
          name:name
        })
      });
      ret={success:true, result: password};
    }else{
      Meteor.users.update({social_id: social_id},{$set: {password: password}});
      ret={success:true, result: password};
    }
    return ret;
  }
};