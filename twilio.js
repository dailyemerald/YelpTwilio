var sys = require('sys')
  , fs = require('fs')
  , TwilioClient = require('twilio').Client
  , Twim1 = require('twilio').Twim1
  , credentials = require('./credentials.js')
  , client = new TwilioClient(credentials.sid, credentials.authToken, credentials.hostname)
  , phone = client.getPhoneNumber(credentials.phoneNumber)

var quotes = fs.readFileSync('quotes').toString().split("\n");
console.log("Loaded", quotes.length, "quotes...");

phone.setup(function() {
  phone.on('incomingSms', function(reqParams, res) {

    console.log('recevied', reqParams.Body);
    console.log('from', reqParams.From);

    //var message = "Hi! You said: '" + reqParams.Body + "' <3, The Emerald";

    var message = quotes[ parseInt(Math.random()*(quotes.length-2)) ];

    phone.sendSms(reqParams.From, message, null, function(sms) {
      sms.on('processed', function(reqParams, response) {
        console.log('message processed:', reqParams);
      });
    });
  });
});
