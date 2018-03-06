/**
 * Created by ashot on 8/20/15.
 */
  // extend standard and vendor objects:
(function () {
  //create new String.prototype method that will convert string to 'Capitalized' (first letter of each word capital):
  if (String && String.prototype && !String.prototype.toCapitalCase) {
    String.prototype.toCapitalCase = function () {
      return this.replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
      });
    }
    //create new String.prototype method that will convert string to 'Capitalized' (first letter capital):
    if (String && String.prototype && !String.prototype.toCapitalFirst) {
      String.prototype.toCapitalFirst = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
      }
    }
  }
})();
/*bz.help.safeCode(function() {
 if(!Array.prototype.first){
 Array.prototype.first = function(){
 return this[0];
 }
 }
 if(!HTMLCollection.prototype.first) {
 HTMLCollection.prototype.first = function () {
 return this[0];
 }
 }
 });*/

bz.help.safeCode(function () {
  if (Number.prototype.toRadians === undefined) {
    Number.prototype.toRadians = function () {
      return this * Math.PI / 180;
    };
  }


  /** Extend Number object with method to convert radians to numeric (signed) degrees */
  if (Number.prototype.toDegrees === undefined) {
    Number.prototype.toDegrees = function () {
      return this * 180 / Math.PI;
    };
  }
  // UNDERSCORE:
  if (_ && !_.guid) {
    _.guid = function () {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
  }
  if (_ && !_.param) {
    _.param = function (parameters) {
      return _.map(_.keys(parameters), function (item) {
        return item + '=' + parameters[item];
      }).join('&');
    }
  }
});

// extend Router to enable having non-saved-form-cancellation:
bz.help.safeCode(function () {
//use this API in the routes:
//  onAfterAction: Router.AddHooksToCheckFormSaved
//  onStop: Router.UnsavedPageRouteStopHandler
// in JS set bz.runtime.changesNotSaved = true

  var origGo = Router.go, linksSelector = 'a[href]:not([href*=\\#]):visible';
  Router.AddHooksToCheckFormSaved = function (decider) {
    $(linksSelector).off('click', checkFormIsSaved);
    $(linksSelector).on('click', {decider: decider}, checkFormIsSaved);
    Router.go = function () {
      if (checkFormIsSaved(decider)) {
        origGo.apply(this, arguments);
      }
    }
  };
  Router.UnsavedPageRouteStopHandler = function () {
    $(linksSelector).off('click', checkFormIsSaved);
    Router.go = origGo;
  };

  function standardDecider() {
    return confirm('You have unsaved data. Are you sure you want to leave?');
  }

  function checkFormIsSaved(e) {
    var decider = standardDecider,
      ret = true;
    if (e && e.data && e.data.decider && typeof e.data.decider === 'function') {
      decider = e.data.decider;
    } else if (typeof e === 'function') {
      decider = e;
    }

    if (bz.runtime.changesNotSaved === true) {
      if (decider()) {
        ret = true;
        bz.runtime.changesNotSaved = false;
      } else {
        ret = false;
      }
    }
    return ret;
  };
  Router.getCurrentRouteName = function(){
    var cur = Router.current();
    return cur && cur.route && cur.route.getName();
  }
});