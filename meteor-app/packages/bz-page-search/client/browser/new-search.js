/**
 * Created by douson on 2/5/16.
 */

var clicked = false, clickX;

(function ($, document, window, navigator, undefined) {
  "use strict";
  
  bz.ui.newSearchControl = {
    
    focusInput: function(e, v) {
      //$('.bz-search-box-filter').removeClass('filters-closed').find('.bz-additional-filters-search').hide();
      
      /*open filter*/
      if(v.$('.bz-search-box-filter').hasClass('filters-closed')) {
        this.open(e, v);
      }
    },
    open: function(e, v) {
      var hasTarget = v.$('.bzSearchTmpl-common').parent('.bz-filters-box');
      var filterName = Router.current().route.getName();
      /*!hasTarget.hasClass('bz-filters-box')*/
      if(!hasTarget.hasClass('bz-filters-box')) {
        setSearchFiltersTemplate(false, this);
      } 
      
      if(filterName !== 'home') {
        setSearchFiltersTemplate(filterName.toCapitalCase(), this);
      }
      
      //v.$('.bz-search-box-filter').toggleClass('filters-closed');
      
      if(v.$('.bz-search-box-filter').hasClass('filters-closed')) {
        v.$('.bz-btn-filters').addClass('active');
        v.$('.bz-search-box-filter').removeClass('filters-closed');
        v.$('.bz-form-control').focus();
      }else {
        v.$('.bz-btn-filters').removeClass('active');
        v.$('.bz-search-box-filter').addClass('filters-closed');
      }
    },
    close: function(e) {
      $('.bz-btn-filters').removeClass('active');
      $('.bz-search-box-filter').addClass('filters-closed');
    }
    
  }
}(jQuery, document, window, navigator));


Template.searchFiltersJobs.onRendered(function() {
  //var name = Session.get('bz.control.category-list.activeCategories').join() || '';
  //setSearchFiltersTemplate(name.toCapitalCase(), this);
  //setSearchFiltersTemplate('jobs'.toCapitalCase(), this);
  $('.bz-ui-dropdown').foundationSelect();
  
});


/* Close the window filters on action click somewhere on the page */
Template.bzNewControlSearch.onRendered(function() {
  $('body').bind('click', function(e) {
    var target = e.target;
    if (!$(target).is('.bz-control--search') && !$(target).parents().is('.bz-control--search')) {
      if(!$('.bz-search-box-filter').hasClass('filters-closed')) {
        /*close filter*/
        bz.ui.newSearchControl.close(e);
      }
    }
  });
  
  Meteor.typeahead.inject();
  Session.set('bz.control.search.searchedText', '');

  /* autocomplete = off */
  $('.js-nearby-places').attr('autocomplete', 'off');
  
  $('.post-find-wrapper').append($('.tt-menu'));
  
});


Template.bzNewControlSearch.events({
  'focus .bz-form-control': function(e, v) {
    bz.ui.newSearchControl.focusInput(e, v);
  },
  'click .js-item-category': function(e, v) {
    /* need update masonry here */
    var textInput =  v.$('.bz-form-control')[1];
    $(textInput).val(this.intName);

    /* 1 */
    var clearBtn = $('.js-reset-field'),
        style = ($(textInput).val().length) ? 'visible' : 'hidden';
    clearBtn.css('visibility', style);

    /* загрузка шаблона в зависимости от выбора кнопки */
    //var name = Session.get('bz.control.category-list.activeCategories').join() || '';
    //setSearchFiltersTemplate(name.toCapitalCase(), this);
    
  },
  'keyup .bz-form-control': function(e, v) {
    /* 1 */
    var textInput =  v.$('.bz-form-control')[1],
        clearBtn = v.$('.js-reset-field'),
        style = ($(textInput).val().length) ? 'visible' : 'hidden';
    
    clearBtn.css('visibility', style);
    
  },
  'click .js-reset-field': function(e, v) {
    /* 1 */
    var textInput =  v.$('.bz-form-control')[1],
        clearBtn = v.$('.js-reset-field');
    
    clearBtn.css('visibility', 'hidden');
    
    /*НЕ ЗАБЫТЬ СДЕЛАТЬ ПРОВЕРКУ. ВДРУГ КНОПКА ДОСТУПНА ТОЛЬКО ДЛЯ ВВЕДЕННОГО ТЕКСТА А НЕ КНОПОК */
    
    /*turn off the service buttons*/
    //Session.set('bz.control.category-list.activeCategories', []);
    /*erase input value*/
    $(textInput).val('');
    
    /* СДЕЛАТЬ ЗАКРЫТИЕ ПАНЕЛИ ФИЛЬТРА */
  },
  'click .js-toggle-filters': function(e, v) {
    /* set template as jobs */
    //setSearchFiltersTemplate('jobs'.toCapitalCase(), this);
    bz.ui.newSearchControl.open(e, v);
  },
  'click .js-search-btn': function (e, v) {
    var text = $('.js-nearby-places.tt-input').val();
    if (text) {
      Session.set('bz.control.search.searchedText', text);
    }
    return false;
  },
  'change .js-nearby-places': function (e) {
    var val = e.target.value;
    if (!val || val.trim() === '') {
      Session.set('bz.control.search.searchedText', '');
    }
  },
  'typeahead:change .js-nearby-places': function (e, v, val) {
    val = val && val.trim() || '';
    Session.set('bz.control.search.searchedText', val);
  },
  'typeahead:select .js-nearby-places': function (e, v, val) {
    val = val.name && val.name.trim() || '';
    Session.set('bz.control.search.searchedText', val);
   /* $('.js-nearby-places').typeahead('close');
    $('.js-nearby-places').blur();*/
  },
  'keydown .js-nearby-places': function (e, v, val) {
    if (e.keyCode === 13) {
      // enter bnt hit
      /*$('.js-nearby-places').typeahead('close');
      $('.js-nearby-places').blur();*/

      $('.js-search-btn').click();
    }
  }
});


