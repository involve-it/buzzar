/**
 * Created by root on 9/1/15.
 */

if(false && Meteor.isClient) {
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1025008177543236',
      status     : true,
      xfbml      : true,
      version    : 'v2.4'
    });
  };
}