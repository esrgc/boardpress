var json2csv = require('json2csv')
  , fs = require('fs')
  , _ = require('underscore')
  , path = require('path')


//var db = require('../db')

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

exports.getBarData = function(req, res){
  var data = [
    {
      "Name": "Grant 5307",
      "On": 828,
      "Off": 1079
    },
    {
      "Name": "Grant 5311",
      "On": 289,
      "Off": 395
    },
    {
      "Name": "Grant DHR",
      "On": 1806,
      "Off": 3205
    }
  ]
  returnData(req, res, data)
}

exports.getBarData2 = function(req, res){
  var data = [
    {
      'id': 'Mon',
      '2011': '42235.7',
      '2012': '42235.7',
      '2013': '42235.7'
    },
    {
      'id': 'Tuesday Lol',
      '2011': '165113.8',
      '2012': '42235.7',
      '2013': '42235.7'
    },
    {
      'id': 'Wed',
      'geocode': '45',
      '2011': '64447.3',
      '2012': '42235.7',
      '2013': '42235.7'
    },
    {
      'id': 'Thu',
      '2011': '12444.0',
      '2012': '42235.7',
      '2013': '42235.7'
    },
    {
      'id': 'Fri',
      '2011': '22444.0',
      '2012': '42235.7',
      '2013': '42235.7'
    },
    {
      'id': 'Sat',
      '2011': '62444.0',
      '2012': '42235.7',
      '2013': '42235.7'
    },
    {
      'id': 'Sun',
      '2011': '92444.0',
      '2012': '42235.7',
      '2013': '42235.7'
    }
  ]
  returnData(req, res, data)
}

exports.getTableData = function(req, res){
  var data = [
    {
      "ID": "111a",
      "Name": "111a",
      "Short": "111 South: Sby-PA-UMES",
      "Long": "111 South: Salisbury-Princess Anne-UMES",
      "CHILD": 13,
      "DIS": 11,
      "On": 358,
      "Off": 463
    },
    {
      "ID": "111r",
      "Name": "111r",
      "Short": "111 North: Sby-Delmar",
      "Long": "111 North: Salisbury - Delmar",
      "CHILD": 10,
      "DIS": 32,
      "On": 269,
      "Off": 373
    },
    {
      "ID": "190a",
      "Name": "190a",
      "Short": "190 NW & S Salisbury",
      "Long": "190 - Northwest & South Salisbury",
      "CHILD": 0,
      "DIS": 13,
      "On": 41,
      "Off": 51
    }
  ]
  returnData(req, res, data)
}

exports.getLineData = function(req, res){
  var data = [
    {
      'date': '2013-06-01',
      'numCats':92817,
      'goalCats': 100000
    },
    {
      'date': '2013-06-02',
      'numCats':82705,
      'goalCats': 100000
    },
    {
      'date': '2013-06-03',
      'numCats':75920,
      'goalCats': 100000
    }
  ]
  returnData(req, res, data)
}

exports.getPieData = function(req, res){
  var data = [
    {
      'id':'lol',
      'value':33
    },
    {
      'id':'cats',
      'value':11
    }
  ]
  returnData(req, res, data)
}

//Example
/*
exports.getRoutesMap = function(req, res){
  db.sqlFileToJson('getRoutesMap.sql', req.query, function(data){
    returnData(req, res, data)
  })
}
*/