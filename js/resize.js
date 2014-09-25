$(window).resize(function(){
  var clock = Processing.getInstanceById('weather-clock');
  clock.setSize(window.innerWidth, window.innerHeight);
});