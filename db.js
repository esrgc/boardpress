var Connection = require('tedious').Connection
  , Request = require('tedious').Request
  , config = require('./config/config').db

var connection = null

exports.connect = function() {
  connection = new Connection(config)
  connection.on('connect', function(err) {
    if(err) {
      console.log(err)
    }
  })
}

exports.executeStatement = function(statement, next) {
  request = new Request(statement, function(err, rowCount) {
    if (err) {
      console.log(err);
    } else {
      next(rowsToObject(rows))
    }
  });
  var rows = []
  request.on('row', function(columns) {
    rows.push(columns)
  });
  connection.execSql(request);
}

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