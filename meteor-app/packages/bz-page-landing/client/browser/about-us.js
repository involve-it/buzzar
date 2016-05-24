
Template.bzAboutHowItWorks.onRendered(function() {

  /*$(document).foundation({
    "magellan-expedition": {
      active_class: 'active', // specify the class used for active sections
      threshold: 0, // how many pixels until the magellan bar sticks, 0 = auto
      destination_threshold: 0, // pixels from the top of destination for it to be considered active
      throttle_delay: 50, // calculation throttling to increase framerate
      fixed_top: 0, // top distance in pixels assigend to the fixed element on scroll
      offset_by_height: true // whether to offset the destination by the expedition height. Usually you want this to be true, unless your expedition is on the side.
    }
  });*/
  
  
  /* module Sticky */
  $('.ui.sticky').sticky({context: '#context'});
  
  
});


Template.bzAboutHowItWorks.events({
  'click .bz-read-more a': function(e, t) {
    
    $(e.target).closest('.bz-next-text').find('.bz-text-more').toggle('fast', function() {
      $(this).closest('.bz-next-text').find('.bz-read-more').hide();
    });

    var tar = $(e.target).closest('.bz-next-text');
    if(tar.attr('data-hidden') === 'false') {
      tar.attr('data-hidden', true);
      $('.ui.sticky').sticky('refresh');
    } else {
      tar.attr('data-hidden', false);
      $('.ui.sticky').sticky('refresh');
    }

    recalculatesSticky();
    
  }
});

Template.bzAboutWhatUseful.events({
  'click .bz-read-more a': function(e, t) {
    
    $(e.target).closest('.bz-next-text').find('.bz-text-more').toggle('fast', function() {
      $(this).closest('.bz-next-text').find('.bz-read-more').hide();
    });

    var tar = $(e.target).closest('.bz-next-text');
    if(tar.attr('data-hidden') === 'false') {
      tar.attr('data-hidden', true);
    } else {
      tar.attr('data-hidden', false);
    }

    recalculatesSticky();
    
  }
});


function recalculatesSticky() {
  setTimeout(function() {
    $('.ui.sticky').sticky('refresh');
  }, 1000)
}









