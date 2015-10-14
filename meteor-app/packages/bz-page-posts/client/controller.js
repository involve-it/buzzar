/**
 * Created by Ashot on 9/19/15.
 */
bz.help.makeNamespace('bz.runtime.newPost.location');


movingLocationPanelClick = function () {
  var chosenLocation = Session.get(location1.sessionName);
  if (!chosenLocation) {
    // nothing is set as a location, need to set it, for this show user location-choose control:
    //$('.js-location-holder a').click();
    bz.help.maps.getCurrentLocation(function (loc) {
      /*var chosenLocation = Session.get('bz.posts.new.location1');
      var name = 'current';
      var existLoc = bz.cols.locations.findOne({name: name, userId: Meteor.userId()});
      if (existLoc) {
        bz.cols.locations.remove(existLoc._id);
      }
      bz.cols.locations.insert({
        userId: Meteor.userId(),
        name: 'current',
        coords: loc
      });*/

      Meteor.call('setUserCurrentLocation', Meteor.userId(), loc, function(err, resLocation){
        location1.setLocation(resLocation);
      })
      /*locationsArr.push({
       coords: loc,
       type: bz.const.locations.type.STATIC
       });
       locDef.resolve();*/
    });
    //Template.bzLocationNameNewPost.showModal();
  }
}
staticLocationPanelClick = function () {
  var chosenLocation = Session.get(location2.sessionName);
  if (!chosenLocation) {
    // nothing is set as a location, need to set it, for this show user location-choose control:
    //$('.js-location-holder a').click();
    Template.bzLocationNameNewPost.showModal();
  }
}

// location1 variable:
location1 =  {
  isSet: false,
  sessionName: 'bz.posts.new.location1',
  dbObject: undefined,
  setLocation: function(dbObject){
    this.isSet = true;
    this.dbObject = dbObject;
    Session.set(this.sessionName, dbObject);
  }
}
location2 = {
  isSet: false,
  sessionName: 'bz.posts.new.location2',
  dbObject: undefined,
  setLocation: function(dbObject){
    this.isSet = true;
    this.dbObject = dbObject;
    Session.set(this.sessionName, dbObject);
  }
}