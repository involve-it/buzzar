/**
 * Created by douson on 06.07.15.
 */


bz.help.maps.initLocation();


Template.mainLayout.rendered = function () {
  
  $(document).foundation({

  });
  
};

Template.bzLocationName.helpers({
  getLocationName: function(){ //FromSearchControl
    return Session.get('bz.control.search.location') && Session.get('bz.control.search.location').name;
  }
});





