/**
 * Created by xvolkx48 on 02.06.2016.
 */

bz.bus.locationsHandler = {
  nearbyRadius: 0.2,
  addLocation: function(request){
    var ret, coords, placeType,name, public,currentUser,location, locId;
    check(request,{
      public: Boolean,
      Coords:{lat:Number, lng: Number},
      placeType:String,
      name: String
    });
    currentUser=Meteor.userId();
    public=request.public;
    coords=request.Coords;
    placeType=request.placeType;
    name=request.name;
    if(currentUser){
      if (coords && coords.lat && coords.lng){
        if (name){
          if(placeType){
            location={
              userId: currentUser,
              name: name,
              coords:coords,
              placeType:placeType,
              public: public
            };
            locId=bz.cols.locations.insert(location);
            if(locId){
              ret={success: true, result:locId};
            }else{
              //error
              ret={success: false, error: bz.const.errors.global.errorWriteInDb};
            }
          }else{
            //error
            ret={success: false, error: bz.const.errors.locations.invalidPlaceType};
          }
        }else{
          //error
          ret={success: false, error: bz.const.errors.locations.invalidName};
        }
      }else{
        //error
        ret={success: false, error: bz.const.errors.locations.invalidCoords};
      }
    }else{
      //error not logged
      ret={success: false, error: bz.const.errors.global.notLogged};
    }
    return ret;
  },

  reportLocation: function(report, userId){
    var posts, currentUserId, ret;
    if (report.lat && report.lng) {
      currentUserId = userId || Meteor.userId();
      if (currentUserId) {
        var userUpdateObj = {
          coords: {
            lat: report.lat,
            lng: report.lng
          }
        };
        if (report.deviceId) {
          userUpdateObj.lastMobileLocationReport = new Date;

          if (report.notify) {
            console.log('trying to send notification about nearby posts');
            var nearbyPosts = bz.bus.proximityHandler.getNearbyPosts(report.lat, report.lng, bz.bus.locationsHandler.nearbyRadius);
            if (nearbyPosts && nearbyPosts.length > 0) {
              bz.bus.proximityHandler.notifyNearbyPosts(userId, nearbyPosts);
            }
          }
        }
        Meteor.users.update({_id: currentUserId}, {$set: userUpdateObj});

        posts = bz.cols.posts.find({userId: currentUserId}).fetch();
        if (posts) {
          bz.bus.proximityHandler.processLocationReport(posts, report.lat, report.lng);
          ret = {success: true}
        } else {
          ret = {success: true}
        }
      } else {
        //error not logged
        ret = {success: false, error: bz.const.errors.global.notLogged};
      }
    } else {
      ret = {success: false};
    }
    return ret;
  }
};