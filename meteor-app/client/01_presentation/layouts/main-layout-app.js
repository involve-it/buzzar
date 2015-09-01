/**
 * Created by douson on 06.07.15.
 */

Template.ionSideMenuContent.rendered = function() {
    
    var template = this;
    var content = this.find('.menu-content');
    content.setAttribute('id', 'drag-content');
};


Template.ionBody.rendered = function () {

    /*side menu settings*/
    if( Meteor.user() ) {
      
        IonSideMenu.snapper.settings({
            /*disable: 'right',*/
            /*touchToDrag: false,*/
            /*hyperextensible: false,*/
            element: document.getElementById('drag-content'),
            dragger: document.getElementById('drag-right')
        });
      
    }
};
