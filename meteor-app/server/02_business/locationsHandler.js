/**
 * Created by xvolkx48 on 02.06.2016.
 */
bz.bus.locationsHandler = {
  addLocation: function(request){
    var ret, coords, placeType,name, public,currentUser,location, locId;
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
  }
};