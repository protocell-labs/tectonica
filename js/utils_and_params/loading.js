//////LOADER ANIMATION//////

function setup() {
    const cnv = createCanvas(400, 100);
    cnv.parent('p5loader');
    frameRate(10);
  }
  
function draw() {

  // we define parameters here to get better minification

  const loader_element_dim = {
    "voxel": [10, 10],  // ['square 1x1', 5, 5, 110, 130, 30]
    "pin": [5, 25],   // ['square 1x1', 5, 25, 110, 31, 30]
    "stick": [5, 50], // ['square 1x1', 5, 50, 110, 16, 30]
    "needle": [2, 50], // ['square 1x1', 5, 100, 110, 9, 30]
    "wire": [2, 100] // ['square 1x1', 2, 100, 180, 9, 30]
  }
  
  const x_step = loader_element_dim[dimension_type][0];
  const y_step = loader_element_dim[dimension_type][1];
  const offset_x = x_step / 2;
  const offset_y = y_step / 2;
  const nr_in_width = Math.floor(400 / x_step);
  const nr_in_height = Math.floor(100 / y_step);

  // drawing starts here

  background(chosen_palette[0]); //chosen_palette[0]
  rectMode(CENTER);
  
  strokeWeight(1);
  noStroke();

  for (var i = 0; i < nr_in_width; i++) {
    for (var j = 0; j < nr_in_height; j++) {
      
      // horizontal gradient
      var ascending_param = i; //i
      var descending_param = nr_in_width - i; //nr_in_width - i
      var palette_probs = [ascending_param, descending_param, 5, 5, 5, 5, 5, 5, 5, 5];
      
      // constructing a dynamic color palette with varying number of colors to which probabilities are assigned
      // palette probabilities are shifted with depth of layers
      var allel_palette_dynamic = [];
      for (var n = 0; n < chosen_palette.length; n++) {
        allel_palette_dynamic.push([chosen_palette[n], palette_probs[n]]);
      }

      var element_color = gene_weighted_choice(allel_palette_dynamic);
      fill(element_color);
      rect(offset_x + i * x_step, offset_y + j * y_step, x_step, y_step); 
    }
  }
}

function keyPressed() {
  // this will download the first n seconds of the animation
  if (key === 's') {
    saveGif(`tectonica_${palette_name}_loader_${parseInt(Math.random()*10000000)}`, 2);
  }
}