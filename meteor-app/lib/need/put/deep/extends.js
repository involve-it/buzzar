/**
 * Created by ashot on 8/20/15.
 */
  // extend standard and vendor objects:
(function () {
  //create new String.prototype method that will convert string to 'Capitalized' (first letter of each word capital):
  if (String && String.prototype && !String.prototype.toCapitalCase) {
    String.prototype.toCapitalCase = function () {
      return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    }
    //create new String.prototype method that will convert string to 'Capitalized' (first letter capital):
    if (String && String.prototype && !String.prototype.toCapitalFirst) {
      String.prototype.toCapitalFirst = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
      }
    }
  }
})();