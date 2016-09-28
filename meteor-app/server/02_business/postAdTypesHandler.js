/**
 * Created by xvolkx48 on 28.09.2016.
 */
bz.bus.postAdTypesHandler = {
  getPostAdTypes: function () {
      var ret, postAdTypes;
      postAdTypes=bz.cols.postAdTypes.find().fetch();
      if(postAdTypes && Array.isArray(postAdTypes) && postAdTypes.length > 0){
          ret = {success: true, result: postAdTypes};
      }
      return ret;
  }  
};