/**
 * Created by ashot on 8/20/15.
 */
if(Meteor.isClient) {
  bz.cols.postAdTypes = new Mongo.Collection('siteTypes');
  Meteor.subscribe('siteTypes');
}