/**
 * Created by Ashot on 9/25/15.
 */
const SESSION_NAME = 'bz.common.uploadImageSrc';

Template.uploadImageModal.onRendered(function () {
  setTimeout(function () {
    $(document).off('open.fndtn.reveal', '[data-reveal].js-avatar-upload-modal');
    $(document).on('open.fndtn.reveal', '[data-reveal].js-avatar-upload-modal', function () {
      Session.set('bz.posts.postImgSrc', '');
    });
  }, 1000);
  // this.data is session var name for holding img src
  $(document).foundation('tab', 'reflow');
  Session.set(SESSION_NAME, '');
});

Template.uploadImageModal.helpers({
  getPreviewImgSrc: function () {
    var imgSrc = Session.get(SESSION_NAME) || '';

    return imgSrc;
  },
  countFile: function() {

    /*if(Session.get('bz.posts.postImgArr') !== undefined) {
      return true;
    }*/
  }
});

Template.uploadImageModal.events({
  'click .tabs a': function(e, v){
    e.preventDefault();
  },
  'click .js-photo-library': function (e, v) {
    var options = {
      width: 350,
      height: 350,
      quality: 75
    }
    if (typeof Camera !== 'undefined') {

      options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
      MeteorCamera.getPicture(options, function (err, data) {
        if (err) {
          console.log('error', err);
        }
        if (data) {
          addImageToArrSession(data);
        }
      });

    } else {
      $('.js-library-not-available-alert').show(function () {
        setTimeout(function () {
          $('.js-library-not-available-alert').hide();
        }, 3000);
      });
    }
  },
  'click .js-take-photo': function (e, v) {
    var options = {
          width: 350,
          height: 350,
          quality: 75
        },
        that = this;

    MeteorCamera.getPicture(options, function (err, data) {
      if (err) {
        console.log('error', err);
      }
      if (data) {
        //Session.set(that.sessionName, data);
        addImageToArrSession(data);
      }
    });
  },
  'click .js-use-image-url': function (e, v) {
    var imgData = $('.js-image-url').val();
    if (imgData) {
      //Session.set(this.sessionName, $('.js-image-url').val());
      addImageToArrSession(imgData);

    }
  },
  'click .js-use-random-image-url': function (e, v) {
    var that = this, imgData,
        randomImgUrl = bz.const.randomImageSite + '?ts=' + Date.now();
    addImageToArrSession(randomImgUrl);
    /*getDataFromImgUrl(randomImgUrl, $('.js-preview')[0], 400, 300, function (imgData) {
     //Session.set(that.sessionName, imgData);
     addImageToArrSession(that.sessionName, imgData);

     });*/
  },
  'change .js-file-upload': function (e, v) {
    var input = e.target, that = this;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e1) {
        addImageToArrSession(e1.target.result);
      };
      reader.readAsDataURL(input.files[0]);
      var uploader = new Slingshot.Upload("myFileUploads");

      var error = uploader.validate(input.files[0]);
      if (error) {
        console.error(error);
      }
      uploader.send(input.files[0], function (error1, downloadUrl) {
        if (error1) {
          // Log service detailed response.
          console.error('Error uploading', uploader.xhr.response);
          alert (error1);
        }
        else {
          Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
        }
      });

    }
  },
  'click .js-ok-btn': function () {
    $('.js-avatar-upload-modal').foundation('reveal', 'close');
    if(this.sessionName)  {
      doneCloseChooseImageDialog(this.sessionName, Session.get(SESSION_NAME));
    }
    //Modules.client.uploadToAmazonS3( { event: event, template: template } );

  }
});

/*
 Template.filePickerUpload.events({
 'click #upload': function () {

 filepicker.pick(
 {
 mimetypes: ['image/gif','image/jpeg','image/png'],
 multiple: false
 },
 function(InkBlob){
 var image = Images.findOne({userId:Meteor.userId()});
 if(image){
 Images.update({_id:image._id},
 {
 $set:{
 filepickerId:_.last(InkBlob.url.split("/"))
 }
 });
 }else{
 Images.insert({
 userId:Meteor.userId(),
 filepickerId:_.last(InkBlob.url.split("/")),
 createdAt:new Date() //this isnt guarnteed accurate, but its ok for this simple demo
 });
 }
 },
 function(FPError){
 if(FPError && FPError.code !== 101)
 alert(FPError.toString());
 }
 );
 }
 })*/


//HELPERS:
function addImageToArrSession(img){
  var sessionName = SESSION_NAME;
  Session.set(sessionName, img);

  //var arr = [];
  /*console.log('sessionName: ' + sessionName);
   if(img && sessionName) {
   imagesArrayGlobal.push({
   sessionName: sessionName,
   imgUrl: img
   });
   }
   Session.set('bz.posts.postImgSrc', img);*/
  /*
   arr = Session.get(sessionName);
   if (!arr || !Array.isArray(arr)) {
   arr = [];
   }
   arr.push({
   data: img
   });

   Session.set(sessionName, arr);
   }
   return arr;*/
}