/**
 * Created by ashot on 8/12/15.
 */
// here will be creation and description of all arrays, related to hashes, tags, searches etc.

Meteor.startup(function () {

  bz.cols.postAdTypes = new Mongo.Collection('postAdTypes');
  bz.cols.postAdTypes.remove({});
  // we add id's so that it's consistent:

  bz.cols.postAdTypes.insert({
    name: 'jobs',
    intName: 'jobs',
    id: 'qGedj9iA6jS7inCCk',
    fullName: 'Job Market',
    color: '730928',
    order: 0,
    i18n: {
      ru: {
        name: 'работа',
        fullName: 'Требуется или предлагается работа'
      }
    },
    hasRoute: true // use this to redirect to same route on click
  });
  bz.cols.postAdTypes.insert({
    name: 'trainings',
    intName: 'trainings',
    id: '9qzjsToxam3GCHREN',
    fullName: 'Need or provide training',
    color: '370808',
    order: 1,
    i18n: {
      ru: {
        name: 'тренинги',
        fullName: 'тренинги - платные, бесплатные'
      }
    },
    hasRoute: true // use this to redirect to same route on click
  });

  bz.cols.postAdTypes.insert({
    name: 'connect',
    intName: 'connect',
    id: 'ZiGto5xhe4TgAYJhe',
    fullName: 'Looking for Connections',
    color: 'F77012',
    order: 2,
    i18n: {
      ru: {
        name: 'встречи',
        fullName: 'В поисках связей и знакомств'
      }
    }
  });

  bz.cols.postAdTypes.insert({
    name: 'trade',
    intName: 'trade',
    id: 'fveonD9cC3i33LfKj',
    fullName: 'Buy & Sell',
    color: 'EF376C',
    order: 3,
    i18n: {
      ru: {
        name: 'торг',
        fullName: 'покупка и продажа'
      }
    }
  });

  bz.cols.postAdTypes.insert({
    id: 'otEm6ijtatqF7pQj5',
    name: 'housing',
    intName: 'housing',
    fullName: 'Housing Market',
    color: 'B70808',
    order: 4,
    i18n: {
      en: {
        name: 'housing',
        fullName: 'Housing Market',
      },
      ru: {
        name: 'жилье',
        fullName: 'рынок жилья - покупка, продажа, съем'
      }
    }
  });
  bz.cols.postAdTypes.insert({
    name: 'events',
    intName: 'events',
    id: 'WsCLpEkN4tpAHxE5w',
    fullName: 'Local events',
    color: '333308',
    order: 5,
    i18n: {
      ru: {
        name: 'события',
        fullName: 'местные события'
      }
    }
  });
  bz.cols.postAdTypes.insert({
    name: 'services',
    intName: 'services',
    id: '8qzzsToxam3GCTEXT',
    fullName: 'Need or provide service',
    color: '370808',
    order: 6,
    i18n: {
      ru: {
        name: 'услуги',
        fullName: 'предложения - платные, бесплатные'
      }
    }
  });
  bz.cols.postAdTypes.insert({
    name: 'help',
    intName: 'help',  // international name, is used for picking templates
    id: 'M5g7ujcKXEx5LHJzc',
    fullName: 'Need or Give Help',
    color: 'D86055',
    order: 7,
    i18n: {
      ru: {
        name: 'помощь',
        fullName: 'Требуется или предлагается помощь'
      },
    }
  });
  Meteor.publish('postAdTypes', function(){
    return bz.cols.postAdTypes.find({}, {sort: ['order','asc']});
  });

  // SITES
  bz.cols.sites = new Mongo.Collection('sites');
  bz.cols.sites.remove({});
  bz.cols.sites.insert({
    name: 'craigslist'
  });
  bz.cols.tags.insert({
    name: 'youcaring'
  });
  bz.cols.tags.insert({
    name: 'linkedin'
  });
  bz.cols.tags.insert({
    name: 'monster'
  });
});
