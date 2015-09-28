/**
 * Created by Ashot on 9/25/15.
 */
// HELPERS:
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