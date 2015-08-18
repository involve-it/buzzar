/**
 * Created by ashot on 8/12/15.
 */
// here will be creation and description of all arrays, related to hashes, tags, searches etc.

Meteor.startup(function () {

  bzr.colls.siteTypes = new Mongo.Collection('siteTypes');
  bzr.colls.siteTypes.remove({});
  bzr.colls.siteTypes.insert({
    name: 'trade'
  });
  bzr.colls.siteTypes.insert({
    name: 'charity'
  });
  bzr.colls.siteTypes.insert({
    name: 'jobs'
  });
  bzr.colls.siteTypes.insert({
    name: 'housing'
  });

  // SITES
  bzr.colls.sites = new Mongo.Collection('sites');
  bzr.colls.sites.remove({});
  bzr.colls.sites.insert({
    name: 'craigslist'
  });
  bzr.colls.tags.insert({
    name: 'youcaring'
  });
  bzr.colls.tags.insert({
    name: 'linkedin'
  });
  bzr.colls.tags.insert({
    name: 'monster'
  });
});