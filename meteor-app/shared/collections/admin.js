/**
 * Created by arutu_000 on 10/3/2015.
 */
bz.cols.contactUsMsgs = new Mongo.Collection('bz.contactUsMsgs');
bz.cols.errorLogs = new Mongo.Collection('errorLogs');

if(Meteor.isServer)  {
  //bz.cols.contactUsMsgs.remove({});
}