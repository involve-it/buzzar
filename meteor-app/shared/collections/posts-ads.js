/**
 * Created by arutu_000 on 12/29/2015.
 */
if (Meteor.isClient){
  bz.cols.postAdTypes = new Mongo.Collection('postAdTypes');
  Meteor.subscribe('postAdTypes');
}