var Connection = require('tedious').Connection
  , Request = require('tedious').Request
  , config = require('./config/config').db


config.options.debug = {
  data: true,
  payload: false,
  token: false,
  packet: true,
  log: true
}

exports.executeStatement = function(statement, next) {
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
      });
      var rows = []
      request.on('row', function(columns) {
        rows.push(columns)
      });
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