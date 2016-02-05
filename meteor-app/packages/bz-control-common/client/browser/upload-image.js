/**
 * Created by Ashot on 9/25/15.
 */
const SESSION_NAME = 'bz.common.uploadImageSrc';

Template.uploadImageModal.onDestroyed(function () {
  console.log('uploadImageModal destroyed');
});
Template.uploadImageModal.onRendered(function () {
  setTimeout(function () {
    $(document).off('open.fndtn.reveal', '[data-reveal].js-avatar-upload-modal');
    $(document).on('open.fndtn.reveal', '[data-reveal].js-avatar-upload-modal', function () {
      Template.uploadImageModal.bzOpened();
    });
  }, 1000);
  // this.data is session var name for holding img src
  $(document).foundation('tab', 'reflow');

});

// this is analog to rendered, runs every time modal is open
Template.uploadImageModal.bzOpened = function () {
  clearForm();
  //CreateNewImage();
}
Template.uploadImageModal.helpers({
  getPreviewImgSrc: function () {
    var imgSrc, imgObj = currentImageReactive.get();
    /*if (imgObj.type === IMG_TYPES.BLOB) {
     imgSrc = imgObj.src
     //imgSrc = imgObj.data
     } else {
     imgSrc = imgObj.src;
     }*/
    $('.js-preview').animate({opacity: 1.0}, 150);
    bz.ui.spinnerRemove('.js-preview-wrapper');
    return imgObj.src;
  },
  countFile: function () {
  }
});

Template.uploadImageModal.events({
  'click .tabs a': function (e, v) {
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
          saveImageFromDataToSession(data);
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
        saveImageFromDataToSession(data);
      }
    });
  },
  'click .js-use-image-url': function (e, v) {
    var imgUrl = $('.js-image-url').val();
    if (imgUrl) {
      new UrlImageClass(imgUrl);
    }
  },
  'click .js-use-random-image-url': function (e, v) {
    var that = this, imgData,
      randomImgUrl = bz.const.randomImageSite + '?ts=' + Date.now();
    if (randomImgUrl) {
      bz.ui.spinnerAdd('.js-preview-wrapper');
      $('.js-preview').animate({opacity: 0}, 150);
      //$('.js-preview').css({opacity: 1.0, visibility: 'visible'}).animate({opacity: 0}, 50);
      new BlobImageClass(randomImgUrl, $('.js-preview')[0]);
    }
  },
  'change .js-file-upload': function (e, v) {
    var input = e.target, that = this,
      file = input.files && input.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e1) {
        //saveImageFromDataToSession(e1.target.result, file.name);
        saveImageFromBlobFileToSession('.js-file-upload', file.name, e1.target.result);

      };
      reader.readAsDataURL(file);
      //saveImageFromBlobFileToSession(file);

    }
  },
  'click .js-ok-btn': function (e, v) {
    $('.js-avatar-upload-modal').foundation('reveal', 'close');
    if (this.sessionName) {
      doneCloseChooseImageDialog(this.sessionName, Session.get(SESSION_NAME));
    }
  },
  'click .js-random-image-tab-btn': function (e, v) {
    setTimeout(()=> {
      v.$('.js-use-random-image-url').click();
    }, 150);
  },
  'click .js-tab-title': function (e, v) {
    v.$('.js-preview').attr('src', '')
  }
});


//HELPERS:
function clearForm(v) {
  v = v || window;
  Session.set(SESSION_NAME, {});
  v.$('.js-file-upload').val('');
}


doneCloseChooseImageDialog = function (sessionName, imgObj) {
  var inp, file;
  bz.ui.spinnerAdd('.js-edit-avatar');

  if (imgObj.type === 'data') {
    file = dataURItoBlob(imgObj.src);
    file.name = imgObj.name;
    makeSmallThumbnailFromFile(file).then(()=> {
      debugger;
    })
    uploadImageToS3(file, function (resUrl) {
      bz.ui.spinnerRemove('.js-edit-avatar');

      saveImageFromUrlToExternalSession(sessionName, resUrl);
    }, function (error) {
      // error allback:
      bz.ui.spinnerRemove('.js-edit-avatar');

    });
  } else if (imgObj.type === 'url') {
    saveImageFromUrlToExternalSession(sessionName, imgObj.src);
  } else if (imgObj.type === 'file' && (inp = $(imgObj.src)[0])) {
    file = inp.files[0];
    makeSmallThumbnailFromFile(file).done(function (newFile) {
      debugger;
      saveImageFromUrlToExternalSession(sessionName, newFile);
      bz.ui.spinnerRemove('.js-edit-avatar');
    });
    /*uploadImageToS3(file, function (resUrl) {
     saveImageFromUrlToExternalSession(sessionName, resUrl);
     });*/
  }
}
