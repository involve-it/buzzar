/**
 * Created by ashot on 8/12/15.
 */
// here will be creation and description of all arrays, related to hashes, tags, searches etc.

Meteor.startup(function () {

  ocn.cols.siteTypes = new Mongo.Collection('siteTypes');
  ocn.cols.siteTypes.remove({});
  ocn.cols.siteTypes.insert({
    name: 'trade'
  });
  ocn.cols.siteTypes.insert({
    name: 'charity'
  });
  ocn.cols.siteTypes.insert({
    name: 'jobs'
  });
  ocn.cols.siteTypes.insert({
    name: 'housing'
  });

  // SITES
  ocn.cols.sites = new Mongo.Collection('sites');
  ocn.cols.sites.remove({});
  ocn.cols.sites.insert({
    name: 'craigslist'
  });
  ocn.cols.tags.insert({
    name: 'youcaring'
  });
  ocn.cols.tags.insert({
    name: 'linkedin'
  });
  ocn.cols.tags.insert({
    name: 'monster'
  });
});