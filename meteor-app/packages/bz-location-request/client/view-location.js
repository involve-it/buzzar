/**
 * Created by c_aarutyunyan on 12/5/16.
 */
Template.requestLocation.onRendered(function() {
})

Template.requestLocation.helpers({

})

bz.bus.stopPollingLocation = function() {
  bz.cols.locationTrackings.remove(bz.help.getParamURL().trackId);
}