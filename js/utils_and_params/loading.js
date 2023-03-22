const canvasWidth = 400
const canvasHeight = 100

const pixelWidth = 10
const pixelHeight = 10

const nW = canvasWidth/pixelWidth
const nH = canvasHeight/pixelHeight

function setup() {
    const cnv = createCanvas(canvasWidth, canvasHeight);
    cnv.parent('p5loader');
    start()

    //noLoop();
  }
  

function rC() {
    return Math.floor(Math.random() * 256)
}

function draw() {
    //clear();
    //background(220);

    updateRandom();
  }

function start() {
    for (let i = 0; i < nW; i++) {
        for (let j = 0; j < nH; j++) {
            fill(rC(),rC(),rC());
            rect(i*pixelWidth, j*pixelHeight, pixelHeight);
        }
    }
}

function updateRandom() {
    var i = Math.round(Math.random() * nW)
    var j = Math.round(Math.random() * nH)
    fill(rC(),rC(),rC());
    rect(i*pixelWidth, j*pixelHeight, pixelWidth, pixelHeight);
}