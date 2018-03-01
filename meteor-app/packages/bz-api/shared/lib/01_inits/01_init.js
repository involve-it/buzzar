/**
 * Created by ashot on 8/12/15.
 */
var gl;
if(Meteor.isClient){
  gl = typeof window !== 'undefined' && window !== null ? window : {};
} else if (Meteor.isServer) {
  gl = typeof global !== 'undefined' && global !== null ? global : {};
}
gl.bz = gl.bz || {};
gl.bz.cols = gl.bz.cols || {};
gl.bz.runtime = gl.bz.runtime || {};

if(Meteor.isCordova)
{
  Meteor._reload.onMigrate(function() {
    return [false];
  });
}