$(document).ready(function(){

  var routeColors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fdbf6f",
    "#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928","#a6cee3","#1f78b4",
    "#b2df8a","#33a02c","#fdbf6f","#ff7f00"]

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
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
      }).addTo(map)

      var busIcon = L.icon({
          iconUrl: 'img/bus-18.png',
          iconRetinaUrl: 'img/bus-18@2x.png',
          iconSize: [18, 18],
          popupAnchor: [1, -5]
      })

      $.get('getStopsMap', function(res){
        _.each(res, function(stop){
          L.marker([stop.lat, stop.lng], {icon: busIcon}).addTo(map)
            .bindPopup('<b>Stop</b><br>' + stop.id + '<br>' + stop.name)
        })
      })

      var myStyle = {
        "color": "#F06730",
        "weight": 3,
        "opacity": 1
      }

      var idx = 0
      function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.Name) {
          layer.bindPopup('<b>Route</b><br>' + feature.properties.route_refi + '<br>' + feature.properties.Name)
        }
        //if(routeColors[idx]) myStyle.color = routeColors[idx]
        layer.setStyle(myStyle)
        idx = idx + 1
      }
      $.get('data/stroutes.json', function(res){
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
        title: 'Chart Title',
        sort_key: false,
        sort_desc: true
      }
    },
    initialize: function() {
      this.update()
    },
    update: function() {
      var self = this
      var url = this.get('api')

      if(dashboard.filterView) {
        console.log(dashboard.filterView.model.toJSON())
        console.log($.param(dashboard.filterView.model.toJSON()))
        var querystring = $.param(dashboard.filterView.model.toJSON())
        url += '?' + querystring
        console.log(url)
      }
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

  /* ChartView BaseClass */
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
      var querystring = $.param(dashboard.filterView.model.toJSON())
      var url = this.model.get('api') + '?csv=true&' + querystring
      window.open(url)
    },
    code: function(e) {
      var querystring = $.param(dashboard.filterView.model.toJSON())
      var url = this.model.get('api') + '?' + querystring
      window.open(url)
    }
  })

  var FilterModel = Backbone.Model.extend({
    defaults: function() {
      return {
      }
    },
  })

  var FilterView = ChartView.extend({
    template: $('#filter-template').html(),
    events: {
      'click button[type="submit"]': 'submitForm',
      'click button.clear': 'clear'
    },
    initialize: function() {
      this.render()
      this.listenTo(this.model, 'change', this.update)
    },
    render: function() {
      var attrs = this.model.toJSON()
      attrs.title = 'Filters'
      this.$el.html(Mustache.render(this.template, attrs, {
        title: $('#title-partial').html()
      }))
      return this
    },
    update: function() {

    },
    clear: function(e) {
      e.preventDefault()
      this.model.clear()
      dashboard.chartCollection.each(function(chart){
        chart.update()
      })
    },
    submitForm: function(e){
      var self = this
      e.preventDefault()
      var filters = $(this.$el.find('form')).serializeArray()
      var days = []
      this.$el.find('input[name="days"]:checked').each(function(i, el){
        days.push($(el).val())
      })
      _.each(filters, function(filter){
        self.model.set(filter.name, filter.value)
      })
      self.model.set('days', days)
      dashboard.chartCollection.each(function(chart){
        chart.update()
      })
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
    },
    sortByHeader: function(e) {
      var column = e.target.innerHTML
      this.model.sortByKey(column)
    },
    setGroupBy: function(e){
      var groupBy = this.model.get('groupBy')
      var value = $(e.target).html()
      dashboard.filterView.model.set(groupBy, value)
      dashboard.chartCollection.each(function(chart){
        chart.update()
      })
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
        , interpolate: 'monotone'
        , xTickFormat: d3.time.format('%d/%m')
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

  var Dashboard = Backbone.View.extend({
    initialize: function(){

    },
    render: function(){
      this.filterView = new FilterView({el: '.block1', model: new FilterModel()})
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