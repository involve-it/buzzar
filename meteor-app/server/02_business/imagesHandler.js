/**
 * Created by xvolkx48 on 20.05.2016.
 */
bz.bus.imagesHandler = {
  getPhotos: function(photosId){
    var ret, arrPhoto;
    arrPhoto=bz.cols.images.find({_id: {$in: photosId}}).fetch();
    ret=arrPhoto;
    return ret;
  }
};