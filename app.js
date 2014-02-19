
/**
 *   Shore Transit Dashboard
 */

//set up configuration
var configs = require('./config/config.js')

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , api = require('./routes/api')

var app = express()

app.configure(function(){
  app.set('port', process.env.PORT || 3000)
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
app.get('/getBarData', api.getBarData)
app.get('/getBarData2', api.getBarData2)
app.get('/getTableData', api.getTableData)
app.get('/getLineData', api.getLineData)
app.get('/getPieData', api.getPieData)

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'))
})
