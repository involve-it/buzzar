Template.conversations.onCreated(function() {
       /* 
        //экземпляр текущего шаблона
        var self = Template.home.currentInstance = this;
        //состояние
        var state = Iron.controller().state;
        
  
*/
       
    }

);





Template.conversations.onRendered(function() {



    
});

Template.conversations.helpers({
    chat: function() {
        
    }
});











Template.noChats.events({
    'click .goContacts': function(e) {
        //click & skip animation
        IonNavigation.skipTransitions = true;
        Router.go('/contacts');
    }
});
