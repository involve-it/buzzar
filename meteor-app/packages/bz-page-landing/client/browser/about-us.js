
Template.bzAboutHowItWorks.onRendered(function() {

  $(document).foundation({
    "magellan-expedition": {
      active_class: 'active', // specify the class used for active sections
      threshold: 0, // how many pixels until the magellan bar sticks, 0 = auto
      destination_threshold: 0, // pixels from the top of destination for it to be considered active
      throttle_delay: 50, // calculation throttling to increase framerate
      fixed_top: 0, // top distance in pixels assigend to the fixed element on scroll
      offset_by_height: true // whether to offset the destination by the expedition height. Usually you want this to be true, unless your expedition is on the side.
    }
  });
  
  
  /* module Sticky */
  $('.ui.sticky').sticky({context: '#context'});
  
  
  /*var equalHeight = function(container) {

    var currentTallest = 0,
        currentRowStart = 0,
        rowDivs = [],
        $el,
        topPosition = 0;
    
    $(container).each(function() {
      
      $el = $(this);
      $($el).height('auto');
      topPosition = $el.position().top;

      if (currentRowStart != topPosition) {
        for (var currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
          rowDivs[currentDiv].height(currentTallest);
        }
        rowDivs.length = 0; // empty the array
        currentRowStart = topPosition;
        currentTallest = $el.height();
        rowDivs.push($el);
      } else {
        rowDivs.push($el);
        currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
      }
      
      for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
        rowDivs[currentDiv].height(currentTallest);
      }
    })
  };*/

  
    /*$(window).load(function() {
      equalHeight('.bz-random-target .bz-three-cards  .card');
    });


    $(window).resize(function(){
      equalHeight('.bz-random-target .bz-three-cards  .card');
    });*/

  
  
});


Template.bzAboutHowItWorks.events({
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
    
  }
});












