$(document).ready(function(){


  var MapView = Backbone.View.extend({
    mapTemplate: $('#map-template').html(),
    initialize: function() {
      this.render()
      this.listenTo(dashboard.filterCollection, 'all', this.update)
    },
    render: function() {
      var attrs = {
        title: 'Map'
      }
      this.$el.html(Mustache.render(this.mapTemplate, attrs, {
        title: $('#title-partial').html()
      }))
      this.makeMap()
      return this
    },
    makeMap: function() {
      var self = this
      var mapdiv = this.$el.find('.chart-inner')[0]
      this.map = L.map(mapdiv).setView([38.25, -75.5], 10)
      L.tileLayer('http://{s}.tiles.mapbox.com/v3/esrgc.map-y9awf40v/{z}/{x}/{y}.png')
        .addTo(this.map)
    },
    update: function() {

    }
  })

  var ChartModel = Backbone.Model.extend({
    defaults: function() {
      return {
        api: '',
        title: 'Chart Title',
        sort_key: false,
        sort_desc: true
      }
    },
    initialize: function() {
      this.update()
      this.listenTo(dashboard.filterCollection, 'change', this.update)
      this.listenTo(dashboard.filterCollection, 'add', this.update)
      this.listenTo(dashboard.filterCollection, 'remove', this.update)
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
        var data = res
        var columns = _.keys(data[0])
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
      var key = _.where(this.model.get('data'), {'Name': value})[0]['ID']
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
      this.$el.find('.chart-inner').css('overflow', 'hidden')
      return this
    },
    drawChart: function() {
      var chartel = this.$el.find('.chart-inner').selector
      this.chart = new GeoDash.BarChartVertical(chartel, {
        x: 'id'
        , y: ['2011', '2013']
        , colors: ['#D1E751', '#26ADE4', "#333"]
        , title: 'Vertical Bar Chart'
        , yTickFormat: d3.format(".2s")
        , opacity: 1
      })
    },
    update: function() {
      this.chart.update(this.prepData(this.model.get('data')))
    }
  })

  var HorizontalBarChartView = BarChartView.extend({
    drawChart: function() {
      var chartel = this.$el.find('.chart-inner').selector
      this.chart = new GeoDash.BarChartHorizontal(chartel, {
        y: 'Name'
        , x: ['On', 'Off']
        , colors: ['#D1E751', '#26ADE4']
        , xTickFormat: d3.format(".2s")
        , yWidth: 60
        , opacity: 1
      })
    }
  })

  var LineChartView = BarChartView.extend({
    drawChart: function() {
      var chartel = this.$el.find('.chart-inner').selector
      this.chart = new GeoDash.LineChart(chartel, {
        x: 'date'
        , y: ['numCats', 'goalCats']
        , colors: ['#D1E751', '#26ADE4']
        , legend: true
        , legendWidth: 50
        , hoverTemplate: "{{x}}: {{y}}"
        , interpolate: 'none'
        , xTickFormat: d3.time.format('%m/%d')
        , yTicksCount: 5
      })
    },
    prepData: function(res) {
      var parseDate = d3.time.format('%Y-%m-%d').parse
      _.each(res, function(obj, idx){
        obj.date = parseDate(obj.date)
      })
      return res
    }
  })

  var PieChartView = BarChartView.extend({
    drawChart: function() {
      var chartel = this.$el.find('.chart-inner').selector
      this.chart = new GeoDash.PieChart(chartel, {
        label: 'id'
        , value: 'value'
        , colors: ['#D1E751', '#26ADE4', "#333"]
        , opacity: 1
      })
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

      ])
      this.mapView = new MapView({el: '.block0'})
      this.chartCollection = new ChartCollection()
      this.chartCollection.add([
        {title: "Test Chart 1", api: 'getBarData2'},
        {title: "Test Chart 2", api: 'getTableData'},
        {title: "Test Chart 3", api: 'getLineData'},
        {title: "Test Chart 4", api: 'getPieData'},
        {title: "Test Chart 5", api: 'getBarData'}
      ])
      new BarChartView({
        model: this.chartCollection.at(0),
        el: '.block1'
      })
      new TableView({
        model: this.chartCollection.at(1),
        el: '.block2'
      })
      new LineChartView({
        model: this.chartCollection.at(2),
        el: '.block3'
      })
      new PieChartView({
        model: this.chartCollection.at(3),
        el: '.block4'
      })
      new HorizontalBarChartView({
        model: this.chartCollection.at(4),
        el: '.block5'
      })
    }
  })

  var dashboard = new Dashboard()

  dashboard.render()

})