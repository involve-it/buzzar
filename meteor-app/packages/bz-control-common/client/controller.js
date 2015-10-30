/**
 * Created by Ashot on 9/25/15.
 */
// HELPERS:
saveImageAndGetUrlFromData = function(data){

}
getDataFromImgUrl = function(url, img$, w, h, cb){
  var img, canvas, ctx, ret;
  //var img = $('#asdf')[0];                   '
  var img = img$;
  img.setAttribute('crossOrigin', 'anonymous');
  canvas = document.createElement('canvas');

  ctx = canvas.getContext("2d");
  img.onload = function () {
    canvas.width = img.offsetWidth;
    canvas.height = img.offsetHeight;
    ctx.drawImage(img, 0, 0);
    ret = canvas.toDataURL();
    cb.call(this, ret);
  }
  img.src = url;


  return ret;
}


doneCloseChooseImageDialog = function(sessionName, imgSrc){
  var sessionVal = Session.get(sessionName), newSessionVal;
  if(sessionVal && Array.isArray(sessionVal)){
    newSessionVal = sessionVal;
    /*_.each(sessionVal, function(image, i){
      var arr, img = image.imgUrl, sessionName = image.sessionName;
      //arr = Session.get(sessionName);
      if (!arr || !Array.isArray(arr)) {
        arr = [];
      }
      arr.push({
        data: img
      });
    });*/
    newSessionVal.push({
      data: imgSrc
    });
  } else {
    newSessionVal = imgSrc;
  }

  Session.set(sessionName, newSessionVal);

}