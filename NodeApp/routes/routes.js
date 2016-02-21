var requests = require('../config/requests');
var request = require('request');
var bodyParser = require('body-parser');

module.exports = function(app){

  app.use(bodyParser.json())


  app.get('/',function(req,res){
    console.log("hello");
    res.end("Sensor Service");
  });

  app.post('/register',function(req,res){
    console.log("received register request");

     var sensorID = req.body.sensorID;
     var name = req.body.name;
     var gcmID = req.body.gcmID;
     requests.register(sensorID, name, gcmID,function(found){
       console.log(found);
       res.json(found);
     })
  });

  app.post('/registerClient', function(req,res){

//var body = JSON.stringify(eval("(" + req.body + ")"));
    var clientID = req.body.clientID;
    var registrationID = req.body.registrationID;

    requests.registerClient(clientID,registrationID,function(data){
      res.json(data);
    })
  });

  app.get('/check',function(req,res){
    requests.checkSensor(function(data){
        res.json(data);
    })
  });

}
