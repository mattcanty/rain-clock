function updateColor(temp) {

  var colorMap = [
    {"temp": -30, "color": {"r": 38,  "g": 84,  "b": 114}},
    {"temp": -7,  "color": {"r": 75,  "g": 168, "b": 231}},
    {"temp": 0,   "color": {"r": 115, "g": 209, "b": 239}},
    {"temp": 5,   "color": {"r": 67,  "g": 205, "b": 187}},
    {"temp": 18,  "color": {"r": 251, "g": 171, "b": 48}},
    {"temp": 27,  "color": {"r": 244, "g": 119, "b": 25}},
    {"temp": 50,  "color": {"r": 254, "g": 81,  "b": 12}}
  ];

  var r = 0;
  var g = 0;
  var b = 0;

  for (i = 0; i < colorMap.length; i++) {
    if (temp <= colorMap[i].temp) {
      if (i > 0) {
        var bottomColorMap = colorMap[i - 1];
        var topColorMap = colorMap[i];

        r = bottomColorMap.color.r + ((topColorMap.color.r - bottomColorMap.color.r) / (topColorMap.temp - bottomColorMap.temp)) * (temp - bottomColorMap.temp);
        g = bottomColorMap.color.g + ((topColorMap.color.g - bottomColorMap.color.g) / (topColorMap.temp - bottomColorMap.temp)) * (temp - bottomColorMap.temp);
        b = bottomColorMap.color.b + ((topColorMap.color.b - bottomColorMap.color.b) / (topColorMap.temp - bottomColorMap.temp)) * (temp - bottomColorMap.temp);
        break;
      } else {
        // lowest temp
        r = colorMap[i].color.r;
        g = colorMap[i].color.g;
        b = colorMap[i].color.b;
        break;
      }
    } else if (i == colorMap.length - 1) {
      // highest temp
      r = colorMap[i].color.r;
      g = colorMap[i].color.g;
      b = colorMap[i].color.b;
    }
  }

  r |= 0;
  g |= 0;
  b |= 0;

  document.getElementById("output").innerHTML = "rgb(" + r + ", " + g + ", " + b + ")";
  document.body.style.background = "rgb(" + r + ", " + g + ", " + b + ")";
}