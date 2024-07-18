let faceApi;
let detections = [];
let particles = [];

let video;
let canvas;

function setup() {
  canvas = createCanvas(480, 360);
  canvas.id("canvas");

  video = createCapture(VIDEO);
  video.id("video");
  video.size(width, height);
  video.hide();

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5,
  };

  // Initialize the model
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function faceReady() {
  faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;
  faceapi.detect(gotFaces);
}

function draw() {
  let happiness = 0;
  if (detections.length > 0) {
    happiness = detections[0].expressions.happy;
    updateExpressions(detections[0].expressions);
  }

  background(255);
  image(video, 0, 0, width, height);

  if (happiness > 0.9) {
    emitParticles();
  }

  updateParticles();
  drawParticles();
}

function updateExpressions(expressions) {
  document.getElementById("neutral").innerText =
    "neutral: " + nf(expressions.neutral * 100, 2, 2) + "%";
  document.getElementById("happiness").innerText =
    "happiness: " + nf(expressions.happy * 100, 2, 2) + "%";
  document.getElementById("anger").innerText =
    "anger: " + nf(expressions.angry * 100, 2, 2) + "%";
  document.getElementById("sad").innerText =
    "sad: " + nf(expressions.sad * 100, 2, 2) + "%";
  document.getElementById("disgusted").innerText =
    "disgusted: " + nf(expressions.disgusted * 100, 2, 2) + "%";
  document.getElementById("surprised").innerText =
    "surprised: " + nf(expressions.surprised * 100, 2, 2) + "%";
  document.getElementById("fear").innerText =
    "fear: " + nf(expressions.fearful * 100, 2, 2) + "%";
}

function emitParticles() {
  for (let i = 0; i < 5; i++) {
    let x = random(width);
    let y = random(height);
    particles.push(new Particle(x, y));
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  for (let particle of particles) {
    particle.show();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.alpha = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  finished() {
    return this.alpha < 0;
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, 10);
  }
}
