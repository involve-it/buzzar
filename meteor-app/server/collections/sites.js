/**
 * Created by ashot on 8/12/15.
 */
// here will be creation and description of all arrays, related to hashes, tags, searches etc.

Meteor.startup(function () {

  o.cols.siteTypes = new Mongo.Collection('siteTypes');
  o.cols.siteTypes.remove({});
  o.cols.siteTypes.insert({
    name: 'trade'
  });
  o.cols.siteTypes.insert({
    name: 'charity'
  });
  o.cols.siteTypes.insert({
    name: 'jobs'
  });
  o.cols.siteTypes.insert({
    name: 'housing'
  });

  // SITES
  o.cols.sites = new Mongo.Collection('sites');
  o.cols.sites.remove({});
  o.cols.sites.insert({
    name: 'craigslist'
  });
  o.cols.tags.insert({
    name: 'youcaring'
  });
  o.cols.tags.insert({
    name: 'linkedin'
  });
  o.cols.tags.insert({
    name: 'monster'
  });
});