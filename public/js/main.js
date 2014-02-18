$(document).ready(function(){

  var routeColors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fdbf6f",
    "#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928","#a6cee3","#1f78b4",
    "#b2df8a","#33a02c","#fdbf6f","#ff7f00"]

  var MapView = Backbone.View.extend({
    mapTemplate: $('#map-template').html(),
    busIcon: L.icon({
      iconUrl: 'img/bus-18.png',
      iconRetinaUrl: 'img/bus-18@2x.png',
      iconSize: [18, 18],
      popupAnchor: [1, -5]
    }),
    initialize: function() {
      this.render()
      this.listenTo(dashboard.filterCollection, 'all', this.update)
    },
    render: function() {
      this.$el.html(Mustache.render(this.mapTemplate))
      this.makeMap()
      return this
    },
    makeMap: function() {
      var self = this
      var mapdiv = this.$el.find('.map')[0]
      this.map = L.map(mapdiv).setView([38.25, -75.5], 10)

      L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png')
        .addTo(this.map)

      this.stopLayer = new L.featureGroup()
      this.map.addLayer(this.stopLayer)

      this.routesLayer = new L.geoJson()

      $.get('data/stroutes.json', function(res){
        self.routesGeoJSON = res
        self.update()
      })
    },
    addStops: function(stops) {
      var self = this
      this.stopLayer.clearLayers()
      _.each(stops, function(stop){
        var m = L.marker([stop.lat, stop.lng], {icon: self.busIcon})
          .bindPopup('<b>Stop</b><br>' + stop.id + '<br>' + stop.name)
        self.stopLayer.addLayer(m)
      })
      if(stops.length > 1) {
        var bounds = self.stopLayer.getBounds()
        self.map.fitBounds(bounds)
      } else if(stops.length == 1) {
        self.map.setView([stops[0].lat, stops[0].lng], 14)
      }

    },
    addRoutes: function(routes) {
      var self = this
      var idx = 0
      , myStyle = {
        "color": "#F06730",
        "weight": 3,
        "opacity": 1
      }
      , onEachFeature = function(feature, layer) {
        if (feature.properties && feature.properties.Name) {
          layer.bindPopup('<b>Route</b><br>' + feature.properties.route_refi + '<br>' + feature.properties.Name)
        }
        if(routeColors[idx]) myStyle.color = routeColors[idx]
        layer.setStyle(myStyle)
        idx = idx + 1
      },
      filter = function(feature, layer){
        if(self.routesToShow.indexOf(feature.properties.route_refi) >= 0) {
          return true
        } else {
          return false
        }
      }
      this.routesLayer.clearLayers()
      this.routesLayer = L.geoJson(routes, {
          onEachFeature: onEachFeature,
          filter: filter
      }).addTo(this.map)
    },
    update: function() {
      var self = this
      var stopssurl = 'getStopsMap'
      var routesurl = 'getRoutesMap'
      var querystring = '?' + $.param(dashboard.filterCollection.toJSON())
      stopssurl += querystring
      routesurl += querystring

      $.getJSON(stopssurl, function(res){
        self.addStops(res)
      })

      $.getJSON(routesurl, function(res){
        self.routesToShow = _.pluck(res, 'id')
        self.addRoutes(self.routesGeoJSON)
      })
    }
  })

  var ChartModel = Backbone.Model.extend({
    defaults: function() {
      return {
        api: '/getRoutes',
        title: 'Chart Title',
        sort_key: false,
        sort_desc: true
      }
    },
    initialize: function() {
      this.update()
      this.listenTo(dashboard.filterCollection, 'all', this.update)
    },
    update: function() {
      var self = this
      var url = this.get('api')
      url += '?' + $.param(dashboard.filterCollection.toJSON())
      $.getJSON(url, function(res){
        self.set('data', res)
      })
    },
    sortByKey: function(column) {
      var data = this.get('data')
      if(!this.get('sort_key')) {
        this.set('sort_key', column)
        this.set('sort_desc', true)
      } else if(this.get('sort_key') === column) {
        var sort_order = this.get('sort_desc')
        this.set('sort_desc', !sort_order)
      } else if(this.get('sort_key') !== column) {
        this.set('sort_key', column)
        this.set('sort_desc', true)
      }
      if(this.get('sort_desc')){
        data = _.sortBy(data, function(obj){ return obj[column] }).reverse()
      } else {
        data = _.sortBy(data, function(obj){ return obj[column] })
      }
      this.set('data', data)
    }
  })

  var ChartCollection = Backbone.Collection.extend({
    model: ChartModel
  })

  var ChartView = Backbone.View.extend({
    template: $('#chart-template').html(),
    events: {
      "click .download":  "download",
      "click .code":  "code"
    },
    initialize: function() {
      this.render()
      this.listenTo(this.model, 'change:data', this.render)
    },
    render: function() {
      this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
        title: $('#title-partial').html()
      }))
      return this
    },
    prepData: function(res) {
      return res
    },
    download: function(e) {
      var querystring = $.param(dashboard.filterCollection.toJSON())
      var url = this.model.get('api') + '?csv=true&' + querystring
      window.open(url)
    },
    code: function(e) {
      var querystring = $.param(dashboard.filterCollection.toJSON())
      var url = this.model.get('api') + '?' + querystring
      window.open(url)
    }
  })

  var FilterModel = Backbone.Model.extend({
    defaults: function() {
      return {
      }
    },
    initialize: function(){
      if(!this.get('display')) {
        this.set('display', this.get('value'))
      }
    }
  })

  var FilterCollection = Backbone.Collection.extend({
    model: FilterModel
  })

  var FilterMenuView = ChartView.extend({
    template: $('#filter-template').html(),
    events: {
      'click button[type="submit"]': 'submitForm',
      'click button.clear': 'clear'
    },
    initialize: function() {
      this.render()
      this.listenTo(dashboard.filterCollection, 'remove', this.render)
      this.listenTo(dashboard.filterCollection, 'add', this.render)
    },
    render: function() {
      var self = this
      var attrs = {}
      attrs.title = 'Filters'
      this.$el.html(Mustache.render(this.template, attrs, {
        title: $('#title-partial').html()
      }))
      dashboard.filterCollection.each(function(filter){
        var inputs = self.$el.find(':input[name="' + filter.get('name') + '"]')
        var value = filter.get('value')
        if(inputs.length == 1) {
          $(inputs).val(value)
        } else if(inputs.length > 1){
          inputs.each(function(idx, input){
            if(value.indexOf(input.value) < 0){
              input.checked = false
            }
          })
        }
      })
      return this
    },
    clear: function(e) {
      e.preventDefault()
      //this.render()
    },
    getAttributes: function() {
      var self = this
      self.$el.find('.filter').each(function(idx, filterel){
        var inputs = $(filterel).find(':input')
        if(inputs.length) {
          var value = $(filterel).find(':checkbox:checked').map(function() {
            return this.value
          }).get().join(',')
          if(!value) {
            value = $(inputs).val()
          }
          var name = $(inputs).get(0).name
            , filters = dashboard.filterCollection.where({'name': name})
            , filter = false
          if(filters.length){
            filters[0].set('value', value)
            filters[0].set('display', value)
          } else {
            dashboard.filterCollection.add({
              name: name,
              value: value
            })
          }
        }
      })
    },
    submitForm: function(e){
      e.preventDefault()
      this.getAttributes()
    }
  })

  var TableView = ChartView.extend({
    template: $('#table-template').html(),
    events: function(){
      return _.extend({},ChartView.prototype.events,{
        'click th' : 'sortByHeader',
        'click td.grouper' : 'setGroupBy'
      })
    },
    render: function() {
      var self = this
      var attrs = this.model.toJSON()
      if(attrs.data) {
        attrs.data = this.prepData(attrs.data)
      }
      this.$el.html(Mustache.render(this.template, attrs, {
        title: $('#title-partial').html(),
        toolbar: $('#toolbar-partial').html()
      }))
      this.$el.find('th').each(function(idx, th){
        if(th.innerHTML === self.model.get('sort_key')) {
          $(th).addClass('sort')
        }
      })
      this.$el.find('tbody tr').each(function(idx, tr){
        var first = $(tr).find('td')[0]
        $(first).addClass('grouper')
      })
      return this
    },
    prepData: function(res) {
      var table = {
        rows: [],
        columns: []
      }
      if(res.length) {
        var data = []
        _.each(res, function(row){
          data.push(_.omit(row, ['ID', 'Long']))
        })
        var columns = _.keys(data[0])
        var index = columns.indexOf('Short')
        if(index !== -1){
          columns[index] = 'Name'
        }
        table.columns = columns
        _.each(data, function(row){
          table.rows.push({
            row: _.values(row)
          })
        })
      }
      return table
    },
    sortByHeader: function(e) {
      var column = e.target.innerHTML
      this.model.sortByKey(column)
    },
    setGroupBy: function(e){
      var groupBy = this.model.get('groupBy')
      var value = $('<div />').html($(e.target).html()).text()
      var key = _.where(this.model.get('data'), {'Short': value})[0]['ID']
      var m = dashboard.filterCollection.where({name: groupBy})
      if(m.length) {
        m[0].set({name: groupBy, value: key, display: value})
      } else {
        dashboard.filterCollection.add([
          {name: groupBy, value: key, display: value}
        ])
      }
    }
  })

  var BarChartView = ChartView.extend({
    initialize: function() {
      this.render()
      this.listenTo(this.model, 'change:data', this.update)
    },
    render: function() {
      this.$el.html(Mustache.render(this.template, this.model.toJSON(), {
        title: $('#title-partial').html(),
        toolbar: $('#toolbar-partial').html()
      }))
      this.drawChart()
      return this
    },
    drawChart: function() {
      var chartel = this.$el.find('.chart-inner').selector
      this.chart = new GeoDash.BarChartHorizontal(chartel, {
        y: 'Name'
        , x: ['On', 'Off']
        , colors: ['#F06730', '#66A7E1']
        , xTickFormat: d3.format(".2s")
        , yWidth: 60
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
        x: 'Date'
        , y: ['111a', '111r']
        , colors: ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]
        , legend: true
        , interpolate: 'none'
        , xTickFormat: d3.time.format('%m/%d')
        , yTicksCount: 5
      })
    },
    prepData: function(res) {
      var lines = []
      _.each(res, function(el){
        lines.push(_.keys(_.omit(el, "Date")))
      })
      lines = _.uniq(_.flatten(lines))
      this.chart.options.y = lines
      var parseDate = d3.time.format('%Y-%m-%d').parse
      _.each(res, function(obj, idx){
        obj.Date = parseDate(obj.Date)
      })
      return res
    }
  })

  var FilterLabelView = Backbone.View.extend({
    template: $('#filter-label-template').html(),
    tagName: 'div',
    className: 'filter-label',
    events: {
      'click .remove': 'removeFilter'
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render)
      this.listenTo(this.model, 'destroy', this.remove)
    },
    render: function() {
      this.$el.html(Mustache.render(this.template, this.model.toJSON()))
      return this
    },
    removeFilter: function(){
      this.model.destroy()
    }
  })

  var SummaryView = Backbone.View.extend({
    template: $('#summary-template').html(),
    events: {

    },
    initialize: function() {
      this.render()
      this.listenTo(dashboard.filterCollection, 'add', this.addOne)
    },
    addOne: function(filter) {
      var view = new FilterLabelView({model: filter});
      this.$(".filter-labels").append(view.render().el);
    },
    addAll: function() {
      dashboard.filterCollection.each(this.addOne, this);
    },
    render: function() {
      this.$el.html(Mustache.render(this.template))
      this.addAll()
      return this
    }
  })

  var Dashboard = Backbone.View.extend({
    initialize: function(){

    },
    render: function(){
      this.filterCollection = new FilterCollection()
      this.filterCollection.add([
        {name: "startDate", value: '1970-01-01'},
        {name: "endDate", value: '2015-01-01'},
        {name: "days", value: ['1', '2', '3', '4', '5', '6', '7']},
        {name: "passType", value: 'All'}
      ])
      this.filterMenuView = new FilterMenuView({el: '.block1'})
      this.summaryView = new SummaryView({el: '.block9'})
      this.mapView = new MapView({el: '.block3'})
      this.chartCollection = new ChartCollection()
      this.chartCollection.add([
        {title: "Ridership By Route", api: 'getPassengersByRoute', groupBy: 'route'},
        {title: "Ridership By Shift", api: 'getPassengersByShift', groupBy: 'shift'},
        {title: "Ridership By Trip", api: 'getPassengersByTrip', groupBy: 'trip'},
        {title: "Ridership By Stop", api: 'getPassengersByStop', groupBy: 'stop'},
        {title: "Ridership By Grant", api: 'getPassengersByGrant'},
        {title: "Revenue", api: 'getFares'}
      ])
      new TableView({
        model: this.chartCollection.at(0),
        el: '.block2'
      })
      new BarChartView({
        model: this.chartCollection.at(4),
        el: '.block4'
      })
      new TableView({
        model: this.chartCollection.at(1),
        el: '.block5'
      })
      new TableView({
        model: this.chartCollection.at(2),
        el: '.block6'
      })
      new LineChartView({
        model: this.chartCollection.at(5),
        el: '.block7'
      })
      new TableView({
        model: this.chartCollection.at(3),
        el: '.block8'
      })
    }
  })

  var dashboard = new Dashboard()

  dashboard.render()

})