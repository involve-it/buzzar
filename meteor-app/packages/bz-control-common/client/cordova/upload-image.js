/**
 * Created by Ashot on 9/25/15.
 */
Template.uploadImageModal.onRendered(function(){
  // this.data is session var name for holding img src
  $(document).foundation('tab', 'reflow');
});
Template.uploadImageModal.helpers({
  getPreviewImgSrc: function(){
    return Session.get(this.toString());
  }
})
Template.uploadImageModal.events({
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
          Session.set(this.data, data)
        }
      });

    } else {
      $('.js-library-not-available-alert').show(function(){
        setTimeout(function(){
          $('.js-library-not-available-alert').hide();
        }, 3000);
      });
    }
  },
  'click .js-take-photo': function (e, v) {
    //$('.js-avatar-upload-modal').foundation('reveal', 'close');

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
        Session.set(that.toString(), data)
      }
    });
  },
  'click .js-use-image-url': function (e, v) {
    if ($('.js-image-url').val()) {
      Session.set(this.toString(), $('.js-image-url').val());
    }
  },
  'click .js-use-random-image-url': function (e, v) {
    var that = this, imgData,
        randomImgUrl = bz.const.randomImageSite + '?ts=' +  Date.now();

    getDataFromImgUrl(randomImgUrl, $('.js-preview')[0], 400, 300, function(imgData){
      Session.set(that.toString(), imgData);
    });
  },
  'change .js-file-upload': function(e, v){
    var input = e.target, that = this;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e1) {
        Session.set(that.toString(), e1.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  },
  'click .js-ok-btn': function(){
    $('.js-avatar-upload-modal').foundation('reveal', 'close');
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
