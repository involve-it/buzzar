/**
 * Created by douson on 3/31/16.
 */

var versionHandle = Meteor.subscribe("version");


Template.registerHelper('gitRev', function(str) {
  if (!versionHandle.ready()) return null;

  check (str, String);

  var ver = bz.cols.version.find().fetch()[0];

  switch (str) {
    case 'short': return ver.short;
    case 'long': return ver.long;
    case 'branch': return ver.branch;
    case 'tag': return ver.tag;
    case 'timestamp': return ver.timestamp;
    default:
      throw new Meteor.Error(
          "Key '" + str + "' not defined", "Available Keys are 'short' or 'long' (git commit hashes), 'tag' or 'branch'."
      );
  }
});

