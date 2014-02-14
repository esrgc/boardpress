
/**
 *   Shore Transit Dashboard
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , api = require('./routes/api')
  , db = require('./db')

var app = express()

app.configure(function(){
  app.set('port', process.env.PORT || 3006)
  app.set('views', __dirname + '/views')
  app.set('view engine', 'ejs')
  app.use(express.logger('dev'))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
  app.use(express.static(path.join(__dirname, 'public')))
})

app.configure('development', function(){
  app.use(express.errorHandler())
})

app.get('/', routes.index)
app.get('/getRoutes', api.getRoutes)
app.get('/getStops', api.getStops)
app.get('/getStopsMap', api.getStopsMap)
app.get('/getShifts', api.getShifts)
app.get('/getTrips', api.getTrips)
app.get('/getPassengersByRoute', api.getPassengersByRoute)
app.get('/getPassengersByTrip', api.getPassengersByTrip)
app.get('/getPassengersByStop', api.getPassengersByStop)
app.get('/getPassengersByShift', api.getPassengersByShift)
app.get('/getPassengersByGrant', api.getPassengersByGrant)
app.get('/getFares', api.getFares)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'))
})
