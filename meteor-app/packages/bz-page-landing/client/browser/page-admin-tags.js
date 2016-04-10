/**
 * Created by xvolk48 on 05.04.2016.
 */
Template.pageAdminTags.onCreated(function(){
  Meteor.subscribe('tags');
});
Template.pageAdminTags.helpers({
  myCollection: function(){
    return bz.cols.tags.find().fetch();
  },
  settings: function(){
    var objSettings;
    objSettings={
      rowsPerPage: 15,
      fields: ['name', 'keyWords','related', 'descriptionRU', 'descriptionEN']
    };
    return objSettings;
  }
});

Template.pageAdminTags.events({
  'click div.button-new-tag a.js-tag-new-btn':function(event,v) {
    v.$('input.tag-id').val("");
    v.$('input.tag-name').val("");
    v.$('input.tag-keyWords').val("");
    v.$('input.tag-descriptionRU').val("");
    v.$('input.tag-descriptionEN').val("");
    v.$('input.tag-related').val("");
  },

  'click div.buttons a.js-tag-save-btn':function(event,v) {
    var objTag, arrKeyWords, arrRelated;
    arrKeyWords=$('input.tag-keyWords').val().split(/\s*,\s*/);
    arrRelated=v.$('input.tag-related').val().split(/\s*,\s*/);
    objTag ={
      name:v.$('input.tag-name').val(),
      keyWords:arrKeyWords,
      related: arrRelated,
      descriptionRU: v.$('input.tag-descriptionRU').val(),
      descriptionEN: v.$('input.tag-descriptionEN').val()
    };
    var tagName=v.$('input.tag-name').val();
    if(!((v.$('input.tag-id').val()=="")&&(bz.cols.tags.findOne({name: tagName})))) {
      Meteor.call('updateTag', v.$('input.tag-id').val(), objTag, function (err) {
        if (err) {

        }
        else {

        }
      });
    } else {

    }
  },

  'click div.buttons a.js-tag-delete-btn':function(event,v) {
    var tag;
    if(v.$('input.tag-id').val()!=""){
      tag= bz.cols.tags.findOne(v.$('input.tag-id').val());
    }
    Meteor.call('deleteTag',tag, function(err){
      if (err){

      }
      else
      {

      }
    });
    v.$('input.tag-id').val("");
    v.$('input.tag-name').val("");
    v.$('input.tag-keyWords').val("");
    v.$('input.tag-descriptionRU').val("");
    v.$('input.tag-descriptionEN').val("");
    v.$('input.tag-related').val("");
  },

  'click div.buttons a.js-tag-cancel-btn':function(event,v) {
    var tag;
    if(v.$('input.tag-id').val()!="") {
      tag = bz.cols.tags.findOne(v.$('input.tag-id').val());
      v.$('input.tag-id').val(tag._id);
      v.$('input.tag-name').val(tag.name);
      v.$('input.tag-keyWords').val(tag.keyWords);
      v.$('input.tag-descriptionRU').val(tag.descriptionRU);
      v.$('input.tag-descriptionEN').val(tag.descriptionEN);
      v.$('input.tag-related').val(tag.related);
    } else {
      v.$('input.tag-id').val("");
      v.$('input.tag-name').val("");
      v.$('input.tag-keyWords').val("");
      v.$('input.tag-descriptionRU').val("");
      v.$('input.tag-descriptionEN').val("");
      v.$('input.tag-related').val("");
    }
  },

  'click .reactive-table tbody tr':function(event,v) {
    v.$('input.tag-id').val(this._id);
    v.$('input.tag-name').val(this.name);
    v.$('input.tag-keyWords').val(this.keyWords);
    v.$('input.tag-descriptionRU').val(this.descriptionRU);
    v.$('input.tag-descriptionEN').val(this.descriptionEN);
    v.$('input.tag-related').val(this.related);
  }
});