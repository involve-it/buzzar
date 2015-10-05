/**
 * Created by douson on 14.07.15.
 */
Template.replyArea.events({
    'click ': function(e, tmpl) {
        e.preventDefault();
        
        var textArea = tmpl.$('...');
        var val = textArea.val();
        
        textArea.attr('disable', 'disable');
        
        /* ... */
    },
    'keypress textarea': function(e, tmpl) {
        if(e.keyCode === 13) {
            e.preventDefault();
            tmpl.$('...').submit();
        }
    }
});