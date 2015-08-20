Template.postTypeSelect.helpers({
  getSiteTypes: function () {
    return bz.cols.siteTypes.find();
  }
});
Template.postTypeSelect.events({
  'change .js-post-type-select': function (e, v) {
    var name = e.target.value.toCapitalCase();
    setPostDetailsTemplate(name, v);
  },

});
Template.postTypeSelect.rendered = function () {
  var name = this.$('.js-post-type-select').val().toCapitalCase();
  setPostDetailsTemplate(name, this);
}

Template.postHashesControl.events({
  'click [data-action="showPopup"]': function (o, t) {
    IonPopup.show({
      title: "A Popup",
      template: "Here's a quick popup.",
      buttons: [{
        text: "Close me",
        type: "button-positive",
        onTap: function () {
          IonPopup.close()
        }
      }]
    });
  },
  'click [data-action="showPrompt"]': function (o, t) {
    IonPopup.prompt({
      title: "Hashes",
      template: "Please enter hashes, separated by comma (,)",
      okText: "Submit",
      inputType: "text",
      text: 'IonPopup',
      inputPlaceholder: "Your Hashes"
    });
  }
})
// HELPERS:
function setPostDetailsTemplate(name, v) {
  $('.js-post-details-categorized').empty();
  Blaze.renderWithData(Template['postDetails' + name], v.data, $('.js-post-details-categorized')[0]);
}