var Connection = require('tedious').Connection
  , Request = require('tedious').Request
  , TYPES = require('tedious').TYPES
  , config = require('./config/config').db
  , fs = require('fs')
  , path = require('path')
  , filters = require('./filters')

var query_path = path.join(__dirname, '/queries') + '/'

exports.sqlFileToJson = function(file, parameters, next) {
  fs.readFile(query_path + file, function (err, data) {
    if (err) throw err
    var statement = data.toString()
    query_info = filters.addFilters(statement, parameters)
    exports.executeStatement(query_info.statement, query_info.parameters, function(data) {
      next(data)
    })
  })
}

exports.executeStatement = function(statement, parameters, next) {
  var connection = new Connection(config)
  connection.on('connect', function(err) {
    if(err) {
      console.log(err)
    } else {
      statement = statement.toString()
      request = new Request(statement, function(err, rowCount) {
        if (err) {
          console.log(err)
        } else {
          next(rowsToObjectLiteral(rows))
        }
        connection.close()
      })
      if(parameters && parameters.length) {
        parameters.forEach(function(parameter){
          request.addParameter(parameter.name, parameter.type, parameter.value);
        })
      }
      var rows = []
      request.on('row', function(columns) {
        rows.push(columns)
      })
      connection.execSql(request)
    }
  })
}

/*
* {name: colName, value: value}
*/
function rowsToObject(rows) {
  var result = []
  rows.forEach(function(row) {
    var newrow = []
    row.forEach(function(column){
      var obj = {
        name: column.metadata.colName,
        value: column.value
      }
      newrow.push(obj)
    })
    result.push(newrow)
  })
  return result
}

/*
* {colName: value}
*/
function rowsToObjectLiteral(rows) {
  var result = []
  rows.forEach(function(row) {
    var newrow = {}
    row.forEach(function(column){
      newrow[column.metadata.colName] = column.value
    })
    result.push(newrow)
  })
  return result
}