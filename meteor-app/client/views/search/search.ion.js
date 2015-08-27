/**
 * Created by douson on 27.08.15.
 */


Template.showListMap.events({
    'click [data-menu=show-map]': function(event, template) {
        event.preventDefault();
        
        var showSearchList = $('.multipleResult');
        showSearchList.toggleClass('show');
    }
});

