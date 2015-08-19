/**
 * Created by ashot on 8/12/15.
 */
// here will be creation and description of all arrays, related to hashes, tags, searches etc.

Meteor.startup(function () {

  bz.cols.siteTypes = new Mongo.Collection('siteTypes');
  bz.cols.siteTypes.remove({});
  bz.cols.siteTypes.insert({
    name: 'trade'
  });
  bz.cols.siteTypes.insert({
    name: 'charity'
  });
  bz.cols.siteTypes.insert({
    name: 'jobs'
  });
  bz.cols.siteTypes.insert({
    name: 'housing'
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