Template.bzNewControlSearch.helpers({
  joinedArray: function(query, process) {
    
    return [
      {
        name: 'post-found',
        valueKey: 'name',
        displayKey: 'name',
        templates: {
          notFound: ['<div class="empty-message"><b>Not Found</b></div>']
        },
        //template: 'newPostFoundItem',
        /*header: '<h3 class="league-name">Posts found</h3>',*/
        local: function () {
          var searchSelector = {
                'status.visible': bz.const.posts.status.visibility.VISIBLE
              },
              catList = Session.get('bz.control.category-list.activeCategories');

          if (catList && catList.length > 0) {
            searchSelector.type = {$in: catList};
          }

          Session.set('bz.control.search-selector', searchSelector);
          var ret = _.unique(bz.cols.posts.find(searchSelector).fetch().map(function (item) {
            item.name = item.details.title;
            return item;
          }), function (item) {
            return item.name
          });
          return ret;
        }
      }]
  }
});


Template.bzNewControlSearch.helpers({
  placesArray: function () {
    return bz.runtime.maps.places.find().fetch().map(function (object) {
      return {id: object._id, value: object.name};
    });
  },
  searchItemSelected: function (event, suggestion, datasetName) {
    var mapsPlaceId = suggestion && suggestion.id;
    //bz.runtime.newPost.location.mapsPlaceId = mapsPlaceId;
    // make it look selected:
    $('.js-location-nearby').addClass('selected');
  },
  searchTagIsVisible: function(e, v){
    return Session.get('bz.control.search.searchedText') !== '' && Session.get('bz.control.search.searchedText') !== undefined;
  }
});


Template.bzNewControlSearchFilters.helpers({
  countSearchRQ: function() {
    var ret, loc = Session.get('bz.control.search.location'),
        activeCats = Session.get('bz.control.category-list.activeCategories') || [];
    
    ret = bz.bus.search.doSearchClient({
      loc: loc,
      activeCats: activeCats,
      radius: bz.const.search.AROUND_YOU_RADIUS
    });
    return ret && ret.length;
  }
});


Template.categoryListButtons.events({
  'mousemove ': function(e, v) {
    
    clicked && updateScrollPos(e);
  },
  'mousedown': function(e) {
    clicked = true;
    clickX = e.pageX;
  },
  'mouseup': function(e) {
    clicked = false;
    $('.control--category-list-buttons li').css('cursor', 'auto');
  }
});

Template.searchCommonFilters.events({
  'change.fndtn.slider .js-distance-range-slider': function(e, v) {
    var dist, slDist = $(e.target).attr('data-slider');
    console.log(slDist);
    //todo:  @Slava: этот подход неправильный-возникает туча ивентов (если я веду от 1 мили до 20, то 5 миль тоже выставится по дороге). Change this!!
    if(slDist){
      slDist = slDist.trim();
      switch (slDist){
        case '0':
          dist = 1; // todo: сделать i18n!!
          break;
        case '1':
          dist = 1; // todo: сделать i18n!!
          break;
        case '34':
          dist = 5;
          break;
        case '67':
          dist = 20;
          break;
        case '100':
          dist = -1;
          break;
      }
      Session.set('bz.control.search.distance', dist);
    }
  }
});


/* передать имя фильтра this.intName и view */
function setSearchFiltersTemplate(name, v) {
  var template;
  $('.bz-filters-box').empty();
  
  if(!name) {
    template = Template['searchCommonFilters'];
  } else if(name) {
    template = Template['searchFilters' + name];
  }
  
  if(v && template) {
    Blaze.renderWithData(template, v.data, $('.bz-filters-box')[0]);
    
    $(document).foundation('reflow');
  }
}





var updateScrollPos = function(e) {
  $('.control--category-list-buttons li').css('cursor', 'pointer');
  $('.bz-btn-services').scrollLeft($('.bz-btn-services').scrollLeft() + (clickX - e.pageX));
  
};

Meteor.startup(function () {
  Tracker.autorun(function () {
    
  });
});


