var sys = require('sys')
  , TwilioClient = require('twilio').Client
  , credentials = require('./credentials.js')
  , client = new TwilioClient(credentials.sid, credentials.authToken, credentials.hostname)
  , phone = client.getPhoneNumber(credentials.phoneNumber)

phone.setup(function() {
  phone.on('incomingSms', function(reqParams, res) {
    console.log('recevied', reqParams.Body);
    console.log('from', reqParams.From);
  });
});
