/**
 * Created by xvolk48 on 05.04.2016.
 */
Template.pageAdminTags.onCreated(function(){
  Meteor.subscribe('tags');
});

Template.pageAdminTags.onRendered(function() {
  $('.ui.dropdown').dropdown();
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
  },
  getTags: function(){
    var id = Session.get('bz.page-admin.tags.selectedTagId');
    return bz.cols.tags.find({_id:{$ne: id}}).fetch();
  }
});

Template.pageAdminTags.events({
  'click div.button-new-tag a.js-tag-new-btn':function(event,v) {
    v.$('input.tag-id').val("");
    v.$('input.tag-name').val("");
    v.$('input.tag-keyWords').val("");
    v.$('input.tag-descriptionRU').val("");
    v.$('input.tag-descriptionEN').val("");
    v.$('.tag-related').find('select').dropdown('clear')
  },

  'click div.buttons a.js-tag-save-btn':function(event,v) {
    var objTag, arrKeyWords, arrRelated=[];
    arrKeyWords=$('input.tag-keyWords').val().split(/\s*,\s*/);
    if(v.$('.tag-related').find('select').val()!="" && v.$('.tag-related').find('select').val()!== null) {
      arrRelated = v.$('.tag-related').find('select').val();
    }else{
      arrRelated=[];
    }
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
    v.$('.tag-related').find('select').dropdown('clear')
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
      v.$('.tag-related').find('select').dropdown('set selected',tag.related)
    } else {
      v.$('input.tag-id').val("");
      v.$('input.tag-name').val("");
      v.$('input.tag-keyWords').val("");
      v.$('input.tag-descriptionRU').val("");
      v.$('input.tag-descriptionEN').val("");
      v.$('.tag-related').find('select').dropdown('clear')
    }
  },

  'click .reactive-table tbody tr':function(event,v) {
    Session.set('bz.page-admin.tags.selectedTagId', this._id);
    v.$('.tag-related').find('select').dropdown('clear');
    v.$('input.tag-id').val(this._id);
    v.$('input.tag-name').val(this.name);
    v.$('input.tag-keyWords').val(this.keyWords);
    v.$('input.tag-descriptionRU').val(this.descriptionRU);
    v.$('input.tag-descriptionEN').val(this.descriptionEN);
    var arrSelectTags;
    arrSelectTags=this.related;
    setTimeout(function() {
      v.$('.tag-related').find('select').dropdown('set selected',arrSelectTags)
    },100);
  }
});