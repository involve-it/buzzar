/**
 * Created by arutu_000 on 12/24/2015.
 */
import { Accounts } from 'meteor/accounts-base';
Meteor.methods({
    'bz.auth.forgotPassword': function(email) {
        Meteor.call('forgotPassword', {
            email: email
        }, function(){debugger;});
    },
    'bz.auth.resetPassword': function(token, newPassword) {
        // under construction
        console.log(Accounts.resetPassword);
        /*Meteor.call('resetPassword', token, newPassword);
        //Accounts.resetPassword(token, newPassword, [callback])
        Accounts.resetPassword(token, newPassword, () => {
        });*/
    }
})