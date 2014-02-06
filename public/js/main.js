$(document).ready(function(){

  var MapView = Backbone.View.extend({
    chartTemplate: _.template($('#map-template').html()),
    initialize: function() {
      this.render()
    },
    render: function() {
      this.$el.html(this.chartTemplate())
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
    chartTemplate: _.template($('#chart-template').html()),
    initialize: function() {
      this.render()
    },
    render: function() {
      //this.$el.html(this.chartTemplate(this.model.toJSON()))
      this.$el.html(this.chartTemplate())
      return this;
    }
  })

  var Dashboard = Backbone.View.extend({
    el: $('.dashboard'),
    initialize: function(){
      new ChartView({el: '.block1'})
      new ChartView({el: '.block2'})
      new ChartView({el: '.block3'})
      new ChartView({el: '.block4'})
      new ChartView({el: '.block5'})
      new ChartView({el: '.block6'})
      new ChartView({el: '.block7'})
      this.mapView = new MapView({el: '.block8'})
    }
  })

  var dashboard = new Dashboard()

})