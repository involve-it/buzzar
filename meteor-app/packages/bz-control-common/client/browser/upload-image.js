/**
 * Created by Ashot on 9/25/15.
 */
const SESSION_NAME = 'bz.common.uploadImageSrc';

Template.uploadImageModal.onRendered(function () {
  setTimeout(function () {
    $(document).off('open.fndtn.reveal', '[data-reveal].js-avatar-upload-modal');
    $(document).on('open.fndtn.reveal', '[data-reveal].js-avatar-upload-modal', function () {
      clearForm();
    });
  }, 1000);
  // this.data is session var name for holding img src
  $(document).foundation('tab', 'reflow');

});

Template.uploadImageModal.helpers({
  getPreviewImgSrc: function () {
    var imgSrc, imgObj = Session.get(SESSION_NAME) || {};
    if (imgObj.type === 'file'){
      imgSrc = imgObj.data
    } else {
      imgSrc = imgObj.src;
    }
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
      saveImageFromUrlToSession(imgUrl);
    }
  },
  'click .js-use-random-image-url': function (e, v) {
    var that = this, imgData,
        randomImgUrl = bz.const.randomImageSite + '?ts=' + Date.now();
    getDataFromImgUrl(randomImgUrl, $('.js-preview')[0], 600, 500, function (imgData) {
     saveImageFromDataToSession(imgData, randomImgUrl);
     });
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
    if(this.sessionName)  {
      doneCloseChooseImageDialog(this.sessionName, Session.get(SESSION_NAME));
    }
  },
  'click .js-random-image-tab-btn': function(e, v){
    v.$('.js-use-random-image-url').click();
  },
  'click .js-tab-title': function(e, v){
    v.$('.js-preview').attr('src', '')
  }
});


//HELPERS:
function clearForm(v){
  v = v || window;
  Session.set(SESSION_NAME, {});
  v.$('.js-file-upload').val('');
}
function generateRandomFileNameFromExtension(fullName){
  fullName = fullName || '';
  var extension = fullName.substr(fullName.lastIndexOf('.') + 1);
  extension = (extension.length > 5 || extension.length < 3) ? 'png' : extension;
  return _.guid() + '.' + extension;
}
function saveImageFromUrlToSession(imgUrl){
  // try to get non-ssl , todo: remove after we add ssl:
  imgUrl = imgUrl.replace('https://', 'http://');
  Session.set(SESSION_NAME, {
    type: 'url',
    src: imgUrl,
    name: generateRandomFileNameFromExtension(imgUrl)
  });
}
function saveImageFromBlobFileToSession(fileInputSelector, fileName, data){

  Session.set(SESSION_NAME, {
    type: 'file',
    src: fileInputSelector,
    data: data,
    name: generateRandomFileNameFromExtension(fileName)
  });
}
function saveImageFromDataToSession(imgData, fileName){
  Session.set(SESSION_NAME, {
    type: 'data',
    src: imgData,
    name: generateRandomFileNameFromExtension(fileName)
  });
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

function dataURItoBlob(dataURI) { // http://stackoverflow.com/a/11954337
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for(var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}
function uploadImageToS3(file, callback){

  var uploader = uploadImageToS3.uploader = uploadImageToS3.uploader || new Slingshot.Upload('bzImagesDirective');
  var error = uploader.validate(file);
  if (error) {
    console.error(error);
  }
  uploader.send(file, function (error1, downloadUrl) {
    if (error1) {
      if (error1 && error1.error === 'Upload denied'){
        alert(error1.message);
      }
      // Log service detailed response.
      var printErr = uploader.xhr && uploader.xhr.response || error1;
      //console.error('Error uploading', printErr);
      alert (error1);
    }
    else {
      if (callback && typeof callback === 'function'){
        callback.call(this, downloadUrl);
      }
      //Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
      saveImageFromUrlToSession(downloadUrl);
      //Session.set(SESSION_NAME, downloadUrl);
    }
  });
}

doneCloseChooseImageDialog = function(sessionName, imgObj){
  var inp, file;
  if(imgObj.type === 'data'){
    file = dataURItoBlob(imgObj.src);
    file.name = imgObj.name;
    uploadImageToS3(file, function(resUrl){
      saveImageFromUrlToExternalSession(sessionName, resUrl);
    });
  } else if (imgObj.type === 'url'){
    saveImageFromUrlToExternalSession(sessionName, imgObj.src);
  } else if (imgObj.type === 'file' && (inp = $(imgObj.src)[0])){
    file = inp.files[0];
    uploadImageToS3(file, function(resUrl){
      saveImageFromUrlToExternalSession(sessionName, resUrl);
    });
  }
}
saveImageFromUrlToExternalSession = function(sessionName, url){
  var sessionVal = Session.get(sessionName), newSessionVal,
    imgObj = {
      data: url
    };
  if(sessionVal && Array.isArray(sessionVal)){
    newSessionVal = sessionVal;

    newSessionVal.push(imgObj);
  } else {
    newSessionVal = imgObj;
  }
  Session.set(sessionName, newSessionVal);
}
getDataFromImgUrl = function(url, img$, w, h, cb){
  var img, canvas, ctx, ret;
  //var img = $('#asdf')[0];                   '
  var img = img$;
  img.setAttribute('crossOrigin', 'anonymous');
  canvas = document.createElement('canvas');

  ctx = canvas.getContext("2d");
  img.onload = function () {
    //canvas.width = img.offsetWidth;
    //canvas.height = img.offsetHeight;
    img.onload = null;
    canvas.width = w > img.offsetWidth ? w : img.offsetWidth;
    canvas.height = h > img.offsetHeight ? h : img.offsetHeight;
    ctx.drawImage(img, 0, 0);
    ret = canvas.toDataURL();
    cb.call(this, ret);
  }
  img.src = url;


  return ret;
}
