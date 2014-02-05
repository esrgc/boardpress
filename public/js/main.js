$(document).ready(function(){

  var mapdiv = $('.map')[0]
  var map = L.map(mapdiv).setView([38.35, -75.6], 9);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  L.marker([38.35, -75.6]).addTo(map)
    .bindPopup('A stop')

})