$('#map-button').click(function() {
  $('.widget-map').addClass('selected');
  $('.widget-weather').removeClass('selected');
  $('.widget-gallery').removeClass('selected');
});

$('#weather-button').click(function() {
  $('.widget-weather').addClass('selected');
  $('.widget-map').removeClass('selected');
  $('.widget-gallery').removeClass('selected');
});

$('#gallery-button').click(function() {
  $('.widget-gallery').addClass('selected');
  $('.widget-map').removeClass('selected');
  $('.widget-weather').removeClass('selected');
});