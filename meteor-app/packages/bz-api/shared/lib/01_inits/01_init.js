/**
 * Created by ashot on 8/12/15.
 */
var global;
if(Meteor.isClient){
  global = typeof window !== 'undefined' && window !== null ? window : {};
} else if (Meteor.isServer) {
  global = typeof GLOBAL !== 'undefined' && GLOBAL !== null ? GLOBAL : {};
}
global.bz = {}
global.bz.cols = {}
global.bz.runtime = {}