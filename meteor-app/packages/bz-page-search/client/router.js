/**
 * Created by Ashot on 9/19/15.
 */
Router.map(function () {
  this.route('search.results', {
    path: '/search-results',
    template: 'pageSearchResults',
    //controller: 'requireLoginController',
    onBeforeAction: function () {
      //Router.go('/posts/my');
      this.next();
    }
  });
});