var db = require('../db')


exports.getRoutes = function(req, res){
  var statement = 'select route_refid as id, route_shortname as name, route_color as color, route_estmileage as mileage from routes'
  db.executeStatement(statement, function(data) {
    res.json(data)
  })
}

exports.getStops = function(req, res){
  var statement = 'select stop_refid as id, stop_name as name, stop_status as status from stops'
  db.executeStatement(statement, function(data) {
    res.json(data)
  })
}

exports.getStopsMap = function(req, res){
  var statement = 'select stop_refid as id, stop_name as name, stop_lat as lat, stop_lon as lng from stops'
  db.executeStatement(statement, function(data) {
    res.json(data)
  })
}

exports.getShifts = function(req, res){
  var statement = 'select shift_refid as id, shift_name as name, shift_startdeparttime as depart, shift_endarrivaltime as arrival from shifts'
  db.executeStatement(statement, function(data) {
    res.json(data)
  })
}

exports.getTrips = function(req, res){
  var statement = 'select trip_refid as id, trip_startdeparttime as depart, trip_endarrivaltime as arrival from trips where tripinservice_id = 1'
  db.executeStatement(statement, function(data) {
    res.json(data)
  })
}

exports.getPassengersByRoute = function(req, res){
  db.sqlFileToJson('passByRoute.sql', function(data){
    res.json(data)
  })
}

exports.getPassengersByTrip = function(req, res){
  db.sqlFileToJson('passByTrip.sql', function(data){
    res.json(data)
  })
}

exports.getPassengersByStop = function(req, res){
  db.sqlFileToJson('passByStop.sql', function(data){
    res.json(data)
  })
}

exports.getPassengersByShift = function(req, res){
  db.sqlFileToJson('passByShift.sql', function(data){
    res.json(data)
  })
}