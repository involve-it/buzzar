/**
 * Created by arutu_000 on 2/2/2016.
 */

const IMG_TYPES = {
  URL: 'url',
  BLOB: 'blob',
  THUMBNAIL: 'thumbnail'
}

currentImageReactive;
//imagesArrayExternalReactive = new ReactiveVar();

Meteor.startup(()=> {
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

  save() {

  }

  toObject() {

  }

  static saveImageToExternalObject(objReactive, imgObj) {
    var objectVal = objReactive.get() || [], newObjectVal;
    if (objectVal && Array.isArray(objectVal)) {
      newObjectVal = objectVal;

      newObjectVal.push(imgObj);
    } else {
      newObjectVal = imgObj;
    }
    objReactive.set(newObjectVal);
    window.aaa = objReactive;
  }

  static getDataFromImgUrl(url, img, w, h) {
    var canvas, ctx, ret, imgCreated = false;
    if (!img) {
      /*img = $('<img id="bz-temp-url-image-holder" style=" position: absolute; top: 0; z-index: -1;"/>')[0];
      $('body').append(img);
      imgCreated = true;*/
      img = new Image();
    }
    return new Promise((resolve)=> {
      img.setAttribute('crossOrigin', 'anonymous');
      canvas = document.createElement('canvas');

      ctx = canvas.getContext("2d");
      img.onload = function () {

        //canvas.width = img.offsetWidth;
        //canvas.height = img.offsetHeight;
        /*img.onload = null;
        w = w || img.offsetWidth;
        h = h || img.offsetHeight;
        canvas.width = w > img.offsetWidth ? w : img.offsetWidth;
        canvas.height = h > img.offsetHeight ? h : img.offsetHeight;
        ctx.drawImage(img, 0, 0);
        ret = canvas.toDataURL();
         imgCreated && $('body').remove('#bz-temp-url-image-holder');

         */

        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);
        ret = canvas.toDataURL('image/png');
        resolve(ret);
        //cb.call(this, ret);
      }
      img.onerror = function() {
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

  static dataURItoBlob(dataURI) { // http://stackoverflow.com/a/11954337
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }

  static cleanClass() {
    currentImageReactive.set(new ImageClass());
  }
}

BlobImageClass = class extends ImageClass {
  constructor(options = {}, fileInputSelectorEl) {
    if (typeof options === 'string') {
      options = {
        url: options,
        fileName: options
      }
    }
    super(options);
    this.type = IMG_TYPES.BLOB;
    if(options.blob && options.blob.constructor === Blob){
      this._getDataUriFromBlobPromise(options.blob).done((res)=>{
        this.src = res;
        currentImageReactive.set(this);
      });
    } else if (fileInputSelectorEl) {
      ImageClass.getDataFromImgUrl(options.url, fileInputSelectorEl, 600, 500).done((imgData)=> {
        this.src = imgData;
        currentImageReactive.set(this);
      });
    } else {
      this.src = options.data;
      currentImageReactive.set(this);
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

  toObject() {
    console.log('toObject');
  }
  _getDataUriFromBlobPromise(blob){
    var blob = blob || this.blob;
    return new Promise((resolve, reject)=>{
      var fileReader = new FileReader();
      fileReader.onload = function(res){
        resolve(fileReader.result);
      }
      fileReader.readAsDataURL(blob);
    });
  }
}

UrlImageClass = class extends ImageClass {
  constructor(options = {}) {
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
    return this.data;
  }

  set src(source) {
    this.data = source;
  }
}
ThumbnailImageClass = class extends ImageClass {
  constructor(options = {}, callback) {
    super(options);
    this.type = IMG_TYPES.THUMBNAIL;
    this.fileName = ThumbnailImageClass.getFileNameForThumbnail(options.name);

    var file = options.data;
    if (options.type === IMG_TYPES.URL) {
      var dataString = ImageClass.getDataFromImgUrl(file).done((result)=> {
        file = ImageClass.dataURItoBlob(result);
        Resizer.resize(file, {width: 300, height: 300, cropSquare: true}, (err, newFile)=> {
          this.blob = newFile;
          callback && callback(this);
          //resolve(newFile);
        });
      });
    } else if (file && typeof file !== 'object' && file.constructor !== Blob) {
      file = ImageClass.dataURItoBlob(file);

      //return new Promise((resolve, reject)=> {
      Resizer.resize(file, {width: 300, height: 300, cropSquare: true}, (err, newFile)=> {
        this.blob = newFile;
        callback && callback(this);
        //resolve(newFile);
      });
    }
    //});
  }

  static getFileNameForThumbnail(fileName) {
    var name, arr = fileName.split('.');
    if (arr.length > 1) {
      name = arr[0] + '-thumb.' + arr[1];
    }
    return name;
  }
}