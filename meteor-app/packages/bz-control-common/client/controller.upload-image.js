/**
 * Created by arutu_000 on 2/2/2016.
 */

const IMG_TYPES = {
  URL: 'url',
  BLOB: 'blob'
}

currentImageReactive;
Meteor.startup(()=>{
  currentImageReactive = new ReactiveVar(new ImageClass());
});
/*CreateNewImage = function(){
  var img =  new ImageClass();
  currentImageReactive.set(img);
  return img;
}*/

ImageClass = class {
  constructor(options = {}) {
    this.setRandomFileNameFromExtension(options.fileName);
  }
  set src(value) {
    this.src = value;
  }
  get src() {
    return this._src;
  }
  save(){

  }
  toObject(){

  }
  makeSmallThumbnailFromFile(file) {
    return new Promise((resolve, reject)=> {
      Resizer.resize(file, {width: 300, height: 300, cropSquare: true}, function (err, newFile) {
        resolve(newFile);
      });
    });
  }

  saveImageFromUrlToExternalSession(sessionName, url) {
    var sessionVal = Session.get(sessionName), newSessionVal,
      imgObj = {
        data: url
      };
    if (sessionVal && Array.isArray(sessionVal)) {
      newSessionVal = sessionVal;

      newSessionVal.push(imgObj);
    } else {
      newSessionVal = imgObj;
    }
    Session.set(sessionName, newSessionVal);
  }

  static getDataFromImgUrl(url, img, w, h) {
    var img, canvas, ctx, ret;
    //var img = $('#asdf')[0];                   '
    return new Promise((resolve)=>{
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
        resolve(ret);

        //cb.call(this, ret);
      }
      img.src = url;
    });
  }

  setRandomFileNameFromExtension(fullName) {
    fullName = fullName || this.fullName || '';
    var extension = fullName.substr(fullName.lastIndexOf('.') + 1);
    extension = (extension.length > 5 || extension.length < 3) ? 'png' : extension;
    this.name = _.guid() + '.' + extension;
    return this.name;
  }



  static createBlobImageFromBlobFile(fileInputSelector, fileName, data) {
    var img = new ImageClass({
      type: 'file',
      src: fileInputSelector,
      data: data,
      fileName: fileName,
    });
    return img;
  }

  static dataURItoBlob(dataURI) { // http://stackoverflow.com/a/11954337
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }
}

BlobImageClass = class extends ImageClass {
  constructor(options = {}, fileInputSelector){
    if (typeof options === 'string') {
      options = {
        url: options,
        fileName: options
      }
    }
    super(options);
    this.type = IMG_TYPES.BLOB;
    //createBlobImageFromUrl
    if(fileInputSelector){
      ImageClass.getDataFromImgUrl(options.url, fileInputSelector, 600, 500).done(function (imgData) {
        this.src = imgData;
        currentImageReactive.set(this);
      });
    }
  }
  get src() {
    return this.data;
  }
  set src(value) {
    this.data = value;
  }
  //uploadImageToS3(file, callback, errCallback) {
  save(file, callback, errCallback) {
    var uploader = uploadImageToS3.uploader = uploadImageToS3.uploader || new Slingshot.Upload('bzImagesDirective');
    var error = uploader.validate(file);
    if (error) {
      console.error(error);
    }
    uploader.send(file, function (error1, downloadUrl) {
      if (error1) {
        if (error1 && error1.error === 'Upload denied') {
          alert(error1.message);
        }
        // Log service detailed response.
        var printErr = uploader.xhr && uploader.xhr.response || error1;
        //console.error('Error uploading', printErr);
        errCallback.call(this, error1);
        //alert(error1);
      }
      else {
        if (callback && typeof callback === 'function') {
          callback.call(this, downloadUrl);
        }
        //Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
        saveImageFromUrlToSession(downloadUrl);
        //Session.set(SESSION_NAME, downloadUrl);
      }
    });
    super.save();
  }
  toObject(){
  }
}

UrlImageClass = class extends ImageClass {
  constructor(options = {}){
    if (typeof options === 'string') {
      options = {
        url: options,
        fileName: options
      }
    }
    super(options);
    this.type = IMG_TYPES.URL;
    this.src = options.url;
    currentImageReactive.set(this);
  }
  get src() {
    return this._src;
  }
  set src(source){
    this._src = source;
  }
}