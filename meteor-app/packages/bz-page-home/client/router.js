/**
 * Created by douson on 03.07.15.
 */

Router.map(function () {
  this.route('home', {
    path: '/home',
    template: 'pageHome',
    layoutTemplate: 'mainLayoutHome',
    onBeforeAction: function () {
      var qs = this.params.query;

      setSearchTextFromQs(qs);
      setSearchLocationFromQs(qs);

      this.next();
    }
  });
});

