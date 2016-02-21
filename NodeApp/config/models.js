var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sensorSchema = mongoose.Schema({
  sensorID:String,
  name:String,
  gcmID: String
});

var clientSchema = mongoose.Schema({
  clientID: String,
  registrationID: String
});
mongoose.connect('mongodb://localhost:27017/sensorDB');
var client = mongoose.model('clients',clientSchema);
var sensor = mongoose.model('sensors',sensorSchema);
exports.client = client;
exports.sensor = sensor;
