var mustache = require('mustache')
  , TYPES = require('tedious').TYPES


/*
*  Filter Names:
*    columnExample
*/

//select * from table where {{columnExampleFilter}}

exports.addFilters = function(statement, filters) {
  var template = {
    filters: '',
    variable: 'route'
  }
  var clauses = []
    , parameters = []

  if(Object.keys(filters).length) {
    if(filters.columnExample) {
      var parameter = {
        name: 'columnExample',
        value: filters.columnExample,
        type: TYPES.VarChar
      }
      var clause = "and columnExample = @" + parameter.name
      parameters.push(parameter)
      template.columnExampleFilter = clause
    }
  }
  statement = mustache.render(statement, template)
  return {
    statement: statement,
    parameters: parameters
  }
}