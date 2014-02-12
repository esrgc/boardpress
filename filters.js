var mustache = require('mustache')
  , TYPES = require('tedious').TYPES

exports.addFilters = function(statement, filters) {
  var template = {
    filters: ''
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
      clauses.push(clause)
    }
    if(filters.days) {
      var clause = "and datepart(weekday,stopdate) in ("
      filters.days.forEach(function(day, idx){
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
      clauses.push(clause)
    }
    template.filters = clauses.join(' ')
  }
  statement = mustache.render(statement, template)
  return {
    statement: statement,
    parameters: parameters
  }
}