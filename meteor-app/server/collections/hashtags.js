/**
 * Created by ashot on 8/12/15.
 */
// here will be creation and description of all arrays, related to hashes, tags, searches etc.

Meteor.startup(function () {

  // TAGS - basic search text entity. It has a name
  // and keywords (defined by some online resources, e.g. dictionaries).
  // record is created: defined by us now, later - automatically with approval
  // 'related' is something that we could show along with this ... it should be generated with time and possibly go to other junction table
  ocn.cols.tags =  new Mongo.Collection('tags');
  ocn.cols.tags.remove({});
  ocn.cols.tags.insert({
    name: 'firewood'
  });
  ocn.cols.tags.insert({
    name: 'cold beer'
  });
  ocn.cols.tags.insert({
    name: 'girl',
    keyWords: [
      'girl',
      'lady',
      'chick'
    ],
    related: [
      'flowsers'
    ]
  });
  ocn.cols.tags.insert({
    name: 'roommate',
    keyWords: [
      'roommate',
      'partner'
    ]
  });

  // HASH is what is presented to a user as a tag, group of tags or a named search,
  // it points to several TAGS in db (see tags array)
  // Hash means - it's subjective, fluid and talk-based.
  // record is created: user creates a hash in UI (new hash, merges hash, etc.)
  ocn.cols.hashes =  new Mongo.Collection('hashes');
  ocn.cols.hashes.remove({});
  ocn.cols.hashes.insert({
    name: 'roommates who don\'t drink vodka',
    tags: [
      'vodka',
      'roommates',         // we can do this as an id , pointing to tags array too.  ocn.cols.tags.find({name: {'roommates'}).. think
      'healthy lifestyle'  // possible that it's doesn't exist in tags collection
    ]
  });

  ocn.cols.hashes.insert({
    name: 'walking with your dog in this park',
    tags: [
      ocn.cols.tags.findOne({name: 'firewood'})._id,
      ocn.cols.tags.findOne({name: 'cold beer'})._id
    ],
    isGroup: false,
    popularity: 1
  });  
  ocn.cols.hashes.insert({
    name: 'firewood and beer in the countryside',
    tags: [
      ocn.cols.tags.findOne({name: 'firewood'})._id,
      ocn.cols.tags.findOne({name: 'cold beer'})._id
    ],
    isGroup: true,
    popularity: 1
  });
  ocn.cols.hashes.insert({
    name: 'girls-roommates',
    tags: [
      ocn.cols.tags.findOne({name: 'girl'})._id,
      ocn.cols.tags.findOne({name: 'roommate'})._id
    ],
    isGroup: true,
    popularity: 5
  });

  // when user makes a SEARCH, we look for words in tags and then display results based on that,
  // name is the exact phrase, amount is how many time this (later - similar) phrase was searched globally.
  // meantime we will offer him to create a HASHTAG based on that search:
  // we pick 'tags' from the tags found and let user type in the name
  // record is created: everytime user makes a search
  ocn.cols.searches =  new Mongo.Collection('searches');
  ocn.cols.searches.remove({});
  ocn.cols.searches.insert({
    name: 'girls who whanna be roommates',
    amount: 5 // how many times was searched
  });
});