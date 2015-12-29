/**
 * Created by ashot on 8/12/15.
 */
// here will be creation and description of all arrays, related to hashes, tags, searches etc.

Meteor.startup(function () {

  bz.cols.mapsDistances = new Mongo.Collection('bz.mapsDistances');
  /*bz.cols.postAdTypes.remove({});
  bz.cols.postAdTypes.insert({
    name: 'help',
    fullName: 'Need or Give Help',
    color: 'D86055',
    order: 0
  });
  bz.cols.postAdTypes.insert({
    name: 'connect',
    fullName: 'Looking for Connections',
    color: 'F77012',
    order: 1
  });

  bz.cols.postAdTypes.insert({
    name: 'trade',
    fullName: 'Buy & Sell',
    color: 'EF376C',
    order: 2
  });
  bz.cols.postAdTypes.insert({
    name: 'jobs',
    fullName: 'Job Market',
    color: '730928',
    order: 3
  });
  bz.cols.postAdTypes.insert({
    name: 'housing',
    fullName: 'Housing Market',
    color: 'B70808',
    order: 4
  });
  bz.cols.postAdTypes.insert({
    name: 'events',
    fullName: 'Local events',
    color: 'B70808',
    order: 5
  });
  Meteor.publish('siteTypes', function(){
    return bz.cols.postAdTypes.find({}, {sort: ['order','asc']});
  });

  // SITES
  bz.cols.sites = new Mongo.Collection('sites');
  bz.cols.sites.remove({});
  bz.cols.sites.insert({
    name: 'craigslist'
  });
  bz.cols.tags.insert({
    name: 'youcaring'
  });
  bz.cols.tags.insert({
    name: 'linkedin'
  });
  bz.cols.tags.insert({
    name: 'monster'
  });*/
});
