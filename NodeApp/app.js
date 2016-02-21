var express = require('express');
var connect = require('connect');
var requests = require('./config/requests');
var calendarService = require('./calendar/getEvents.js');
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
//app.use(connect.logger('dev'));
//app.use(connect.json());
//app.use(connect.urlencoded());
calendarService.getevents(function(data){
  console.log(data);
});
require('./routes/routes.js')(app);

app.listen(port);

console.log('The App runs on port ' + port);
requests.sendMessage();
