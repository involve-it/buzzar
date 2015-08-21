/**
 * Created by douson on 06.07.15.
 */



Template.ionBody.rendered = function () {

    /*side menu settings*/
    
        IonSideMenu.snapper.settings({
            /*disable: 'right',*/
            touchToDrag: false,
            /*dragger: document.getElementById('element here'),*/
            hyperextensible: false
        });

};
