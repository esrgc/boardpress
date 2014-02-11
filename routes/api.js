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

exports.getRevenue = function(req, res){
  var linedata = [
    {
      'date':'2007',
      'numCats':92817,
      'goalCats': 100000
    },
    {
      'date':'2008',
      'numCats':82705,
      'goalCats': 100000
    },
    {
      'date':'2009',
      'numCats':75920,
      'goalCats': 100000
    },
    {
      'date':'2010',
      'numCats':76920,
      'goalCats': 100000
    },
    {
      'date':'2011',
      'numCats':84123,
      'goalCats': 100000
    },
    {
      'date':'2012',
      'numCats':99109,
      'goalCats': 100000
    },
    {
      'date':'2013',
      'numCats':145897,
      'goalCats': 100000
    }
  ]
  res.json(linedata)
}

exports.getPassengersByGrant = function(req, res){
  db.sqlFileToJson('passByGrant.sql', function(data){
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