/**
 * Created by douson on 12/17/15.
 */
// use this variable globally to define, that there are some changes not saved:
bz.help.makeNamespace('bz.runtime.changesNotSaved', false);

Meteor.startup(()=>{
    Blaze.getElementView = Blaze._getElementView;
});