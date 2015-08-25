/**
 * Created by ashot on 8/12/15.
 */
// here will be creation and description of all arrays, related to hashes, tags, searches etc.

Meteor.startup(function () {

  bz.cols.siteTypes = new Mongo.Collection('siteTypes');
  bz.cols.siteTypes.remove({});
  bz.cols.siteTypes.insert({
    name: 'trade',
    fullName: 'Buy & Sell',
    order: 1
  });
  bz.cols.siteTypes.insert({
    name: 'charity',
    fullName: 'Need Your Help',
    order: 0
  });
  bz.cols.siteTypes.insert({
    name: 'jobs',
    fullName: 'Job Market',
    order: 3
  });
  bz.cols.siteTypes.insert({
    name: 'housing',
    fullName: 'Housing Market',
    order: 4
  });
  bz.cols.siteTypes.insert({
    name: 'criminal',
    fullName: 'Criminal',
    order: 5
  });
  Meteor.publish('siteTypes', function(){
    return bz.cols.siteTypes.find({}, {sort: ['order','asc']});
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
  });
});
