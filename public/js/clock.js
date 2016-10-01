background(255);

int MINUTE_LENGTH = 6;
int HOUR_LENGTH = 30;
int MAX_INTENSITY = 0.9;

int cx, cy;
float secondsRadius;
float minutesRadius;
float hoursRadius;
float clockDiameter;

void setup() {
  setSize();
  frameRate(5);
  stroke(255);
}

void setSize(){
  var canvasParent = document.getElementsByTagName('canvas')[0].parentNode;

  var squareSize = min(canvasParent.offsetWidth, canvasParent.offsetHeight);

  size(squareSize, squareSize);

  int radius = squareSize * 0.65;
  secondsRadius = radius * 0.72;
  minutesRadius = radius * 0.60;
  hoursRadius = radius * 0.50;
  clockDiameter = radius * 2;

  cx = width / 2;
  cy = height / 2;
}

void drawHands(){
  stroke(0);

  float s = map(second(), 0, 60, 0, TWO_PI) - HALF_PI;
  float m = map(minute() + norm(second(), 0, 60), 0, 60, 0, TWO_PI) - HALF_PI;
  float h = map(hour() + norm(minute(), 0, 60), 0, 24, 0, TWO_PI * 2) - HALF_PI;

  drawHand(s, secondsRadius, 1);
  drawHand(m, minutesRadius, 2);
  drawHand(h, hoursRadius, 4);
}

void drawHand(time, radius, weight) {
  strokeWeight(weight);
  line(cx, cy, cx + cos(time) * radius, cy + sin(time) * radius);
}

void drawMinuteTicks(){
  for (int a = 0; a < 360; a+=6) {
    beginShape(POINTS);
    if(a % 90 == 0){
      strokeWeight(7);
    } else if(a % 30 == 0) {
      strokeWeight(4);
    } else {
      strokeWeight(2);
    }

    float angle = radians(a);
    float x = cx + cos(angle) * secondsRadius;
    float y = cy + sin(angle) * secondsRadius;
    vertex(x, y);
    endShape();
  }
}

void setRainFill(probability) {
  var filterRedGreen = 255 - (probability * 255);
  fill(filterRedGreen, filterRedGreen, 255);
}

void drawRainPrediction(time, duration, intensity, probability) {

  setRainFill(probability);
  stroke(255);

  beginShape();

  intensity = min(intensity * 15, MAX_INTENSITY);

  var start = (time - 1) * duration;

  drawRainSegment(start, duration, intensity);

  endShape();
}

int getMinutePastHour(epochTime) {
  var date = new Date(epochTime * 1000);

  return date.getMinutes();
}

void drawMinutelyForecast(minutelyData) {
  for(var i = 0; i < 60; i++){
    var minuteForecast = minutelyData[i];

    var minute = getMinutePastHour(minuteForecast.time);

    drawRainPrediction(minute, MINUTE_LENGTH, minuteForecast.precipIntensity, minuteForecast.precipProbability);
  }
}

void drawRainSegment(start, duration, depth) {
  drawRainVertex(start, 1);
  drawRainVertex(start + duration, 1);
  drawRainVertex(start + duration, 1 - depth);
  drawRainVertex(start, 1 - depth);
}

void drawRainVertex(a, b) {
  float angle = radians(a) - HALF_PI;
  float x = cx + cos(angle) * (secondsRadius * b);
  float y = cy + sin(angle) * (secondsRadius * b);
  vertex(x, y);
}

void draw() {
  background(255);

  if(!localStorage.forecast) return;

  var minutelyData = JSON.parse(localStorage.forecast).data

  drawMinutelyForecast(minutelyData);
  
  drawHands();
  drawMinuteTicks();
}

window.onresize = function(event) {
  setSize();
};