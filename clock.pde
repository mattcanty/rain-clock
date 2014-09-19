// Angles for sin() and cos() start at 3 o'clock;
// subtract HALF_PI to make them start at the top

int cx, cy;
float secondsRadius;
float minutesRadius;
float hoursRadius;
float clockDiameter;

void setup() {
  size(window.innerWidth, window.innerHeight);
  stroke(255);
  
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
  strokeWeight(2);
  beginShape(POINTS);
  for (int a = 0; a < 360; a+=6) {
    float angle = radians(a);
    float x = cx + cos(angle) * secondsRadius;
    float y = cy + sin(angle) * secondsRadius;
    vertex(x, y);
  }
  endShape();
}

void drawRainPrediction(minute, probabilityOfRain) {
  stroke(255 - probabilityOfRain);
  fill(255 - probabilityOfRain);
  
  beginShape();
  
  a = (minute - 1) * 6;
  
  // Top left
  float angle = radians(a) - HALF_PI;
  float x = cx + cos(angle) * secondsRadius;
  float y = cy + sin(angle) * secondsRadius;
  vertex(x, y);
  
  // Top right
  float angle = radians(a + 6) - HALF_PI;
  float x = cx + cos(angle) * secondsRadius;
  float y = cy + sin(angle) * secondsRadius;
  vertex(x, y);
  
  // Bottom left
  float angle = radians(a + 6) - HALF_PI;
  float x = cx + cos(angle) * secondsRadius / 2;
  float y = cy + sin(angle) * secondsRadius / 2;
  vertex(x, y);
  
  // Bottom right
  float angle = radians(a) - HALF_PI;
  float x = cx + cos(angle) * secondsRadius / 2;
  float y = cy + sin(angle) * secondsRadius / 2;
  vertex(x, y);
  
  endShape();
}

void drawMinutePredictions() {
  for(var i = 0; i < 60; i++){
    var forecast = weather.minutely.data[i];
    
    drawRainPrediction(i+1, forecast.precipProbability);
  }
}

void draw() {
  background(255);
  
  if(weather){
    drawMinutePredictions();
  }
  drawHands();
  drawMinuteTicks();
}