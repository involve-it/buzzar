/**
 * Created by xvolkx48 on 02.06.2016.
 */
bz.bus.locationsHandler = {
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

  reportLocation: function(report){
    var posts, currentUserId, ret;
    check(report,{lat: Number,lng: Number});
    currentUserId = Meteor.userId();
    if (currentUserId){
      posts = bz.cols.posts.find({userId: currentUserId}).fetch();
      if (posts) {
        bz.bus.proximityHandler.processLocationReport(posts, report.lat, report.lng);
        ret={success: true}
      }else{
        ret={success: true}
      }
    } else {
      //error not logged
      ret={success: false, error: bz.const.errors.global.notLogged};
    }
    return ret;
  }
};