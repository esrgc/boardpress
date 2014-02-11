$(document).ready(function(){

  var MapView = Backbone.View.extend({
    mapTemplate: $('#map-template').html(),
    initialize: function() {
      this.render()
    },
    render: function() {
      this.$el.html(Mustache.render(this.mapTemplate))
      this.makeMap()
      return this
    },
    makeMap: function() {
      var mapdiv = this.$el.find('.map')[0]
      var map = L.map(mapdiv).setView([38.25, -75.5], 10)

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      $.get('/getStopsMap', function(res){
        _.each(res, function(stop){
          L.marker([stop.lat, stop.lng]).addTo(map)
            .bindPopup('<b>Stop</b><br>' + stop.name)
        })
      })

      function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.Name) {
          layer.bindPopup('<b>Route</b><br>' + feature.properties.Name)
        }
      }
      $.get('/data/stroutes.json', function(res){
        L.geoJson(res, {
            onEachFeature: onEachFeature
        }).addTo(map)
      })

    }
  })

  var ChartModel = Backbone.Model.extend({
    defaults: function() {
      return {
        api: '/getRoutes',
        title: 'Chart Title'
      }
    },
    initialize: function() {
      var self = this
      $.getJSON(this.get('api'), function(res){
        self.set('data', res)
      })
    }
  })

  var ChartCollection = Backbone.Collection.extend({
    model: ChartModel
  })

  /* ChartView BaseClass */
  var ChartView = Backbone.View.extend({
    template: $('#chart-template').html(),
    initialize: function() {
      this.render()
      this.listenTo(this.model, 'change', this.render)
    },
    render: function() {
      this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
        title: $('#title-partial').html()
      }))
      return this
    },
    prepData: function(res) {
      return res
    }
  })

  var FilterModel = Backbone.Model.extend({
    defaults: function() {
      return {
        title: 'Filters'
      }
    },
  })

  var FilterView = ChartView.extend({
    template: $('#filter-template').html()
  })

  var TableView = ChartView.extend({
    template: $('#table-template').html(),
    render: function() {
      var attrs = this.model.toJSON()
      if(attrs.data) {
        attrs.data = this.prepData(attrs.data)
      }
      this.$el.html(Mustache.render(this.template, attrs, {
        title: $('#title-partial').html()
      }))
      return this
    },
    prepData: function(res) {
      var data = {
        rows: [],
        columns: _.keys(res[0])
      }
      _.each(res, function(row){
        data.rows.push({
          row: _.values(row)
        })
      })
      return data
    }
  })

  var BarChartView = ChartView.extend({
    initialize: function() {
      this.render()
      this.listenTo(this.model, 'change:data', this.update)
    },
    render: function() {
      this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
        title: $('#title-partial').html()
      }))
      this.drawChart()
      return this
    },
    drawChart: function() {
      var chartel = this.$el.find('.chart-inner').selector
      this.chart = new GeoDash.BarChartVertical(chartel, {
        x: 'Name'
        , y: ['On', 'Off']
        , colors: ['#F06730', '#66A7E1']
        , yTickFormat: d3.format(".2s")
      })
    },
    update: function() {
      this.chart.update(this.prepData(this.model.get('data')))
    }
  })

  var LineChartView = BarChartView.extend({
    drawChart: function() {
      var chartel = this.$el.find('.chart-inner').selector
      this.chart = new GeoDash.LineChart(chartel, {
        x: 'date'
        , y: ['numCats', 'goalCats']
        , colors: ['#F06730', '#66A7E1']
        , interpolate: 'monotone'
        , xTickFormat: d3.time.format('%Y')
        , yTicksCount: 5
      })
    },
    prepData: function(res) {
      var parseDate = d3.time.format('%Y').parse
      _.each(res, function(obj, idx){
        obj.date = parseDate(obj.date)
      })
      return res
    }
  })

  var chartCollection = new ChartCollection()
  chartCollection.add([
    {title: "Ridership By Route", api: '/getPassengersByRoute'},
    {title: "Ridership By Shift", api: '/getPassengersByShift'},
    {title: "Ridership By Trip", api: '/getPassengersByTrip'},
    {title: "Ridership By Stop", api: '/getPassengersByStop'},
    {title: "Ridership By Grant", api: '/getPassengersByGrant'},
    {title: "Revenue", api: '/getRevenue'}
  ])

  var Dashboard = Backbone.View.extend({
    initialize: function(){
      this.render()
    },
    render: function(){
      this.filterView = new FilterView({el: '.block1', model: new FilterModel()})
      this.mapView = new MapView({el: '.block3'})
      new TableView({
        model: chartCollection.at(0),
        el: '.block2'
      })
      new BarChartView({
        model: chartCollection.at(4),
        el: '.block4'
      })
      new TableView({
        model: chartCollection.at(1),
        el: '.block5'
      })
      new TableView({
        model: chartCollection.at(2),
        el: '.block6'
      })
      new LineChartView({
        model: chartCollection.at(5),
        el: '.block7'
      })
      new TableView({
        model: chartCollection.at(3),
        el: '.block8'
      })
    }
  })

  var dashboard = new Dashboard()

})