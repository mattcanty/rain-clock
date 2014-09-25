// Angles for sin() and cos() start at 3 o'clock;
// subtract HALF_PI to make them start at the top

int cx, cy;
float secondsRadius;
float minutesRadius;
float hoursRadius;
float clockDiameter;

void setup() {
  setSize(window.innerWidth, window.innerHeight);

  stroke(255);
}

void setSize(w, h){
  size(w, h);
  
  int radius = min(width, height) / 2;
  secondsRadius = radius * 0.72;
  minutesRadius = radius * 0.60;
  hoursRadius = radius * 0.50;
  clockDiameter = radius * 2;

  cx = width / 2;
  cy = height / 2;
}

void drawHands(){
  float s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  float m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  float h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

  stroke(0);
  strokeWeight(1);
  line(cx, cy, cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);
  strokeWeight(2);
  line(cx, cy, cx + cos(m) * minutesRadius, cy + sin(m) * minutesRadius);
  strokeWeight(4);
  line(cx, cy, cx + cos(h) * hoursRadius, cy + sin(h) * hoursRadius);
}

void drawMinuteTicks(){
  for (int a = 0; a < 360; a+=6) {
    beginShape(POINTS);
    if(a % 90 == 0){
      strokeWeight(4);
    } else if(a % 30 == 0) {
      strokeWeight(2);
    } else {
      strokeWeight(1);
    }
  
    float angle = radians(a);
    float x = cx + cos(angle) * secondsRadius;
    float y = cy + sin(angle) * secondsRadius;
    vertex(x, y);
    endShape();
  }
}

void drawRainPrediction(minute, intensity, probability) {
  var filterRedGreen = 255 - (probability * 255);
  
  // R, G, B
  stroke(filterRedGreen, filterRedGreen, 255);
  fill(filterRedGreen, filterRedGreen, 255);

  beginShape();
  
  var normalisedIntensity = 1 - (intensity * 30);
  var maxDisplayableIntensity = 0.2;
  var intensityDisplayed = normalisedIntensity < maxDisplayableIntensity 
  ? maxDisplayableIntensity : normalisedIntensity;

  
  probability = 1 - probability;

  a = (minute - 1) * 6;

  // Top left
  drawRainVertex(a, 1);

  // Top right
  drawRainVertex(a + 6, 1);

  // Bottom left
  drawRainVertex(a + 6, intensityDisplayed);

  // Bottom right
  drawRainVertex(a, intensityDisplayed);

  endShape();
}

void drawRainVertex(a, b) {
  float angle = radians(a) - HALF_PI;
  float x = cx + cos(angle) * (secondsRadius * b);
  float y = cy + sin(angle) * (secondsRadius * b);
  vertex(x, y);
}

void drawMinutePredictions() {
  for(var i = 0; i < 60; i++){
    var minuteForecast = forecast.minutely.data[i];

    var date = new Date(minuteForecast.time * 1000);

    var minute = date.getMinutes() + 1;
    var intensity = minuteForecast.precipIntensity;
    var probability = minuteForecast.precipProbability;
    
    drawRainPrediction(minute, intensity, probability);
  }
}

void draw() {
  background(255);

  if(forecast){
    drawMinutePredictions();
  }

  drawHands();
  drawMinuteTicks();
}