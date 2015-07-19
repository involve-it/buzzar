/**
 * Created by douson on 09.07.15.
 */

Template.ionMenus.events({
    'click [data-ion-menu-close]': function(e, t) {

        //killed double slide effects a side navigation
        IonNavigation.skipTransitions = true;

    }
});
