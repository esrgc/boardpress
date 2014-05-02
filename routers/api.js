var express = require('express')
  , returnData = require('../lib/return-data')

var api = new express.Router()

/* Return dummy data */

api.get('/getBarData', function(req, res){
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
})

api.get('/getBarData2', function(req, res){
  var data = [
    {
      'id': 'Mon',
      '2011': 42235.7,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Tuesday Lol',
      '2011': 165113.8,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Wed',
      '2011': 64447.3,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Thu',
      '2011': 12444.0,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Fri',
      '2011': 22444.0,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Sat',
      '2011': 62444.0,
      '2012': 42235.7,
      '2013': 42235.7
    },
    {
      'id': 'Sun',
      '2011': 92444.0,
      '2012': 42235.7,
      '2013': 42235.7
    }
  ]
  returnData(req, res, data)
})

api.get('/getTableData', function(req, res){
  var data = [
    {
      "ID": "111a",
      "CHILD": 13,
      "DIS": 11,
      "On": 358,
      "Off": 463
    },
    {
      "ID": "111r",
      "CHILD": 10,
      "DIS": 32,
      "On": 269,
      "Off": 373
    },
    {
      "ID": "190a",
      "CHILD": 0,
      "DIS": 13,
      "On": 41,
      "Off": 51
    }
  ]
  returnData(req, res, data)
})

api.get('/getLineData', function(req, res){
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
})

api.get('/getPieData', function(req, res){
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
})

module.exports = api