var db = require('../db')
  , json2csv = require('json2csv')
  , fs = require('fs')
  , _ = require('underscore')
  , path = require('path')

function returnData(req, res, data) {
  if(req.query.csv) {
    var csvname = req.route.path.substring(1) + '.csv'
    var csvpath = path.join(__dirname, '../tmp') + '/' + csvname
    var fields = _.keys(data[0])
    json2csv({data: data, fields: fields}, function(err, csv) {
      if (err) console.log(err)
      fs.writeFile(csvpath, csv, function (err) {
        if (err) throw err
        res.download(csvpath, csvname)
      })
    })
  } else {
    res.json(data)
  }
}

exports.getRoutes = function(req, res){
  var statement = 'select route_refid as id, route_shortname as name, route_color as color, route_estmileage as mileage from routes'
  db.executeStatement(statement, function(data) {
    returnData(req, res, data)
  })
}

exports.getStops = function(req, res){
  var statement = 'select stop_refid as id, stop_name as name, stop_status as status from stops'
  db.executeStatement(statement, function(data) {
    returnData(req, res, data)
  })
}

exports.getStopsMap = function(req, res){
  var statement = 'select stop_refid as id, stop_name as name, stop_lat as lat, stop_lon as lng from stops'
  db.executeStatement(statement, function(data) {
    returnData(req, res, data)
  })
}

exports.getShifts = function(req, res){
  var statement = 'select shift_refid as id, shift_name as name, shift_startdeparttime as depart, shift_endarrivaltime as arrival from shifts'
  db.executeStatement(statement, function(data) {
    returnData(req, res, data)
  })
}

exports.getTrips = function(req, res){
  var statement = 'select trip_refid as id, trip_startdeparttime as depart, trip_endarrivaltime as arrival from trips where tripinservice_id = 1'
  db.executeStatement(statement, function(data) {
    returnData(req, res, data)
  })
}

exports.getRevenue = function(req, res){
  var data = [
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
  returnData(req, res, data)
}

exports.getPassengersByGrant = function(req, res){
  db.sqlFileToJson('passByGrant.sql', function(data){
    returnData(req, res, data)
  })
}

exports.getPassengersByRoute = function(req, res){
  db.sqlFileToJson('passByRoute.sql', function(data){
    returnData(req, res, data)
  })
}

exports.getPassengersByTrip = function(req, res){
  db.sqlFileToJson('passByTrip.sql', function(data){
    returnData(req, res, data)
  })
}

exports.getPassengersByStop = function(req, res){
  db.sqlFileToJson('passByStop.sql', function(data){
    returnData(req, res, data)
  })
}

exports.getPassengersByShift = function(req, res){
  db.sqlFileToJson('passByShift.sql', function(data){
    returnData(req, res, data)
  })
}