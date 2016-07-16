/**
 * Created by douson on 2/5/16.
 */

var clicked = false, clickX;

(function ($, document, window, navigator, undefined) {
    "use strict";

    bz.ui.newSearchControl = {

        focusInput: function (e, v) {
            //$('.bz-search-box-filter').removeClass('filters-closed').find('.bz-additional-filters-search').hide();

            /*open filter*/
            if (v.$('.bz-search-box-filter').hasClass('filters-closed')) {
                this.open(e, v);
            }
        },
        open: function (e, v) {
            var hasTarget = v.$('.bzSearchTmpl-common').parent('.bz-filters-box');
            var filterName = Router.current().route.getName();
            /*!hasTarget.hasClass('bz-filters-box')*/


            if (filterName === 'home') {
                setSearchFiltersTemplate(false, v);
            } else if (!hasTarget.hasClass('bz-filters-box')) {
                setSearchFiltersTemplate(filterName.toCapitalCase(), v);
            }

            //v.$('.bz-search-box-filter').toggleClass('filters-closed');

            if (v.$('.bz-search-box-filter').hasClass('filters-closed')) {
                v.$('.bz-btn-filters').addClass('active');
                v.$('.bz-search-box-filter').removeClass('filters-closed');
                v.$('.cd-primary-nav').addClass('nav-is-visible');
                v.$('.bz-form-control').focus();
            } else {
                v.$('.bz-btn-filters').removeClass('active');
                v.$('.bz-search-box-filter').addClass('filters-closed');
                v.$('.cd-primary-nav').removeClass('nav-is-visible');
            }
        },
        close: function (e) {
            $('.bz-btn-filters').removeClass('active');
            $('.bz-search-box-filter').addClass('filters-closed');
            $('.cd-primary-nav').removeClass('nav-is-visible');
        }

    }
}(jQuery, document, window, navigator));


Template.searchFiltersJobs.onRendered(function () {
    //var name = Session.get('bz.control.category-list.activeCategories').join() || '';
    //setSearchFiltersTemplate(name.toCapitalCase(), this);
    //setSearchFiltersTemplate('jobs'.toCapitalCase(), this);
    $('.bz-ui-dropdown').foundationSelect();

});


