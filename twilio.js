var sys = require('sys')
  , TwilioClient = require('twilio').Client
  , Twim1 = require('twilio').Twim1
  , credentials = require('./credentials.js')
  , client = new TwilioClient(credentials.sid, credentials.authToken, credentials.hostname)
  , phone = client.getPhoneNumber(credentials.phoneNumber)

phone.setup(function() {
  phone.on('incomingSms', function(reqParams, res) {

    console.log('recevied', reqParams.Body);
    console.log('from', reqParams.From);

    var message = "Hi! You said: '" + reqParams.Body + "' <3, The Emerald";

    phone.sendSms(reqParams.From, message, null, function(sms) {
      sms.on('processed', function(reqParams, response) {
        console.log('message processed:', reqParams);
      });
    });
  });
});
