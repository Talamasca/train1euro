var config = require('./config');
var mailjet = require ('node-mailjet');
var Mailjet = require('node-mailjet').connect(config.mailjet.api, config.mailjet.password);
var url = config.site.url;
var Xray = require('x-ray');
var x = new Xray({
    filters: {
      findDate: function (value) {
        return findDate(value);
      }
  }
});


var goMailJet = function(value) {
  var sendEmail = Mailjet.post('send');
  var emailData = {
      'FromEmail': config.mailjet.fromEmail,
      'FromName': config.mailjet.fromName,
      'Subject': "Train à 1€ ouverture de nouvelles dates",
      "Html-part":"<h3>Salut </h3><br />Train à 1€ a ouvert de nouvelles dates : " + value + "<br>  ",
      //'Text-part': 'Hello NodeJs !',
      'Recipients': [{'Email': config.mailjet.toEmail}],
  }

  sendEmail.request(emailData);
  /*
    .on('success', function (response, body) {
  		console.log (response.statusCode, body);
  	})
  	.on('error', function (err, response) {
  		console.log (response.statusCode, err);
  	});*/
};


function findDate(value) {
  var regExp = /maxDateDepart(.*([0-9]{2}\/[0-9]{2}\/[0-9]{4}))/g;
  var match = regExp.exec(value);
  var resultDate = match[2];
  return resultDate;
}

var genericScrape = function(url, callback) {
  x(url, '#section', {
    date: '|findDate',
  })((err, obj) => {
    if(err || !obj) {
      callback(err)
      return;
    }
    callback(null, obj);
  })
}

genericScrape(url, function(err, obj) {
  if(err) {
    console.log(err);
  } else {
    if(obj.date) {
      console.log(obj.date);
      goMailJet(obj.date, function(err, obj){});
    } else {
      console.log("no date");
    }
  }
});
