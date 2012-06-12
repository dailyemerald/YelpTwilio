var sys = require('sys')
  , fs = require('fs')
  , TwilioClient = require('twilio').Client
  , Twim1 = require('twilio').Twim1
  , credentials = require('./credentials.js')
  , client = new TwilioClient(credentials.sid, credentials.authToken, credentials.hostname)
  , phone = client.getPhoneNumber(credentials.phoneNumber)

var yelp = require("yelp").createClient({
  consumer_key: credentials.yelp.consumerKey, 
  consumer_secret: credentials.yelp.consumerSecret,
  token: credentials.yelp.token,
  token_secret: credentials.yelp.tokenSecret
});

function cleanString(dirty) {
  var clean = dirty.replace(/[^A-Z a-z]/g, "");
  console.log('rewriting', dirty, 'as', clean);
  return clean; 
}

function search(query, callback) {
  // See http://www.yelp.com/developers/documentation/v2/search_api
  var query = cleanString(query);
  yelp.search({term: query, location: "Eugene"}, function(error, data) {
    //console.log('error:', error);
    //console.log('data:', data);
    callback(data, error);
  });
}

function assembleMessage(business) {
  var name = business.name;
  var city = business.location.display_address[1].split(',')[0];
  var address = '(' + business.location.address;
  var phone = business.phone;
  
  if (city !== 'Eugene') {
    address += ', ' + city + ')';
  } else {
    address += ')';
  }
  
  var longVersion = 'How about "' + name + '"? Phone: ' + phone + ' ' + address + " (via the emerald & yelp)";
  var shortVersion =  'How about "' + name + '"?' + address + " (via the emerald & yelp)";
  
  console.log('long version is ',longVersion.length);
  
  if (longVersion.length < 150) {
    return longVersion;
  } else {
    return shortVersion;
  }
}

phone.setup(function() {
  phone.on('incomingSms', function(reqParams, res) {

    console.log('recevied', reqParams.Body);
    console.log('from', reqParams.From);

    //var message = "Hi! You said: '" + reqParams.Body + "' <3, The Emerald";

    search(reqParams.Body, function(data, error) {

      var count = data.businesses.length;
      var message = "If you see this, it's broken... sorry...";

      if (count == 0) {
        message = "We coulnd't find anything...";
      } else {
        var randomIndex = parseInt(Math.random() * count);
        message = assembleMessage(data.businesses[randomIndex]))
      }
      
      phone.sendSms(reqParams.From, message, null, function(sms) {
        sms.on('processed', function(reqParams, response) {
          console.log('message processed:', reqParams);
        });
      });
      
    }); //search

  }); //phone.on
}); //phone.setup
