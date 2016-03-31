/**
 * Created by douson on 3/31/16.
 */

exec = Npm.require('child_process').exec;

function _command (cmd, cb) {
  exec(cmd, function (err, stdout, stderr) {
    cb(stdout.split('\n').join(''))
  })
}

var bzVersion = {
  short : function (cb) {
    _command('git rev-parse --short HEAD', cb)
  },
  long : function (cb) {
    _command('git rev-parse HEAD', cb)
  },
  branch : function (cb) {
    _command('git rev-parse --abbrev-ref HEAD', cb)
  },
  tag : function (cb) {
    _command('git describe --always --tag --abbrev=0', cb)
  },
  timestamp: function(cb) {
    _command('git log -1 --pretty=format:%ci', cb)
  }
};


var wrappedUpdate = Meteor.bindEnvironment(function(revId, key, value) {
  var modifier = {
    //timestamp : moment().format("DD-MM-YYYY HH:mm")
  };

  modifier[key] = value;

  bz.cols.version.update(revId, { $set: modifier }, function(err) {
    if (err) return console.error(err);
  });
});


Meteor.startup(function() {
  if (bz.cols.version.find().count() > 0) bz.cols.version.remove({});

  var revId = bz.cols.version.insert({});

  ['short', 'long', 'branch', 'tag', 'timestamp'].forEach(function(key) {
    
    bzVersion[key](function(value) {
      wrappedUpdate(revId, key, value);
    });
    
    
  });
});

Meteor.publish('version', function () {
  return bz.cols.version.find({});
});


