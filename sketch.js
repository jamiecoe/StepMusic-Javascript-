// Visualiser variables
var circleX,
    circleY,
    c,
    cX,
    cY,
    radius,
    angle,
    numPoints,
    cVectorSize,
    hue,
    saturation,
    brightness,
    opacicty,
    hueIncr;

// Musical Notation variables
var circleNoteIndex,
    scaleStep,
    freqIndexl;
var currentScale = [];

var clickCounter = 0;

var scaleLabelArray;

// Oscillator & effects setup
var osc = new p5.SinOsc();
var envelope = new p5.Env();
var delay = new p5.Delay();

var scaleFrequency;

function preload() {
  scaleFrequency = loadJSON("scaleFrequency.json");
}

function setup() {


    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    // Put canvas behind normal DOM elements
    canvas.style('z-index', '-1')

    colorMode(HSB, 255);

    // Sound stuff
    envelope.setADSR(0.008, 0.2, 0.2, 0.5);
    envelope.setRange(0.5, 0);

    osc.amp(envelope);
    osc.start();
    delay.process(osc, .999, .5);

    circleNoteIndex = 2;
    scaleStep = 0;

    scaleFrequency = scaleFrequency.scaleFrequencyData;

    for (var i = 0; i < 5; i++) {
        currentScale[i] = scaleFrequency[0][i];
    }

    // Color setup
    hue = 0;
    hueIncr = 255 / 12;
    saturation = 150;
    brightness = 255;
    opacity = 30;

    // Circles setup
    cX = [];
    cY = [];
    c = [];
    radius = (width / 3) * 0.5;
    numPoints = 13;
    cVectorSize = 400; // Controls size of the fade-out tail of the coloured circle
    angle = 360 / numPoints;
    circleX = radius * sin(radians(angle * circleNoteIndex));
    circleY = radius * cos(radians(angle * circleNoteIndex));
    // Creates position and colour vectors for coloured circle
    for (var i = 0, j = cVectorSize; i < j; i++) {
        cX.push(circleX);
        cY.push(circleY);
        c.push(color(hue, saturation, brightness, opacity));
    }


}

function draw() {

    background(0);
    noStroke();

    translate(width / 2, height / 2);

    // calculate the distance between most recently triggered musical note and colour circle
    var xDist = radius * sin(radians(angle * circleNoteIndex)) - circleX;
    var yDist = radius * cos(radians(angle * circleNoteIndex)) - circleY;

    // creates a increment variable of 1/10th the distance
    var xIncr = xDist / 10;
    var yIncr = yDist / 10;

    // updates the position of the coloured circle so it travels to most recently triggered note
    circleX += xIncr;
    circleY += yIncr;

    // Updates vector postions and colour to the value of the one before it
    for (var i = 0, j = cX.length - 1; i < j; i++) {
        cX[i] = cX[i + 1];
        cY[i] = cY[i + 1];
        c[i] = c[i + 1];
    }

    // Sets final vector to the most recent position / colour of circle
    cX[cX.length - 1] = circleX;
    cY[cY.length - 1] = circleY;
    c[c.length - 1] = color(hue, saturation, brightness, opacity);

    // Draws coloured circle vectors
    for (var i = 0, j = cX.length - 1; i < j; i++) {
        // sets the colour of the circle depending on the current scale and draws it
        fill(c[i]);
        // Circle vectors get gradually smaller, creating effected of them fading out
        var circleSize = map(i, 0, cX.length - 1, 2, radius * 0.2);
        ellipse(cX[i], cY[i], circleSize);
    }

    fill(255); //set musical note points to colour white

    // draws musical note points in a circle
    for (var i = 0, j = numPoints; i < j; i++) {
        // Extra bit added after video - makes most recently note played turn red
        if (radius * sin(radians(angle * i)) === radius * sin(radians(angle * circleNoteIndex)) && circleX !== radius * sin(radians(angle * circleNoteIndex)) && mouseIsPressed) {
            fill(0, 255, 255);
        } else
            fill(255);

        ellipse(radius * sin(radians(angle * i)), radius * cos(radians(angle * i)), radius / 12);
    }

}

function mousePressed() {

    freqIndex = floor(random(5)); // Assigns a random note from within current scale

    // work out which note has been played
    switch (currentScale[freqIndex]) {
      case 233.082:
        circleNoteIndex = 0;
        break;
      case 246.942:
        circleNoteIndex = 1;
        break;
      case 261.626:
        circleNoteIndex = 2;
        break;
      case 277.183:
        circleNoteIndex = 3;
        break;
      case 293.665:
        circleNoteIndex = 4;
        break;
      case 311.127:
        circleNoteIndex = 5;
        break;
      case 329.628:
        circleNoteIndex = 6;
        break;
      case 349.228:
        circleNoteIndex = 7;
        break;
      case 369.994:
        circleNoteIndex = 8;
        break;
      case 391.995:
        circleNoteIndex = 9;
        break;
      case 415.305:
        circleNoteIndex = 10;
        break;
      case 440.00:
        circleNoteIndex = 11;
        break;
      case 466.164:
        circleNoteIndex = 12;
        break;
    }

    if (clickCounter > 0 && clickCounter % 10 === 0) {
        scaleStep++;
        if (scaleStep > 11)
            scaleStep = 0;
        for (var i = 0; i < 5; i++) {
            currentScale[i] = scaleFrequency[scaleStep][i];
        }
        hue += hueIncr;
        if (hue >= 255)
            hue = 0;

    }

    osc.freq(currentScale[freqIndex]);
    envelope.play();
    clickCounter++;
}

// Dynamically update canvas based on window size
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    radius = (width / 3) * 0.5;
}
