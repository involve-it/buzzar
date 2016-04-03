/**
 * Created by ashot on 8/20/15.
 */
bz.help.makeNamespace({
  path: 'bz.config',
  object: {
    env: 'dev',
    //env: 'prod',
    isCordova: Meteor.isCordova,
    mapsKey: '',
    version: 'v1.0'
  }
})

// Set up login services
Meteor.startup( function () {
  ServiceConfiguration.configurations.remove({
    $or: [ {service: "facebook"}, {service: "twitter"}, {service: "google"} ]
  });
  // Add Facebook configuration entry
  ServiceConfiguration.configurations.insert({
    "service": "facebook",
    "appId": "1025008177543236",
    "secret": "4fc9a62ae0c00d10fd8acdd2a66f695b"
  });
});

// Handle merge of application specific DB items
Meteor.methods({

  // After merging a user we need to change owner on orpahned collection items
  // (i.e. one user was deleted in the merge, move it's items to the
  // destination user).
  mergeItems: function (mergedUserId) {

    console.log('Merging DB items of user', mergedUserId, 'with user', Meteor.userId());

    //  You'd typically do something like:

    /*
     try {
     var affectedRows = Items.update ({"owner":mergedUserId}, {$set: {"owner": Meteor.userId()}}, {"multi": true});
     } catch (e) {
     // TODO: Items are lost in merge when exception occurs - should clean up
     // orphans too, or make update continue after duplicate error.
     // On error (typically "duplicate item", if you have unique indexes in
     // the items collection), throw exception.
     throw new Meteor.Error(500, e.toString());
     }
     return affectedRows;
     */
  }
});
