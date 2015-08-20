/**
 * Created by ashot on 8/20/15.
 */
var Helpers = {}
/**
 * This function is for constructing namespace objects from a string, attaching it to a global window object.
 * If some objects already exist, it will extend them. Dependant on the underscore.js library.
 * this can span multiple lines.
 *
 * @method MakeGlobalNamespaceAndObject
 * @param {Object} initialObject - main config object, containing:
 *	- path: names of objects in the chain, delimited by '.'
 *	- object: the object that will be placed into the namespace end.
 *	  if object is not provided, just create the namespace, if it does not exist yet.
 *	OR initialObject can be a string, in which case consider it as a new namespace,
 *	  and the object non-defined.
 * @return {Object} final object assigned to the namespace.
 */
Helpers.makeNamespace = function (initialObject) {
  if (initialObject && typeof initialObject === 'string') {
    initialObject = {
      path: initialObject
    }
  };
  var buildFromName, first, foreverFirst, global, l1, l2, namespace, retObj, sc, subPaths;
  if(Meteor.isClient){
    global = typeof window !== 'undefined' && window !== null ? window : {};
  } else if (Meteor.isServer) {
    global = typeof GLOBAL !== 'undefined' && GLOBAL !== null ? GLOBAL : {};
  }

  if (typeof global === 'string') {
    global = eval(global);
  }
  subPaths = initialObject.path.split('.').reverse();
  foreverFirst = subPaths[0];
  first = subPaths.pop();
  namespace = global[first] = typeof global[first] !== 'undefined' && global[first] || {};
  if (subPaths.length === 0) {
    if (typeof global[first] !== 'undefined' && global[first]) {
      _.extend(global[first], initialObject);
    } else {
      global[first] = initialObject.object;
    }
    return namespace;
  }
  retObj = null;
  l1 = l2 = subPaths.length;
  buildFromName = function (paths, ns) {
    var retns;
    if (paths.length <= 0) {
      return ns;
    }
    first = subPaths.pop();
    retns = typeof ns[first] !== 'undefined' && ns[first] || {};
    ns[first] = buildFromName(paths, retns);
    if (l1 === l2) {
      if (typeof initialObject.object !== 'undefined') {
        if (!_.isObject(initialObject.object)) {
          ns[foreverFirst] = initialObject.object;
        } else {
          ns[foreverFirst] = _.extend(ns[foreverFirst], initialObject.object);
        }
      }
      retObj = _.extend(ns[foreverFirst] != null ? ns[foreverFirst] : ns[foreverFirst] = {}, retObj != null ? retObj : retObj = {});
    }
    l1 = l1 - 1;
    return ns;
  };
  namespace = buildFromName(subPaths, namespace);
  return retObj;
};


/**
 * This function is for wrapping custom function for safe code execution
 * If exception of any kind is thrown, it will either be thrown
 *	or will be logged (if ReferenceError , that stops execution of consequent code in the script).
 *
 * @method MakeGlobalNamespaceAndObject
 * @param {Function} functionWithCode - function object, containing code to execute
 * @param [1..n] - any parameters, that should be passed into the function
 * @return {Object} object, that is returned by functionWithCode / error.
 */
Helpers.safeCode = function (functionWithCode) {
  var ret = undefined;
  if (functionWithCode && typeof functionWithCode === 'function') {

    try {
      ret = functionWithCode.apply(functionWithCode, Array.prototype.slice.call(arguments, 1));
    } catch (ex) {
      ret = ex;
      yc.helpers.logError(ex);
    }
  }
  return ret;
}
Helpers.logError = function (exObject, message, logToRollbar) {
  // check if first argument is of Error type:
  if (typeof exObject === 'object' && exObject instanceof Error) {

  } else if (typeof exObject === 'string' && exObject !== '') {
    message = exObject;

    exObject = new Error(message);
    if (typeof message === 'boolean') {
      logToRollbar = message;
    }
  }
  if (bz && bz.config && bz.config.env) {
    if (bz.config.env === 'dev') {
      if (console) {
        if (console.error) {
          console.error(exObject);
        } else if (console.log) {
          console.log(message);
        }
      }
      // log to rollbar if developer explicetely asked for this:
      logToRollbar && typeof Rollbar !== 'undefined' && Rollbar.error(message, exObject);
    } else if (bz.config.env === 'prod') {
      // do rollbar:
      // send to roolbar, if needed (see this api: https://rollbar.com/docs/notifier/rollbar.js/):
      if (logToRollbar !== false) {// don't log to rollbar if developer explicetely asked for this:
        typeof Rollbar !== 'undefined' && Rollbar.error(message, exObject);
      }
    }
  }
}

Helpers.makeNamespace({
  path: 'bz.help',
  object: Helpers
});