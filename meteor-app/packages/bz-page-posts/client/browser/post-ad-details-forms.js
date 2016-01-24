/**
 * Created by arutu_000 on 1/23/2016.
 */
Template.postDetailsHelp.events({
  'click .panel': function(e,v){
    $(e.target).closest('.panel').toggleClass('callout');
  }
});
Template.postDetailsTrade.helpers({
  getPrice: function () {
    var ret = '';
    if(this._id){
      ret = this.details.price
    } else {
      Session.get('post-price')
    }
    return ret;
  }
});