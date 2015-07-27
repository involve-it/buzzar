/**
 * Created by douson on 03.07.15.
 */

Router.configure({
    layoutTemplate: 'layout',
    waitOn: function () {
        //return Meteor.subscribe('userProfile');
    },

    // the appNotFound template is used for unknown routes and missing lists
    notFoundTemplate: 'appNotFound',

    // show the appLoading template whilst the subscriptions below load their data
    loadingTemplate: 'appLoading'
});

Router.map(function() {
    this.route('home', {
        path: '/',
        controller: 'requireLoginController'
    });

    this.route('settings', {
        template: 'userSettings',
        controller: 'requireLoginController'
    });

    this.route('contacts', {
        path: 'contacts',
        controller: 'requireLoginController',
        waitOn: function() {
            return [
                Meteor.subscribe('users')
            ]
        }
    });

    this.route('contacts.show', {
        path: '/contacts/:_id',
        controller: 'requireLoginController',
        waitOn: function() {
            return [

            ]
        },
        data: function () {
            return Meteor.users.findOne({_id: this.params._id});
        }
    });
    this.route('posts.new', {
        path: '/posts/new',
        waitOn: function() {
            return [

            ]
        }
        /*data: function () {
            return Meteor.users.findOne({_id: this.params._id});
        }*/
    });
    this.route('posts.map',{
        path: '/posts/map',
        template: 'postsMap',
        waitOn: function(){
            return [
                GoogleMaps.load({key: 'AIzaSyCE5a0IeEGQLptVSSW-5swNFNaRUXKEWss', libraries: 'geometry,places', v: '3'})
            ];
        }
    });
});

/***********************
* requireLoginController
************************/

requireLoginController = RouteController.extend({

    onBeforeAction: function () {
        if (!Meteor.user()) {
            if (Meteor.loggingIn()) {
                this.render(this.loadingTemplate);
            } else {
                Router.go('entrySignIn');
            }
        } else {
            this.next();
        }
    }
});