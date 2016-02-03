/**
 * Created by arutu_000 on 2/2/2016.
 */
makeSmallThumbnailFromFile = function (file) {
  return new Promise((resolve, reject)=>{
    Resizer.resize(file, {width: 300, height: 300, cropSquare: true}, function (err, newFile) {
      resolve(newFile);
    });
  });
}
saveImageFromUrlToExternalSession = function (sessionName, url) {
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
getDataFromImgUrl = function (url, img$, w, h, cb) {
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
