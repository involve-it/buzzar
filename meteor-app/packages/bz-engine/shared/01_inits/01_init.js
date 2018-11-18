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

bz.config = {
    env: 'dev',
    //env: 'prod',
    mapsKey: '',
    version: 'v1.0'
}

var Business = function() {};

//temp
bz.cols.nativeLocationReports = new Mongo.Collection('nativeLocationReports');

bz.bus = Business;

