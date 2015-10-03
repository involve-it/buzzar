Meteor.startup(function() {
  ServiceConfiguration.configurations.remove({service: "yelp"});
  ServiceConfiguration.configurations.insert({
    service: "yelp",
    consumerKey: "hXSdjS1jlEsBuf1IgSIMdw",
    consumerSecret: "rIQhb5XI5pjWvLRnA8Dkrr4DRi0",
    accessToken: "R6fFhISNXyav-IxKK0crj2ntpTI9x9QR",
    accessTokenSecret: "Eri_fEWNmXxFNYCHigsKsXeTROY"
  });
});