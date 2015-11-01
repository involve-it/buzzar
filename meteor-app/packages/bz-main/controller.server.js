/**
 * Created by arutu_000 on 10/31/2015.
 */
try {
  Slingshot.createDirective("myFileUploads", Slingshot.S3Storage, {
    bucket: "bz-photos",

    maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited)
    acl: "public-read",
    allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
    authorize: function () {
      //Deny uploads if user is not logged in.
      if (!this.userId) {
        var message = "Please login before posting files";
        throw new Meteor.Error("Login Required", message);
      }

      return true;
    },
    AWSAccessKeyId: 'AKIAJRKMTZEEIOLOAJ5Q',
    AWSSecretAccessKey: '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',
    key: function (file) {
      //Store file into a directory by the user's username.
      var user = Meteor.users.findOne(this.userId);
      return  'public/' + file.name;
    }
  });
} catch(e){

}