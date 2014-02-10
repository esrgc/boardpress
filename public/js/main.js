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
      var map = L.map(mapdiv).setView([38.35, -75.6], 9);

      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      L.marker([38.35, -75.6]).addTo(map)
        .bindPopup('A stop')
    }
  })

  var ChartView = Backbone.View.extend({
    chartTemplate: $('#chart-template').html(),
    initialize: function() {
      this.render()
      this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
      this.$el.html(Mustache.render(this.chartTemplate, this.model.toJSON()))
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
        columns: []
      }
      _.each(res, function(row){
        data.rows.push({
          row: row
        })
      })
      data.columns = _.pluck(data.rows[0].row, 'name')
      return data
    }
  })

  var ChartCollection = Backbone.Collection.extend({
    model: ChartModel
  })

  var chartCollection = new ChartCollection()
  chartCollection.add([
    {title: "Filters"},
    {title: "Ridership By Route"},
    {title: "Ridership By Grant"},
    {title: "Ridership By Shift"},
    {title: "Ridership By Trip"},
    {title: "Revenue"},
    {title: "Ridership By Stop"}
  ])

  var Dashboard = Backbone.View.extend({
    initialize: function(){
      this.render()
    },
    render: function(){
      this.mapView = new MapView({el: '.block8'})
      var el = '.block'
      var block_number = 1
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