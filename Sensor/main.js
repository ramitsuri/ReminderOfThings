var ipAddress = '172.17.24.243'; 

var mraa = require('mraa');
console.log('MRAA Version: ' + mraa.getVersion()); 
console.log('light');

var fs = require('fs');

var lightSensorPage = fs.readFileSync('/node_app_slot/lightsensor.html');

lightSensorPage = String(lightSensorPage).replace(/<<ipAddress>>/, ipAddress);

var analogPin0 = new mraa.Aio(0);

function getLux(analogValue) {
  var lux;
  var calib = [{reading:0, lux:0},
               {reading:100, lux:0.2}, 
               {reading:200, lux:1},
               {reading:300, lux:3},
               {reading:400, lux:6},
               {reading:500, lux:10},
               {reading:600, lux:15},
               {reading:700, lux:35},
               {reading:800, lux:80},
               {reading:900, lux:100}];
  var i = 0;
  while (i < calib.length && calib[i].reading < analogValue) {
    i ++;
  }
  if (i > 0) {
    i = i - 1;
  }  
  lux =  (calib[i].lux *(calib[i + 1].reading - analogValue) + calib[i + 1].lux * (analogValue - calib[i].reading))/(calib[i + 1].reading - calib[i].reading);
  return lux;
}

var http = require('http');
http.createServer(function (req, res) {
    var value;
    if (req.url == '/lightsensor') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(lightSensorPage);
    }
    else if(req.url == '/get') {
        value = analogPin0.read();
        res.writeHead(200, {'Content-Type': 'text/json'});
        res.end(JSON.stringify({lightLevel:getLux(value), rawValue:value}));
    }
}).listen(1337, ipAddress);
