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
bz.help.safeCode(function(){
  if (Number.prototype.toRadians === undefined) {
    Number.prototype.toRadians = function() { return this * Math.PI / 180; };
  }


  /** Extend Number object with method to convert radians to numeric (signed) degrees */
  if (Number.prototype.toDegrees === undefined) {
    Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
  }
});