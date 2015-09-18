/**
 * Created by douson on 03.07.15.
 */
var requireLoginController = bz.router.requireLoginController;

Router.map(function () {
  this.route('home', {
    path: '/home',
    template: 'pageHome',
    //layoutTemplate: 'mainLayout'
    controller: requireLoginController //temp
  });
});

