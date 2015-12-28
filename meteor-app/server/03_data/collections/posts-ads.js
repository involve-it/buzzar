/**
 * Created by ashot on 8/12/15.
 */
// here will be creation and description of all arrays, related to hashes, tags, searches etc.

Meteor.startup(function () {

  bz.cols.siteTypes = new Mongo.Collection('siteTypes');
  bz.cols.siteTypes.remove({});
  // we add id's so that it's consistent:
  bz.cols.siteTypes.insert({
    name: 'help',
    id: 'M5g7ujcKXEx5LHJzc',
    fullName: 'Need or Give Help',
    color: 'D86055',
    order: 0
  });
  bz.cols.siteTypes.insert({
    name: 'connect',
    id: 'ZiGto5xhe4TgAYJhe',
    fullName: 'Looking for Connections',
    color: 'F77012',
    order: 1
  });

  bz.cols.siteTypes.insert({
    name: 'trade',
    id: 'fveonD9cC3i33LfKj',
    fullName: 'Buy & Sell',
    color: 'EF376C',
    order: 2
  });
  bz.cols.siteTypes.insert({
    name: 'jobs',
    id: 'qGedj9iA6jS7inCCk',
    fullName: 'Job Market',
    color: '730928',
    order: 3
  });
  bz.cols.siteTypes.insert({
    name: 'housing',
    id: 'otEm6ijtatqF7pQj5',
    fullName: 'Housing Market',
    color: 'B70808',
    order: 4
  });
  bz.cols.siteTypes.insert({
    name: 'events',
    id: 'WsCLpEkN4tpAHxE5w',
    fullName: 'Local events',
    color: '333308',
    order: 5
  });
  bz.cols.siteTypes.insert({
    name: 'services',
    id: '8qzzsToxam3GCTEXT',
    fullName: 'Need or provide service',
    color: '370808',
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
