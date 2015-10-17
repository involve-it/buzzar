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
addImageToArrSession = function(sessionName, img){
  var arr = [];
  console.log('sessionName: ' + sessionName);
  if(img && sessionName) {
    Session.set('bz.posts.postImgSrc', img);
    arr = Session.get(sessionName);
    if (!arr || !Array.isArray(arr)) {
      arr = [];
    }
    arr.push({
      data: img
    });

    Session.set(sessionName, arr);
  }
  return arr;
}