/**
 * Created by arutu_000 on 10/31/2015.
 */
try {
  Slingshot.createDirective("bzImagesDirective", Slingshot.S3Storage, {
    bucket: "buzzar",
    //LocationConstraint: 'us-west-1',
    region: 'us-west-1',
    maxSize: null, //lic-read",
    allowedFileTypes: ["image/png", "image/jpeg", "image/gif", "image/tiff", "image/bmp"],
    authorize: function () {
      //Deny uploads if user is not logged in.
      if (!this.userId) {
        var message = "Please login before posting files";
        throw new Meteor.Error("Login Required", message);
      }
      return true;
    },
    /*AWSAccessKeyId: 'AKIAJ7US4FBIQQ2DWIFA',// new one
    AWSSecretAccessKey: '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',*/
    AWSAccessKeyId: 'AKIAJRKMTZEEIOLOAJ5Q',
    AWSSecretAccessKey: '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',
    key: function (file) {
      //var name = file.name;
      var name = Date.now() + '-' + file.name;
/*      //Store file into a directory by the user's username.
      var user = Meteor.users.findOne(this.userId), name = customName || (Date.now() + "-" + file.name);*/
      console.log('file name = ' + file.name);
      console.log('final name = ' + name);
      console.log('full url = ' + bz.config.version + '/public/images/' + name);
      return  bz.config.version + '/public/images/' + name;
    }
  });
} catch(e){
  console.error('Slingshot.createDirective error', e);
}

bz.help.makeNamespace('bz.bus.invitationCodes');
bz.bus.invitationCodes.getCodeAlias = function(data){
    var code = data && data._id;
    if (code) {
        code = code.toLowerCase().substr(0, 4);
    } else {
        code = null;

    }
    return code;
}

bz.bus.invitationCodes.findCodeByAlias = function(code){
    var code = bz.cols.invitationCodes.findOne({ _id: code }); // todo
    return code;
}

// this function will generate 2 codes, that will be assigned to any new -registered user
bz.bus.invitationCodes.generateUserCodes = function(user){
    var data1 = {}, data2 = {}, trainersCode, usersCode;
    if(user && user._id) {
        data1['issuerId'] = user._id;
        data1['codeType'] = bz.cols.invitationCodeTypes.findOne({ 'name': 'trainer' });
        data1['dateCreated'] = new Date();
        data2['issuerId'] = user._id;
        data2['codeType'] = bz.cols.invitationCodeTypes.findOne({ 'name': 'user' });
        data2['dateCreated'] = new Date();

        trainersCode = bz.cols.invitationCodes.insert(data1);
        usersCode = bz.cols.invitationCodes.insert(data2);
    }
    return {
        trainersCode, usersCode
    };
}
bz.bus.invitationCodes.createCode = function(data){
    var ret;
    ret = bz.cols.invitationCodes.insert(data);
    return ret;
}