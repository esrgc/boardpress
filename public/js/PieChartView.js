var Backbone = require('backbone')
  , _ = require('underscore')
  , BarChartView = require('./BarChartView')
Backbone.$ = $

var PieChartView = BarChartView.extend({
  drawChart: function() {
    var chartel = this.$el.find('.chart-inner').get(0)
    this.chart = new GeoDash.PieChart(chartel, {
      label: this.model.get('key')
      , value: 'value'
      , colors: ['#D1E751', '#26ADE4', "#333"]
      , opacity: 1
    })
  },
  prepData: function(res) {
   return res
  }
})

module.exports = PieChartView