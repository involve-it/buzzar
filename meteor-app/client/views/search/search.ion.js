/**
 * Created by douson on 27.08.15.
 */


Template.globalSearchIon.rendered = function() {
    

    
};

Template.showListMap.events({
    'click [data-menu=multipleSearchTemplate]': function(event, template) {
        event.preventDefault();
        
        var name = template.$(event.target).data('menu');
        Session.set('activeTemplate', name);

        var showSearchList = $('.multipleResult');
        showSearchList.addClass('animated  flipInY').toggleClass('show');
    }
});



/* Make category list */
Template.boxCategory.helpers({
    getCategoryItems:function() {
        var data = data || [];

        data = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
        return _.map(data, function(value, index) {
            return {value: value, index:index};
        });
    },
    active: function() {
        return (Session.get('activeCategory') === this.value) ? 'active' : '';
    }
});

Template.boxCategory.events({
    'click .item-category': function(event, template) {
        
        Session.set('activeTemplate', 'singleSearchTemplate');
        
        /*Active link*/
        return Session.set('activeCategory', this.value);
    }
});



/* Dynamic template */
Template.panelSearchResult.helpers({
    activeTemplate: function() {
        return Session.get('activeTemplate');
    }
});




