/**
 * Created by douson on 09.07.15.
 */




Template.ionMenus.events({
    'click [data-ion-menu-close]': function(e, t) {

        //killed double slide effects a side navigation
        IonNavigation.skipTransitions = true;

    }
});


















/** 
 * Template toggleMenuLeft 
**/

Template.toggleMenuLeft.events({
    'focus input[type=search]': function(e, tmpl) {
        var el = $('.button-quick-search');

        el.css('display','block')
    },
    'blur input[type=search]':function(e, tmpl) {

    }
});



/**
 * Template toggleMenuRight
 **/

Template.toggleMenuRight.helpers({
    postsCount: function() {
        return (bz.cols.posts.find({userId: Meteor.userId()}).count() === 0) ? '' : bz.cols.posts.find({userId: Meteor.userId()}).count();
    }
});