/* Close the window filters on action click somewhere on the page */
Template.bzNewControlSearch.onRendered(function () {
    $('body').on('click', function (e) {
        var target = e.target;
        if (!$(target).is('.bz-control--search') && !$(target).parents().is('.bz-control--search')) {
            if (!$('.bz-search-box-filter').hasClass('filters-closed')) {
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
    'focus .bz-form-control': function (e, v) {
        bz.ui.newSearchControl.focusInput(e, v);
    },
    'click .js-item-category': function (e, v) {
        /* need update masonry here */
        var textInput = v.$('.bz-form-control')[1];
        //$(textInput).val(this.intName);

        /* 1 */
        var clearBtn = $('.js-reset-field'),
            style = ($(textInput).val().length) ? 'visible' : 'hidden';
        clearBtn.css('visibility', style);

        /* загрузка шаблона в зависимости от выбора кнопки */
        //var name = Session.get('bz.control.category-list.activeCategories').join() || '';
        //setSearchFiltersTemplate(name.toCapitalCase(), this);

    },
    'keyup .bz-form-control': function (e, v) {
        /* 1 */
        var textInput = v.$('.bz-form-control')[1] || v.$('.bz-form-control')[0],
            clearBtn = v.$('.js-reset-field'),
            style = ($(textInput).val().length) ? 'visible' : 'hidden';

        clearBtn.css('visibility', style);

    },
    'click .js-reset-field': function (e, v) {
        /* 1 */
        var textInput = v.$('.bz-form-control')[1],
            clearBtn = v.$('.js-reset-field');

        clearBtn.css('visibility', 'hidden');

        //$(textInput).val('');
        v.$('.typeahead').typeahead('val', '');
        Session.set('bz.control.search.searchedText', '');


        /* СДЕЛАТЬ ЗАКРЫТИЕ ПАНЕЛИ ФИЛЬТРА */
    },
    'click .js-toggle-filters': function (e, v) {
        /* set template as jobs */
        //setSearchFiltersTemplate('jobs'.toCapitalCase(), this);
        bz.ui.newSearchControl.open(e, v);
    },
    'click .js-search-btn': function (e, v) {
        var text = v.$('.js-nearby-places.tt-input').val();
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
        //val = val && val.trim() || '';
        //Session.set('bz.control.search.searchedText', val);
    },
    'typeahead:select .js-nearby-places': function (e, v, val) {
        val = val.name && val.name.trim() || '';
        Session.set('bz.control.search.searchedText', val);

        bz.ui.newSearchControl.close(e);

        /* $('.js-nearby-places').typeahead('close');
         $('.js-nearby-places').blur();*/
    },
    'keyup .js-nearby-places': function (e, v) {
        var val = $($('.typeahead')[1]).val();
        val = val && val.trim() || '';
        //console.info(val);
        Session.set('bz.control.search.searchedText', val);
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
    joinedArray: function () {
        var ret = [
            {
                name: 'google-places',
                valueKey: 'name',
                displayKey: 'name',
                template: 'googlePlacesItem',
                header: '<h3 class="league-name">Google Places Nearby</h3>',
                local: function () {
                    ret = bz.runtime.maps.places.find({searchEngine: 'google'}).fetch().map(function (item) {
                        return item;
                    });

                    return ret;
                }
            },
            /*{
                name: 'yelp-places',
                valueKey: 'name',
                displayKey: 'name',
                template: 'googlePlacesItem',
                header: '<h3 class="league-name">Yelp Places Nearby</h3>',
                local: function () {
                    ret = bz.runtime.maps.places.find().fetch().map(function (item) {
                        return item;
                    });

                    return ret;
                }
            },*/
            {
                name: 'post-find-wrapper',
                valueKey: 'name',
                displayKey: 'name',
                //template: 'newPostFoundItem',
                /*header: '<h3 class="league-name">Posts found</h3>',*/
                templates: {
                    notFound: ['<div class="empty-message"><span>Not Found</span></div>']
                },
                local: function () {

                    //console.log(Session.get('bz.control.category-list.activeCategories'));
                    var searchSelector = {
                            'status.visible': bz.const.posts.status.visibility.VISIBLE
                        },
                        catList = Session.get('bz.control.category-list.activeCategories');

                    if (catList && catList.length > 0) {
                        searchSelector.type = {$in: catList};
                    }

                    Session.set('bz.control.search-selector', searchSelector);

                    /**/
                    var loc = Session.get('currentLocation');
                    var radius = Session.get('bz.control.search.distance');

                    if (loc) {
                        var box = getLatLngBox(loc.latitude, loc.longitude, radius);

                        var res = bz.cols.posts.find(
                            {
                                'details.locations': {
                                    $elemMatch: {
                                        'obscuredCoords.lat': {$gte: box.lat1, $lte: box.lat2},
                                        'obscuredCoords.lng': {$gte: box.lng1, $lte: box.lng2}
                                    }
                                },
                                'status.visible': bz.const.posts.status.visibility.VISIBLE
                            }
                        ).fetch();
                        /**/

                        var ret = _.unique(res.map(function (item) {

                            item.name = item.details.title;
                            return item;
                        }), function (item) {
                            return item.name
                        });
                    }

                    return ret;
                }
            }];


        return ret;
    }
});


function getLatLngBox(lat, lng, radius) {
    if (lat && lng && radius) {
        var dLat = (radius / bz.const.locations.earthRadius) / Math.PI * 180,
            dLng = (radius / bz.const.locations.earthRadius / Math.cos(lat * Math.PI / 180)) / Math.PI * 180;
        return {
            lng1: lng - dLng,
            lng2: lng + dLng,
            lat1: lat - dLat,
            lat2: lat + dLat
        };
    } else {
        return null;
    }
}


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
    searchTagIsVisible: function (e, v) {
        return Session.get('bz.control.search.searchedText') !== '' && Session.get('bz.control.search.searchedText') !== undefined;
    }
});


Template.bzNewControlSearchFilters.helpers({
    countSearchRQ: function () {
        var ret = Session.get('bz.control.search.amount') || 0;
        return ret;
    }
});


Template.categoryListButtons.events({
    'mousemove ': function (e, v) {

        clicked && updateScrollPos(e);
    },
    'mousedown': function (e) {
        clicked = true;
        clickX = e.pageX;
    },
    'mouseup': function (e) {
        clicked = false;
        $('.control--category-list-buttons li').css('cursor', 'auto');
    }
});


Template.bzRangeSlider.onRendered(()=> {
    Tracker.autorun(function () {
        //default distance

        var dist = Session.get('bz.control.search.distance'), sliderDist;
        //(dist) ? Session.get('bz.control.search.distance') : Session.set('bz.control.search.distance', 20);

        if (dist) {
            dist = dist && dist.toString();
            switch (dist) {
                case '1':
                    sliderDist = 1; // todo: сделать i18n!!
                    break;
                case '5':
                    sliderDist = 34;
                    break;
                case '20':
                    sliderDist = 67;
                    break;
                case bz.const.locations.MAXRADIUS.toString():
                    sliderDist = 100;
                    break;
            }
            //ret = sliderDist;
            $('.js-distance-range-slider').foundation('slider', 'set_value', sliderDist);
        }

        //console.info('Distance: ' + Session.get('bz.control.search.distance'), 'RET: ' + ret);

        //return ret;
    });
})
Template.searchCommonFilters.onRendered(()=> {

});


Template.bzRangeSlider.helpers({
    getDistanceFromSession: function () {
        //Tracker.autorun(function () {
        var dist = Session.get('bz.control.search.distance'), sliderDist, ret = 20;
        if (dist) {
            dist = dist && dist.toString();
            switch (dist) {
                case '1':
                    sliderDist = 1; // todo: сделать i18n!!
                    break;
                case '5':
                    sliderDist = 34;
                    break;
                case '20':
                    sliderDist = 67;
                    break;
                case bz.const.locations.MAXRADIUS.toString():
                    sliderDist = 100;
                    break;
            }
            ret = sliderDist;
            //$('.js-distance-range-slider').foundation('slider', 'set_value', sliderDist);
        }
        return ret;
        //});
    }
});

Template.searchCommonFilters.helpers({

});


Template.searchCommonFilters.events({
    'change.fndtn.slider .js-distance-range-slider': function (e, v) {
        var dist, textSearch, slDist = $(e.target).attr('data-slider');

        //todo: этот подход неправильный-возникает туча ивентов (если я веду от 1 мили до 20, то 5 миль тоже выставится по дороге). Change this!!

        textSearch = Session.get('bz.control.search.searchedText');

        if (slDist) {
            slDist = slDist.trim();
            switch (slDist) {
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
                    dist = bz.const.locations.MAXRADIUS;
                    break;
            }
            Session.set('bz.control.search.distance', dist);
        }

        //typeahead - change result complete
        if (textSearch) {
            $('.typeahead.bz-form-control').typeahead('val', '');
            $('.typeahead.bz-form-control').typeahead('val', textSearch);
        }


    }
});


Template.searchFiltersTrainings.events({
    'click .js-bz-btn-back': function (e, v) {
        //v.$('#bz-section-learning').toggle();
        //v.$('#bz-search-category').toggle();
        //v.$('#bz-search-trainings-box').toggle();
    },
    'click .js-choose-section-learning': function (e, v) {
        //v.$('#bz-section-learning').toggle();
        //v.$('#bz-search-trainings-box').toggle();
    },
    'click .js-choose-search-category': function (e, v) {
        //v.$('#bz-search-category').toggle();
        //v.$('#bz-search-trainings-box').toggle();
    }
});


Template.searchFiltersJobs.events({
    //prevent default clicking on direct children of .cd-primary-nav
    'click .cd-primary-nav li.has-children > a': function (e, v) {
        e.preventDefault();
    },
    'click .has-children > a': function (e, v) {
        var selected = $(e.target);

        if (selected.next('ul').hasClass('is-hidden')) {
            selected.addClass('selected').next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('moves-out');
            selected.parent('.has-children').siblings('.has-children').children('ul').addClass('is-hidden').end().children('a').removeClass('selected');
            //$('.cd-overlay').addClass('is-visible');
        } else {
            selected.removeClass('selected').next('ul').addClass('is-hidden').end().parent('.has-children').parent('ul').removeClass('moves-out');
            //$('.cd-overlay').removeClass('is-visible');
        }
    },
    //submenu items - go back link
    'click .go-back': function (e, v) {
        $(e.target).closest('.go-back').parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('moves-out');
    }
});


Template.searchFiltersTrainings.events({
    //prevent default clicking on direct children of .cd-primary-nav
    'click .cd-primary-nav li.has-children > a': function (e, v) {
        e.preventDefault();
    },
    'click .has-children > a': function (e, v) {
        var selected = $(e.target);

        if (selected.next('ul').hasClass('is-hidden')) {
            selected.addClass('selected').next('ul').removeClass('is-hidden').end().parent('.has-children').parent('ul').addClass('moves-out');
            selected.parent('.has-children').siblings('.has-children').children('ul').addClass('is-hidden').end().children('a').removeClass('selected');
            //$('.cd-overlay').addClass('is-visible');
        } else {
            selected.removeClass('selected').next('ul').addClass('is-hidden').end().parent('.has-children').parent('ul').removeClass('moves-out');
            //$('.cd-overlay').removeClass('is-visible');
        }
    },
    //submenu items - go back link
    'click .go-back': function (e, v) {
        $(e.target).closest('.go-back').parent('ul').addClass('is-hidden').parent('.has-children').parent('ul').removeClass('moves-out');
    }
});


function setSearchFiltersTemplate(name, v) {
    var template;
    $('.bz-filters-box').empty();


    if (!name) {
        template = Template['searchCommonFilters'];
    } else if (name) {
        template = Template['searchFilters' + name];
    }


    if (v && template) {
        Blaze.renderWithData(template, v.data, $('.bz-filters-box')[0]);
        $(document).foundation('reflow');
    } else {
        Blaze.renderWithData(Template['searchCommonFilters'], v.data, $('.bz-filters-box')[0]);
        $(document).foundation('reflow');
    }
}
var updateScrollPos = function (e) {
    $('.control--category-list-buttons li').css('cursor', 'pointer');
    $('.bz-btn-services').scrollLeft($('.bz-btn-services').scrollLeft() + (clickX - e.pageX));
};


