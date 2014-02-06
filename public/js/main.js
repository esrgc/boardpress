$(document).ready(function(){
  _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
  }

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
      //this.$el.html(this.chartTemplate())
      return this;
    }
  })

  var ChartModel = Backbone.Model.extend({
    defaults: function() {
      return {
        api: '/getRoutes',
        title: 'Chart Title',
        data: [
          [
            {
              "name": "route_refid",
              "value": "701a"
            },
            {
              "name": "route_shortname",
              "value": "701 North: Sby-Crisfield-PA"
            },
            {
              "name": "route_color",
              "value": "Lilac"
            },
            {
              "name": "route_estmileage",
              "value": 69.6
            }
          ],
          [
            {
              "name": "route_refid",
              "value": "111a"
            },
            {
              "name": "route_shortname",
              "value": "111 South: Sby-PA-UMES"
            },
            {
              "name": "route_color",
              "value": "Peach"
            },
            {
              "name": "route_estmileage",
              "value": 62.4
            }
          ],
          [
            {
              "name": "route_refid",
              "value": "451a"
            },
            {
              "name": "route_shortname",
              "value": "451 Sby-Poc-OC"
            },
            {
              "name": "route_color",
              "value": "Lime"
            },
            {
              "name": "route_estmileage",
              "value": 113
            }
          ],
          [
            {
              "name": "route_refid",
              "value": "171a"
            },
            {
              "name": "route_shortname",
              "value": "171 West Salisbury"
            },
            {
              "name": "route_color",
              "value": "Blue"
            },
            {
              "name": "route_estmileage",
              "value": 11.9
            }
          ],
          [
            {
              "name": "route_refid",
              "value": "131a"
            },
            {
              "name": "route_shortname",
              "value": "131 Southeast Salisbury"
            },
            {
              "name": "route_color",
              "value": "Green"
            },
            {
              "name": "route_estmileage",
              "value": 8.71
            }
          ]
        ]
      };
    }
  })

  var ChartCollection = Backbone.Collection.extend({
    model: ChartModel
  })

  var chartCollection = new ChartCollection()
  chartCollection.add([
    {title: "Flying Dutchman"},
    {title: "Black Pearl"},
    {title: "Black Pearl"},
    {title: "Black Pearl"},
    {title: "Black Pearl"},
    {title: "Black Pearl"},
    {title: "Black Pearl"}
  ])

  var Dashboard = Backbone.View.extend({
    initialize: function(){
      this.render()
    },
    render: function(){
      this.mapView = new MapView({el: '.block8'})
      var el = '.block'
      chartCollection.forEach(function(chart, idx){
        console.log(chart, idx)
        console.log(el + (idx+1))
        var view = new ChartView({
          model: chart,
          el: el + (idx+1)
        })
      })
    }
  })

  var dashboard = new Dashboard()

})