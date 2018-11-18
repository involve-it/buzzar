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
    AWSAccessKeyId: 'AKIAIHFPO7DQJXXQYI2A',
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

