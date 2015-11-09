/**
 * Created by arutu_000 on 10/3/2015.
 */
Template.pageContactUs.events({
  'click .js-send-btn': function(e, v){
    var msg = $('.js-message-text').val();
    if(msg){
      Meteor.call('sendMessageContactUs', msg, Meteor.userId(), function(err, res){
        if(res && res!=='') {
          alert('Message was successfully sent, we appreciate your feedback!');
          //sAlert.success('Message was successfully sent, we appreciate your feedback!');
          v.$('.js-message-text').val('');
        }
        if(err){
          alert('error sending message:' + err);
        }
      });
    }
  }
})

