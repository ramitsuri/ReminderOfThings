var mongoose = require('mongoose');
var request = require('request');
var models = require('../config/models');
var gcm = require('node-gcm');
var http = require('http');
var sensorURL = "";

var sensor = models.sensor;
var client = models.client;

var register = function(sensorID,name,gcmID,callback){
   var newSensor = new sensor({
     sensorID: sensorID,
     name: name,
     gcmID: gcmID
   });

  console.log(newSensor.name);
  newSensor.save(function(err){
    callback({'response':"saved"});
  });
}

var registerClient = function(clientID,registrationID,callback){
  client.find({clientID:clientID},function(err,clients){
    var len = clients.length;
    if(len == 0){
      var newClient = new client({
        clientID: clientID,
        registrationID: registrationID
      });

      newClient.save(function(err){
        callback({'response': clientID});
      })
    }
  });

}

  var sendMessage = function(){
client.find(function(err,clients){
  if(clients.length!=0){
      var reg_ID = clients[0].registrationID;
      console.log(reg_ID);
      var message = new gcm.Message({
    data: {
        key1: 'message1',
        key2: 'message2'}
});
      message.addData('key1', 'msg1');
      var regTokens = [reg_ID];
      var sender = new gcm.Sender('AIzaSyD3T1a5779bLjW6bM-X6wsS14X4CDJmFmc');
      sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    if(err) console.error(err);
    else    console.log(response);
});
}
    });

  }

  var checkSensor = function(callback){
    var options = {
  host: '172.17.24.243',
  port: 1337,
  path: '/get',
  method: 'GET'
};

http.request(options, function(res) {
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    var data = JSON.parse(chunk);
//    console.log(data.lightLevel);
setTimeout(function(){
if(data.lightLevel<20){
  console.log('gji');
  sendMessage();
}
}, 10000);
    callback({'response':chunk});
  });
}).end();
//callback({'response':"hello"});
  }
module.exports = {
  register: register,
    registerClient:registerClient,
    sendMessage:sendMessage,
    checkSensor:checkSensor
}
