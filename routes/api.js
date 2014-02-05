var db = require('../db')

exports.getRoutes = function(req, res){
  var statement = 'select route_refid, route_shortname, route_color, route_estmileage from routes'
  db.executeStatement(statement, function(routes) {
    res.json(routes)
  })
}
