/**
 * Created by xvolkx48 on 20.05.2016.
 */
bz.bus.imagesHandler = {
  getPhotos: function(photosId){
    var ret, arrPhoto;
    check(photosId, String);
    arrPhoto=bz.cols.images.find({_id: {$in: photosId}}).fetch();
    ret=arrPhoto;
    return ret;
  },
  addImage: function(request, currentUserId){
    var ret, data,thumbnail;
    return ret;
  },
  deleteImage: function(url){
    var ret, image;
    check(url, String);
    if (bz.const.RegExp.imageUrlRegEx.test(url)) {
      image=bz.cols.images.find({$or:[{data:url},{thumbnail: url}]});
      if(image){
        if(image.userId===Meteor.userId()){
          bz.cols.images.remove({_id: image._id});
          ret={success:true};
          //также необходимо удаление с s3
        }else{
          //error
          ret = {success: false, error: bz.const.errors.global.userNotAuthor};
        }
      }else{
        //error
        ret = {success: false, error: bz.const.errors.global.dataNotFound};
      }
    } else {
      //error
      ret = {success: false, error: bz.const.errors.images.badImageUrl};
    }
    return ret;
  }
};