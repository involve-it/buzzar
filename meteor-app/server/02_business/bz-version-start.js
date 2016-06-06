/**
 * Created by douson on 3/31/16.
 */

var exec = Npm.require('child_process').exec,
    fs = Npm.require('fs'),
    path = Npm.require('path'),
    Promise = Npm.require('promise'),
    contents = null,
    fPath = fs.realpathSync('/'),
    basePath = path.resolve('.').split('.meteor')[0],
    result = {};


function getBranch() {
  return new Promise(function(fulfill, reject) {
    exec('git rev-parse --abbrev-ref HEAD', function (err, stdout, stderr) {
      if(err)reject(err);
      var name = stdout.replace('* ','').replace('\n','');
      fulfill(name);
    })
  });
}

function getShort() {
   return new Promise(function(fulfill, reject) {
     exec('git rev-parse --short HEAD', function (err, stdout, stderr) {
       if(err)reject(err);
       var name = stdout.replace('* ','').replace('\n','');
       fulfill(name);
     })
   });
 }

 function getLong() {
   return new Promise(function(fulfill, reject) {
     exec('git rev-parse HEAD', function (err, stdout, stderr) {
       if(err)reject(err);
       var commitName = stdout.replace('* ','').replace('\n','');
       fulfill(commitName);
     })
   });
 }

function getTag() {
   return new Promise(function(fulfill, reject) {
     exec('git describe --always --tag --abbrev=0', function (err, stdout, stderr) {
       if(err)reject(err);
       var commitName = stdout.replace('* ','').replace('\n','');
       fulfill(commitName);
     })
   });
 }

 function getTimestamp() {
   return new Promise(function(fulfill, reject) {
     exec('git log -1 --pretty=format:%ci', function (err, stdout, stderr) {
       if(err)reject(err);
       var commitName = stdout.replace('* ','').replace('\n','');
       fulfill(commitName);
     })
   });
 }

getBranch()
  .then(function(_branch){
    result.branch = _branch;
  })
  .then(getShort)
  .then(function(_short) {
    result.short = _short;
  })
  .then(getLong)
  .then(function(_long) {
    result.long = _long;
  })
  .then(getTag)
  .then(function(_tag) {
    result.tag = _tag;
  })
  .then(getTimestamp)
  .then(function(_timesStamp) {
    result.timestamp = _timesStamp;
  })
  .then(function() {
    var fileContent = JSON.stringify(result, null, 5),
        pathFile = basePath + '/private/version.json';
  
    if(fs.existsSync(pathFile)) {
      fs.writeFile(pathFile, fileContent , function(err) {
        (err) ? console.log(err) : console.log("The file was saved!");
      });
    } else {
      throw new Error(pathFile + ' does not exists');
    }
});


Meteor.startup(function() {
  if (bz.cols.version.find().count() > 0) {
    bz.cols.version.remove({});
  }

  bz.cols.version.insert(JSON.parse(Assets.getText("version.json")));
  
});


Meteor.publish('version', function () {
  return bz.cols.version.find({});
});


