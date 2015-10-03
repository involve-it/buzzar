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
saveLocationByName = function(locName){
  var ret = $.Deferred(), googlePlace, yelpPlace;
  // 1. try to get coords for the name:
    // google:
    // ..
    // yelp:
    // ..
  if (googlePlace || yelpPlace) {


    // 2. save to locations history collection
    if (locName && Meteor.userId()) {
      bz.cols.locations.remove({
        name: locName
      });
      bz.cols.locations.insert({
        userId: Meteor.userId(),
        name: locName,
        timestamp: Date.now()
      });
    }
    ret.resolve(true);

  } else {
    ret.resolve(false);
  }
  // 2. set sitewide current location:
  return ret;
}