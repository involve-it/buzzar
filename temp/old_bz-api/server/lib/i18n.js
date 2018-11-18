/**
 * Created by arutu_000 on 12/29/2015.
 */
Meteor.publishI18n = function(name, handler, options) {
  var i18n_handler;
  if (name === null) {
    throw new Meteor.Error(500, "publishI18n doesn't support null publications");
  }
  i18n_handler = function() {
    var args, cursors, language_tag;
    args = Array.prototype.slice.call(arguments);
    language_tag = _.last(args);
    this.language = language_tag;
    Fiber.current.language_tag = language_tag;
    cursors = handler.apply(this, args.slice(0, -1));
    delete Fiber.current.language_tag;
    if (cursors != null) {
      return cursors;
    }
  };
  return Meteor.publish(name, i18n_handler, options);
};