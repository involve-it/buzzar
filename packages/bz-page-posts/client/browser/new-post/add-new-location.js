/**
 * Created by arutu_000 on 9/28/2015.
 */
Template.bzControlAddNewLocation.helpers({
  joinedArray: function () {
    var ret = [{
      name: 'google-places',
      valueKey: 'name',
      displayKey: 'name',
      template: 'googlePlacesItem',
      header: '<h3 class="league-name">Please select/h3>',
      local: function () {
        ret =[
          'My live location',
          'Pinned location'
        ];

        return ret;
      }
    }]
    return ret;
  }
});