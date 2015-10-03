/**
 * Created by Ashot on 9/27/15.
 */
Meteor.methods({
  getYelpPlaces: function(location){
    debugger;
    var res;
    try {
      res = Meteor.http.call('GET', 'http://api.yelp.com/v2/search/', {
        params: {
          location: location,
          oauth_consumer_key: 'hXSdjS1jlEsBuf1IgSIMdw',
          oauth_token: 'v5rNRAHLK0Is7H9gsCF2fwUjvks0X9gR',
          oauth_signature_method: 'HMAC-SHA1',
          oauth_signature: 'rIQhb5XI5pjWvLRnA8Dkrr4DRi0', //Consumer Secret
          //oauth_signature: 'qVqB06AiObkjkM4BSdKeFG66DvE', //Token Secret
          oauth_timestamp: Date.now(),
          oauth_nonce: _.guid()

        }
      });
    } catch(ex){
      debugger;
      console.log(ex);
      res = ex;
    }
    console.log(res);
    return res;
  },
  ///Input Parameters
  //  search: Search term or category names
  //  isCategory: Boolean stating whether ‘search’ parameter is a category
  //longitude and latitude: Latitude and Longitude of user’s location (optional)
  //Default location is statically set to San Francisco
  yelpQuery: function(search, isCategory, longitude, latitude) {
    debugger;
    console.log('Yelp search for userId: ' + this.userId + '(search, isCategory, lng, lat) with vals (', search, isCategory, longitude, latitude, ')');

    // Query OAUTH credentials (these are set manually)
    var auth = Accounts.loginServiceConfiguration.findOne({service: 'yelp'});

    // Add auth signature manually
    auth['serviceProvider'] = { signatureMethod: "HMAC-SHA1" };

    var accessor = {
          consumerSecret: auth.consumerSecret,
          tokenSecret: auth.accessTokenSecret
        },
        parameters = {};

    // Search term or categories query
    if(isCategory)
      parameters.category_filter = search;
    else
      parameters.term = search;

    // Set lat, lon location, if available (SF is default location)
    if(longitude && latitude)
      parameters.ll = latitude + ',' + longitude;
    else
      parameters.location = 'San+Francisco';

    // Results limited to 5
    parameters.limit = 5;

    // Configure OAUTH parameters for REST call
    parameters.oauth_consumer_key = auth.consumerKey;
    parameters.oauth_consumer_secret = auth.consumerSecret;
    parameters.oauth_token = auth.accessToken;
    parameters.oauth_signature_method = auth.serviceProvider.signatureMethod;

    // Create OAUTH1 headers to make request to Yelp API
    var qs = _.param(parameters);
    var fullUrl = 'http://api.yelp.com/v2/search' + '/?' + qs;
    var oauthBinding = new OAuth1Binding(auth.consumerKey, auth.consumerSecret, fullUrl);
    oauthBinding.accessTokenSecret = auth.accessTokenSecret;
    var headers = oauthBinding._buildHeader();
    debugger;
    // Return data results only
    return oauthBinding._call('GET', fullUrl, headers).data;
    //return oauthBinding._call('GET', 'http://api.yelp.com/v2/search', headers, parameters).data;
  }

});