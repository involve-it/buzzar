
Template.aboutUsRu.events({
  'click a[href*="#"]:not([href="#"])':function(e, v) {
    
    /* smooth scroll */
    
    /*if (location.pathname.replace(/^\//,'') == e.target.pathname.replace(/^\//,'') && location.hostname == e.target.hostname) {
      var target = $(e.target.hash);
      target = target.length ? target : $('[name=' + e.target.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }*/
    
  }
});

Template.bzAboutHowItWorks.onRendered(function() {
  
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









