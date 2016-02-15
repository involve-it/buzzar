/**
 * Created by douson on 24.08.15.
 */

Template.postsMy.onRendered(()=>{
  console.log('started' + new Date());
  bz.ui.spinnerRemove('body', true);
})
Template.postsMy.events({
    'click .toggle-checked-state': function() {
        /*Set state active/inactive*/
    }
});