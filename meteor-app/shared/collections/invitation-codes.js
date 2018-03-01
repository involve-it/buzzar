/**
 * Created by arutu_000 on 12/29/2015.
 */


if (Meteor.isClient){
  bz.cols.invitationCodes = new Mongo.Collection('invitationCodes');
  Meteor.subscribe('invitationCodes');
  bz.cols.invitationCodeTypes = new Mongo.Collection('invitationCodeTypes');
  Meteor.subscribe('invitationCodeTypes');
}