/**
 * Created by xvolkx48 on 19.02.2016.
 */
bz.cols.profileDetails = new Mongo.Collection('profileDetails');
typeof Ground !== 'undefined' && Ground.Collection(bz.cols.profileDetails);
if (Meteor.isServer) {
  Meteor.publish('profileDetails-my', function () {
    return bz.cols.profileDetails.find({userId: this.userId});
  });
  Meteor.publish('profileDetails-another',function(){
    return bz.cols.profileDetails.find({policy: '1'});
  });
}