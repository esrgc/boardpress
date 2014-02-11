$(document).ready(function(){

  var MapView = Backbone.View.extend({
    mapTemplate: $('#map-template').html(),
    initialize: function() {
      this.render()
    },
    render: function() {
      this.$el.html(Mustache.render(this.mapTemplate))
      this.makeMap()
      return this;
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
          layer.bindPopup('<b>Route</b><br>' + feature.properties.Name);
        }
      }
      $.get('/data/stroutes.json', function(res){
        L.geoJson(res, {
            onEachFeature: onEachFeature
        }).addTo(map);
      })

    }
  })

  var FilterModel = Backbone.Model.extend({
    defaults: function() {
      return {
        title: 'Filters'
      }
    },
  })

  var FilterView = Backbone.View.extend({
    template: $('#filter-template').html(),
    initialize: function() {
      this.render()
    },
    render: function() {
      this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
        title: $('#title-partial').html()
      }))
      return this;
    }
  })

  var ChartView = Backbone.View.extend({
    chartTemplate: $('#chart-template').html(),
    initialize: function() {
      this.render()
      this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
      this.$el.html(Mustache.render(this.chartTemplate, this.model.toJSON(), {
        title: $('#title-partial').html()
      }))
      return this;
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
        var data = self.prepData(res)
        self.set('data', data)
      })
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

  var ChartCollection = Backbone.Collection.extend({
    model: ChartModel
  })

  var chartCollection = new ChartCollection()
  chartCollection.add([
    {title: "Ridership By Route", api: '/getPassengersByRoute'},
    {title: "Ridership By Grant"},
    {title: "Ridership By Shift", api: '/getShifts'},
    {title: "Ridership By Trip", api: '/getPassengersByTrip'},
    {title: "Revenue"},
    {title: "Ridership By Stop", api: '/getStops'}
  ])

  var Dashboard = Backbone.View.extend({
    initialize: function(){
      this.render()
    },
    render: function(){
      this.filterView = new FilterView({el: '.block1', model: new FilterModel()})
      this.mapView = new MapView({el: '.block8'})
      var el = '.block'
      var block_number = 2
      chartCollection.forEach(function(chart, idx){
        var view = new ChartView({
          model: chart,
          el: el + block_number
        })
        block_number++
      })
    }
  })

  var dashboard = new Dashboard()

})