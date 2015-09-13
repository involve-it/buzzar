/**
 * Created by root on 9/6/15.
 */
Template.showListMap.events({
  'click [data-menu=multipleSearchTemplate]': function (event, template) {
    event.preventDefault();

    var name = template.$(event.target).data('menu');
    console.log(name);
    Session.set('activeTemplate', name);

    var showSearchList = $('.multipleResult');
    showSearchList.addClass('animated  flipInY').toggleClass('show');
  }
});