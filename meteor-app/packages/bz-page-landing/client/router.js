/**
 * Created by Ashot on 9/18/15.
 */
Router.map(function () {
  this.route('bz.aboutUs', {
    path: '/about-us',
    template: 'aboutUsRu'
  });
  this.route('contactUs', {
    path: '/contacts',
    template: 'pageContactUs'
  });
  this.route('AdminTags',{
    path:'/page-admin-tags',
    template: 'pageAdminTags'
  });
});
