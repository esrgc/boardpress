var mustache = require('mustache')
  , TYPES = require('tedious').TYPES


/*
*  Filter Names:
*    passFilter
*    dateRangeFilter
*    dayFilter
*    variable
*/

exports.addFilters = function(statement, filters) {
  var template = {
    filters: '',
    variable: 'Route'
  }
  var clauses = []
    , parameters = []

  if(Object.keys(filters).length) {
    if(filters.passType && filters.passType !== 'All') {
      var parameter = {
        name: 'passType',
        value: filters.passType,
        type: TYPES.VarChar
      }
      var clause = "and passType_refid = @" + parameter.name
      parameters.push(parameter)
      template.passFilter = clause
      clauses.push(clause)
    }
    if(filters.startDate || filters.endDate) {
      var parameter = {
        name: 'startDate',
        value: filters.startDate || '2000-01-01',
        type: TYPES.VarChar
      }
      var parameter2 = {
        name: 'endDate',
        value: filters.endDate || '2100-01-01',
        type: TYPES.VarChar
      }
      var clause = "and stopdate between @" + parameter.name + ' and @' + parameter2.name
      parameters.push(parameter)
      parameters.push(parameter2)
      template.dateRangeFilter = clause
      clauses.push(clause)
    }
    if(filters.days) {
      var days = filters.days
      var clause = "and datepart(weekday,stopdate) in ("
      if(typeof days === 'string') {
        days = [days]
      }
      days.forEach(function(day, idx){
        var parameter = {
          name: 'day' + idx,
          value: day,
          type: TYPES.VarChar
        }
        clause += "@" + parameter.name + ", "
        parameters.push(parameter)
      })
      clause = clause.substring(0, clause.length - 2) //remove last comma
      clause += ")"
      template.dayFilter = clause
      clauses.push(clause)
    }
    template.filters = clauses.join(' ')
  }
  if(filters.by) {
    var x = {
      "route": "Route",
      "shift": "Shift",
      "trip": "Trip",
      "stop": "Stop"
    }
    if(x[filters.by]) {
      template.variable = x[filters.by]
    }
  }
  statement = mustache.render(statement, template)
  console.log(statement)
  return {
    statement: statement,
    parameters: parameters
  }
}