/*


________/\\\\\\\\\_______/\\\\\_______/\\\______________/\\\______________/\\\\\\\\\\\\\\\________/\\\\\\\\\__/\\\\\\\\\\\\\\\__/\\\\\\\\\\\_______/\\\\\_______/\\\\\_____/\\\_____________/\\\\\\\\\\\\\\\_
 _____/\\\////////______/\\\///\\\____\/\\\_____________\/\\\_____________\/\\\///////////______/\\\////////__\///////\\\/////__\/////\\\///______/\\\///\\\____\/\\\\\\___\/\\\____________\/\\\///////////__
  ___/\\\/_____________/\\\/__\///\\\__\/\\\_____________\/\\\_____________\/\\\_______________/\\\/_________________\/\\\___________\/\\\_______/\\\/__\///\\\__\/\\\/\\\__\/\\\____________\/\\\_____________
   __/\\\______________/\\\______\//\\\_\/\\\_____________\/\\\_____________\/\\\\\\\\\\\______/\\\___________________\/\\\___________\/\\\______/\\\______\//\\\_\/\\\//\\\_\/\\\____________\/\\\\\\\\\\\\_____
    _\/\\\_____________\/\\\_______\/\\\_\/\\\_____________\/\\\_____________\/\\\///////______\/\\\___________________\/\\\___________\/\\\_____\/\\\_______\/\\\_\/\\\\//\\\\/\\\____________\////////////\\\___
     _\//\\\____________\//\\\______/\\\__\/\\\_____________\/\\\_____________\/\\\_____________\//\\\__________________\/\\\___________\/\\\_____\//\\\______/\\\__\/\\\_\//\\\/\\\_______________________\//\\\__
      __\///\\\___________\///\\\__/\\\____\/\\\_____________\/\\\_____________\/\\\______________\///\\\________________\/\\\___________\/\\\______\///\\\__/\\\____\/\\\__\//\\\\\\____________/\\\________\/\\\__
       ____\////\\\\\\\\\____\///\\\\\/_____\/\\\\\\\\\\\\\\\_\/\\\\\\\\\\\\\\\_\/\\\\\\\\\\\\\\\____\////\\\\\\\\\_______\/\\\________/\\\\\\\\\\\____\///\\\\\/_____\/\\\___\//\\\\\___________\//\\\\\\\\\\\\\/___
        _______\/////////_______\/////_______\///////////////__\///////////////__\///////////////________\/////////________\///________\///////////_______\/////_______\///_____\/////_____________\/////////////_____


          C O L L E C T I O N F I V E  |  { p r o t o c e l l : l a b s }  |  2 0 2 2
*/



var dense_matter_object = {}; // grid coordinates are the key, dense matter data is the value
var elements_per_palette_object = {}; // color is the key, nr of elements is the value
var imesh_index_tracker = {}; // color is the key, index nr is the value
var imeshes_object = {}; // color is the key, imesh is the value

var c_type = 'square beam';
var c_xy_scale = 5; //5
var c_length = 50; //50
var grid_nr_x = 110; //110
var grid_nr_y = 15;
var grid_nr_z = 30;
var y_gap = 1; //5
var grid_offset_x = -(grid_nr_x * c_xy_scale) / 2.0;
var grid_offset_y = -(grid_nr_y * (c_length + y_gap)) / 2.0;
var grid_offset_z = -(grid_nr_z * c_xy_scale) / 2.0;
var total_elements_existing = 0; // will be calculated later
var total_possible_elements = grid_nr_x * grid_nr_y * grid_nr_z;




//var palette_name = "Marble"; // OVERRIDE - choose palette name
var palette_name = gene_pick_key(palettes_v3); // choose palette name at random




//////LATTICE GENERATION//////

var gDatas = [];
var lattice_params, gData;
var composition_params;

// COMPOSITION - generate parameters for the composition of the piece
composition_params = generate_composition_params(); // all input parameters are optional, they will be chosen at random if not passed into the function

var { aspect_ratio, frame_type, center_piece_type, center_piece_factor, explosion_type, light_source_type, explosion_center_a, explosion_center_b, celestial_object_types, feature_dimension, feature_frame, feature_primitive, feature_state, feature_celestial } = composition_params; // unpacking parameters we need in main.js and turning them into globals

aspect_ratio = '0.75'; ////OVERRIDE//// 0.75 - portrait
explosion_type = 0; ////OVERRIDE////

celestial_object_types = gene_weighted_choice(allel_celestials_reduced);

var global_rot_x = -Math.PI/16; // -Math.PI/16, gene_range(-Math.PI/8, Math.PI/8); // global rotation of the model around the X axis
var global_rot_y = Math.PI/16; // Math.PI/16, gene_range(-Math.PI/8, Math.PI/8); // global rotation of the model around the Y axis
//var global_rot_x = gene_range(-Math.PI/8, Math.PI/8); // global rotation of the model around the X axis
//var global_rot_y = gene_range(-Math.PI/8, Math.PI/8); // global rotation of the model around the Y axis


// MODULE GRID

var grid_module_nr_x = 3;
var grid_module_nr_y = 3;
var grid_module_nr_z = 3;

var grid_module_size = 110;
var module_center_pos;
var module_center_offset = new THREE.Vector3(-0.5 * grid_module_size * grid_module_nr_x, -0.5 * grid_module_size * grid_module_nr_y, 0.5 * grid_module_size * grid_module_nr_z);
//var module_center_offset = new THREE.Vector3(-0.5 * 110 * 3, -0.5 * 110 * 3, 0.5 * 110 * 3);

for (var nx = 0; nx < grid_module_nr_x; nx++) {
  for (var ny = 0; ny < grid_module_nr_y; ny++) {
    for (var nz = 0; nz < grid_module_nr_z; nz++) {

      module_center_pos = new THREE.Vector3(grid_module_size * nx, grid_module_size * ny, grid_module_size * nz);
      module_center_pos.add(module_center_offset); // offset the whole grid so it's in the center of the scene
      module_params = generate_module_params(position = module_center_pos); // all input parameters are optional, they will be chosen at random if not passed into the function
      gData = generate_lattice(module_params);
      gDatas.push(gData);

    }
  }
}




// STARS - random
var random_starfield_bounds = 1000; // O B S C V R V M - 1500
var nr_of_random_stars = 15000; // O B S C V R V M - 20000

// COLOUR CHANGE
var chosen_palette;
const flickerInterval = 100; //(ms)
const flickerDuration = 2000; //(ms)
const cycleDuration = 5000; //(ms)

// BACKGROUND ROTATION
const cycleBackground = 1000000; //Modify for spin cycle  rv: 1000000
const cycleBackgroundUpdate = 100; //Modify for spin refresh rv: 100
const rotThetaDelta = Math.PI*2*cycleBackgroundUpdate/cycleBackground;
//const cameraVector = this.camera.getWorldDirection();
const rotVectorBackground = new THREE.Vector3(0,0,1);
const rotMatrixStaticIncrement = new THREE.Matrix4();
rotMatrixStaticIncrement.makeRotationAxis(rotVectorBackground, rotThetaDelta)

//var { stage, transformation_index, steps } = lattice_params; // WORKAROUND FOR NOW - all the params we need in main.js to make it run, but in the end we will have multiple lattices with multiple params
var stage = 6; // workaround, not actually needed
var steps = get_steps(stage); // workaround, not actually needed



//////FXHASH FEATURES//////

window.$fxhashFeatures = {
  'Dimension': feature_dimension,
  'Frame': feature_frame,
  'Primitive': feature_primitive,
  'State': feature_state,
  'Celestial': feature_celestial
};



/*
//////CONSOLE LOG//////

var obscvrvm_logo = "%c                                                                         \n"
                    + "%c     O B S C V R V M  |  { p r o t o c e l l : l a b s }  |  2 0 2 2     \n"
                    + "%c                                                                         \n";

console.log( obscvrvm_logo,
            'color: white; background: #000000; font-weight: bold; font-family: "Courier New", monospace;',
            'color: white; background: #000000; font-weight: bold; font-family: "Courier New", monospace;',
            'color: white; background: #000000; font-weight: bold; font-family: "Courier New", monospace;');


console.log('%cFelix, qui potuit rerum cognoscere causas.\n', 'font-style: italic; font-family: "Courier New", monospace;');

console.log('%cTOKEN FEATURES', 'color: white; background: #000000;', '\n',
            'Dimension -> ' + feature_dimension, '\n',
            'State     -> ' + feature_state, '\n',
            'Celestial -> ' + feature_celestial, '\n');

console.log('%cCONTROLS', 'color: white; background: #000000;', '\n',
            'a   : jump light angle', '\n',
            'f   : cycle light framerate', '\n',
            't   : cycle light tick', '\n',
            'i   : info', '\n',
            'b   : white / black background', '\n',
            'g   : start / stop gif capture', '\n',
            '1-5 : image capture 1-5x resolution', '\n');

console.log('%cURL STRINGS', 'color: white; background: #000000;', '\n',
            'Shadow map size in pix (default is 4096 pix, 2048 pix on iOS devices)', '\n',
            '?shadow=size', '\n');

console.log('%cPIXELS', 'color: white; background: #000000;', '\n',
            "Change pixel density by changing your browser's zoom level (50% zoom doubles the pixels etc.)", '\n');


//////END CONSOLE LOG//////
*/

var pre_calc = 0.000;
var viz_update = 0.00000;
var composer_pass = 0.00000;

///VIEWPORT SETUP///

var viewport = document.getElementById("viewport");
var margin_left = 0;
var margin_top = 0;
var viewportHeight;
var viewportWidth;


var light_framerate_change;
var base_light_angle_step;
var light_angle;
var background_toggle = false;

var controller;

var renderer = new THREE.WebGLRenderer({antialias: false, alpha: true, preserveDrawingBuffer: true}); //antialias: true
const composer = new THREE.EffectComposer(renderer);
let snap = false;
let quality = 0;
var capturer = null;
let recording = false;

function View(viewArea) {
  if (window.innerWidth/aspect_ratio>window.innerHeight) { //If target viewport height is larger then inner height

    viewportHeight = window.innerHeight; //Force Height to be inner Height
    viewportWidth = aspect_ratio*window.innerHeight;  //Scale width proportionally

    margin_top = 0;
    margin_left = (window.innerWidth - viewportWidth)/2;
  } else {  //If target viewport width is larger then inner width

    viewportHeight = window.innerWidth/aspect_ratio; //Scale viewport height proportionally
    viewportWidth = window.innerWidth; //Force Width  to be inner Height

    margin_top = (window.innerHeight - viewportHeight)/2;
    margin_left = 0;
  }

  viewport.style.marginTop=margin_top+'px';
  viewport.style.marginLeft=margin_left+'px';


  ///SCALING
  cam_factor_mod = cam_factor * Math.min(viewportWidth/1000, viewportHeight/1000);

  renderer.setSize( viewportWidth, viewportHeight );
  renderer.shadowMap.enabled = true;
  renderer.domElement.id = 'obscvrvmcanvas';
  //renderer.setClearColor(0x000000, 0); // we have to set this to get a transparent background

  viewport.appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  //var camera = new THREE.PerspectiveCamera( 75, viewportWidth / viewportHeight, 0.1, 10000 );
  //camera.position.set(0,0, 100);



  //cam_factor controls the "zoom" when using orthographic camera
  var camera = new THREE.OrthographicCamera( -viewportWidth/cam_factor_mod, viewportWidth/cam_factor_mod, viewportHeight/cam_factor_mod, -viewportHeight/cam_factor_mod, 0, 5000 );

  //controls
  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableZoom = true;
  //controls.smoothZoom = true;
  //controls.zoomDampingFactor = 0.2;
  //controls.smoothZoomSpeed = 5.0;


  camera.position.set(0, 0, 2000);
  controls.update();
  this.controls = controls;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //composer = new THREE.EffectComposer( renderer );
  composer.setSize(window.innerWidth, window.innerHeight)

  // change scene background to solid color
  scene.background = new THREE.Color('#080808'); //0xffffff, 0x000000

  const color = 0xffffff; //0xffffff
  const intensity = 0.9;
  const amb_intensity = 0.1; //0-1, zero works great for shadows with strong contrast

  // ADD LIGHTING
  var light = new THREE.DirectionalLight(0xffffff, intensity); //new THREE.PointLight(0xffffff);
  //scene.add( light.target ); //Needs to be added to change target
  //light.target = //ASSIGN NEW TARGET



  light.position.set(2000, 2000, 750); //0, 0, 2000
  light.castShadow = true;
  light.shadow.camera.near = 1000; //500
  light.shadow.camera.far = 3500; //3000
  light.shadow.bias = - 0.000222;

  const d = 1000;
  light.shadow.camera.left = - d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = - d

  //Create a helper for the shadow camera (optional)
  //const helper = new THREE.CameraHelper( light.shadow.camera );
  //scene.add( helper );

  var shadow = 8192; //2048; //Default
  var paramsAssigned = false;
  // URL PARAMS
  // Usage: add this to the url ?shadow=4096
  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const shadowString = urlParams.get('shadow');

  if (shadowString!=null) {
      shadow = Math.abs(parseInt(shadowString));
      paramsAssigned = true;
    }
  } catch (error) {
    //console.log("shadow variable must be a positive integer")
  }
  if (Number.isInteger(shadow) & paramsAssigned) { //If values are overiden by urlParams  for a minimum overide add: & shadow > 2048
    console.log("Using custom url parmater for shadow map size: " + shadow.toString())
    light.shadow.mapSize.width = shadow;
    light.shadow.mapSize.height = shadow;
  } else if (Number.isInteger(shadow) & iOS()) {
    //console.log("iOS")
    light.shadow.mapSize.width = Math.min(shadow, 2048); //increase for better quality of shadow, standard is 2048
    light.shadow.mapSize.height = Math.min(shadow, 2048);
  } else if ((Number.isInteger(shadow) & !iOS())){
    //console.log("!iOS")
    light.shadow.mapSize.width = Math.max(shadow, 4096);
    light.shadow.mapSize.height = Math.max(shadow, 4096);
  } else {
    //console.log("Using default shadow map.")
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
  }

  scene.add(light);

  const amblight = new THREE.AmbientLight(color, amb_intensity);
  scene.add(amblight);

  this.winHeight = viewportHeight;
  this.winWidth = viewportWidth;
  this.scale = 1;
  this.scene = scene;
  this.camera = camera;
  this.composer = composer;
  this.light = light;
  this.renderer = renderer;
  this.wire = null;
  this.lines = null;
  this.meshline_data = [];
  this.meshline_mesh = [];

  this.curves = [];

  // Renders the Scene
  const renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.composer.addPass(renderPass);

  // SAO - Scalable Ambient Occlusion
  saoPass = new THREE.SAOPass(this.scene, this.camera, false, true);
  this.composer.addPass(saoPass);

  // FXAA antialiasing
  effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
  effectFXAA.uniforms['resolution'].value.x = 1 / (window.innerWidth * window.devicePixelRatio);
  effectFXAA.uniforms['resolution'].value.y = 1 / (window.innerHeight * window.devicePixelRatio);
  this.composer.addPass(effectFXAA);

  //Bloom
  const bloomPass = new THREE.UnrealBloomPass();
  bloomPass.strength = 0.30;
  bloomPass.radius = 0.0;
  bloomPass.threshold = 0.0;
  this.composer.addPass(bloomPass)
}

View.prototype.addDenseMatter = function  () {

  chosen_palette = palettes_v3[palette_name].slice(0); // make a copy of the chosen color palette
  shuffleArray(chosen_palette); // randomly shuffle the colors in the palette - this way we can keep the order of probabilities the same in the loop below

  // use elements_per_palette objects to count nr of elements for each color - we need to know this nr when we create instanced mesh
  for (i in chosen_palette) {
    elements_per_palette_object[chosen_palette[i]] = 0; // for each color we set nr of elements to zero
    imesh_index_tracker[chosen_palette[i]] = 0; // for each color we set the starting index to zero
  }


  var color_gradient_default = gene_weighted_choice(allel_color_gradient); // "solid", "solid sprinkled", "uniform", "vertical grading", "horizontal grading", "vertical grading clean", "horizontal grading clean", "width stack", "height stack", "depth stack"
  //var color_gradient_default = "uniform"; //"vertical grading layered", "depth stack"

  var quadrants = gene() < 0.35 ? true : false; // trigger for color grading according to QUADRANTS
  //var quadrant_div_x = gene_range(1.5, 4.0); // 1.5 - 4.0, controls the vertical division line with QUADRANTS
  //var quadrant_div_y = gene_range(1.5, 4.0); // 1.5 - 4.0, controls the horizontal division line with QUADRANTS
  var quadrant_div_x = gene_weighted_choice(allel_quadrant_div); // 1.5 - 4.0, controls the vertical division line with QUADRANTS
  var quadrant_div_y = gene_weighted_choice(allel_quadrant_div); // 1.5 - 4.0, controls the horizontal division line with QUADRANTS
  // determines the color grading for each segment of the QUADRANT
  var color_gradient_quadrants = [gene_weighted_choice(allel_color_gradient_quadrants),
                                  gene_weighted_choice(allel_color_gradient_quadrants),
                                  gene_weighted_choice(allel_color_gradient_quadrants),
                                  gene_weighted_choice(allel_color_gradient_quadrants)];

  var noise_cull_rule = gene_weighted_choice(allel_noise_cull_rule); // rule for culling elements using noise
  //var noise_cull_rule = "clean";

  // additional color features appearing
  var color_features_vert = gene_weighted_choice(allel_color_features_vert);
  var color_features_horiz = gene_weighted_choice(allel_color_features_horiz);
  var color_features = [color_features_vert, color_features_horiz];
  //color_features = ["horizontal stripe solid", "vertical stripe blocks"];

  var stripe_param_a = Math.floor(gene_range(2, 20)); // affects width, period and position of extra stripes
  var stripe_param_b = Math.floor(gene_range(2, 20)); // affects width, period and position of extra stripes
  var stripe_param_c = Math.floor(gene_range(2, 20)); // affects width, period and position of extra stripes
  var stripe_width = Math.floor(gene_range(2, 20)); // stripe width
  var stripe_spacing = Math.floor(gene_range(5, 15)); // stripe spacing
  var stripe_shift = Math.floor(gene_range(1, stripe_spacing)); // stripe shift, needs to be smaller than stripe spacing
  var block_spacing = Math.floor(gene_range(50, 150)); // block spacing in horizontal stripes, (10, 25)
  var block_width = Math.floor(block_spacing / 2); // block width in horizontal stripes
  var shift_sign_horiz = gene() < 0.5 ? 1 : -1; // chance for horizontal stripes to be shifted in or out of the grid
  var shift_sign_vert = -shift_sign_horiz; // vertical stripes are always the opposite from horizontal ones


  var noise_feature = gene_weighted_choice(allel_noise_features); // "cracks", "bands", "sheets", "unbiased"
  //var noise_feature = "unbiased";

  var noise_height_f = c_length/c_xy_scale; // noise height factor

  var noise_scale_x, noise_scale_y, noise_scale_z;
  if (noise_feature == "cracks") {
    noise_scale_x = gene_weighted_choice(allel_noise_scale_x);
    noise_scale_y = 0.01;
    noise_scale_z = 0.025; // 0.01

  } else if (noise_feature == "bands") {
    noise_scale_x = 0.01;
    noise_scale_y = gene_weighted_choice(allel_noise_scale_y);
    noise_scale_z = 0.05;

  } else if (noise_feature == "sheets") {
    noise_scale_x = 0.01;
    noise_scale_y = 0.01;
    noise_scale_z = gene_weighted_choice(allel_noise_scale_z);

  } else { // in any other case, noise_feature == "unbiased"
    noise_scale_x = 0.01;
    noise_scale_y = 0.01;
    noise_scale_z = noise_cull_rule == "clean" ? 0.05 : 0.01;
  }


  //var noise_scale_x = 0.01; // 0.01, increase this factor to 0.2 to get narrow cracks
  //var noise_scale_x = gene_weighted_choice(allel_noise_scale_x);
  //var noise_scale_y = 0.5; // 0.01
  //var noise_scale_y = 0.01; // 0.01
  //var noise_scale_z = 0.01; // 0.01, increase this factor to 0.5 to get thinner layers in depth, 0.05 avoids too low density when using noise_cull_rule = "clean"
  //var noise_scale_z = noise_cull_rule == "clean" ? 0.05 : 0.01; // var noise_scale_z = noise_cull_rule == "clean" ? 0.05 : 0.01;



  // random shift of noise to get a different pattern every time
  var noise_shift_x = gene_range(-100, 100);
  var noise_shift_y = gene_range(-100, 100);
  var noise_shift_z = gene_range(-100, 100);

  console.log("%cCOLOR", "color: white; background: #000000;");
  console.log("palette ->", palette_name, "\n"); // chosen_palette is where the colors are stores

  console.log("%c    %c    %c    %c    %c    %c    %c    %c    %c    %c    %c    %c    %c    %c    %c    ",
              `color: white; background: ${chosen_palette[0]};`,
              `color: white; background: ${chosen_palette[1]};`,
              `color: white; background: ${chosen_palette[2]};`,
              `color: white; background: ${chosen_palette[3]};`,
              `color: white; background: ${chosen_palette[4]};`,
              `color: white; background: ${chosen_palette[5]};`,
              `color: white; background: ${chosen_palette[6]};`,
              `color: white; background: ${chosen_palette[7]};`,
              `color: white; background: ${chosen_palette[8]};`,
              `color: white; background: ${chosen_palette[9]};`,
              `color: white; background: ${chosen_palette[10]};`,
              `color: white; background: ${chosen_palette[11]};`,
              `color: white; background: ${chosen_palette[12]};`,
              `color: white; background: ${chosen_palette[13]};`,
              `color: white; background: ${chosen_palette[14]};`); // overprinting in case there are up to 15 colors (undefined is returned in case the color doesn't exist)

  console.log("color gradient default ->", color_gradient_default);
  //console.log("number of palettes -> ", Object.keys(palettes_v3).length); // show the total number of palettes
  console.log("quadrants ->", quadrants);
  console.log("color grading quadrants ->", color_gradient_quadrants);
  console.log("quadrant divs ->", `(${quadrant_div_x}, ${quadrant_div_y})`);

  console.log("%cNOISE CULL", "color: white; background: #000000;");
  console.log("noise cull rule ->", noise_cull_rule);
  console.log("noise feature ->", noise_feature);
  console.log("noise scale x ->", noise_scale_x);
  console.log("noise scale y ->", noise_scale_y);
  console.log("noise scale z ->", noise_scale_z);

  console.log("%cSTRIPES", "color: white; background: #000000;");
  console.log("color features vert ->", color_features_vert);
  console.log("color features horiz ->", color_features_horiz);
  console.log("stripe width ->", stripe_width);
  console.log("stripe spacing ->", stripe_spacing);
  console.log("stripe shift ->", stripe_shift);
  console.log("block spacing ->", block_spacing);
  console.log("block width ->", block_width);


  // fill dense_matter_object with positions and attributes of elements - we iterate through every point on the grid to decide if the element is placed there
  for (var i = 0; i < grid_nr_x; i++) {
    for (var j = 0; j < grid_nr_y; j++) {
      for (var k = 0; k < grid_nr_z; k++) {


        //// ELEMENT COLOR ////

        var color_gradient = color_gradient_default; // we have to reset this for every element as it gets changed based on other parameters
        var grid_push_z = 0;

        // color gradient - QUADRANTS
        // upper right quadrant
        if ((i > grid_nr_x/quadrant_div_x) && (j > grid_nr_y/quadrant_div_y) && (quadrants == true)) {
          color_gradient = color_gradient_quadrants[0];
          grid_push_z = 0;

        // upper left quadrant
        } else if ((i < grid_nr_x/quadrant_div_x) && (j > grid_nr_y/quadrant_div_y) && (quadrants == true)) {
          color_gradient = color_gradient_quadrants[1];
          grid_push_z = 0;

        // lower right quadrant
        } else if ((i > grid_nr_x/quadrant_div_x) && (j < grid_nr_y/quadrant_div_y) && (quadrants == true)) {
          color_gradient = color_gradient_quadrants[2];
          grid_push_z = 0;

        // lower left quadrant
        } else if (quadrants == true) {
          color_gradient = color_gradient_quadrants[3];
          grid_push_z = 0;
        }




        var element_smooth = false; // by default, element will have a slight random rotation assigned to it later

        // additional color features
        if ((color_features.includes("vertical stripe sparse")) && (Math.floor(i/stripe_param_a) % stripe_param_b == i % stripe_param_c)) { //(Math.floor(i/15) % 2 == 1)
          color_gradient = "width stack";
          grid_push_z = 0;
          element_smooth = true;
        }

        if ((color_features.includes("vertical stripe dashed")) && (Math.floor(i/stripe_width) % stripe_spacing == stripe_shift)) {
          color_gradient = "width stack";
          grid_push_z = shift_sign_vert * 10;
          element_smooth = true;
        }

        if ((color_features.includes("vertical stripe blocks")) && (Math.floor(i/stripe_width) % stripe_spacing == stripe_shift)) {
          color_gradient = "height stack";
          grid_push_z = shift_sign_vert * 10;
          element_smooth = true;
        }

        if ((color_features.includes("vertical stripe solid")) && (Math.floor(i/stripe_width) % stripe_spacing == stripe_shift)) {
          color_gradient = "depth stack";
          grid_push_z = shift_sign_vert * 10;
          element_smooth = true;
        }

        if ((color_features.includes("horizontal stripe dashed")) && (j % stripe_spacing == stripe_shift)) {
          color_gradient = "width stack";
          grid_push_z = shift_sign_horiz * 10;
          element_smooth = true;
        }

        if ((color_features.includes("horizontal stripe solid")) && (j % stripe_spacing == stripe_shift)) {
          color_gradient = "height stack";
          grid_push_z = shift_sign_horiz * 10;
          element_smooth = true;
        }

        if ((color_features.includes("horizontal stripe blocks")) && (j % stripe_spacing == stripe_shift) && ((i % block_spacing > block_spacing/2) && (i % block_spacing <= block_width + block_spacing/2))) { //(i % block_spacing < block_width), ((i % block_spacing > block_spacing/2) && (i % block_spacing <= block_width + block_spacing/2))
          color_gradient = "height stack";
          grid_push_z = shift_sign_horiz * 10;
          element_smooth = true;
        }



        // probabilities for each palette color, if there are more probabilities than there are colors these will be ignored
        // we can keep this order the same as the colors in chosen_palette are already shuffled
        var palette_probs, ascending_param, descending_param;
        if (color_gradient == "solid") {
          palette_probs = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        } else if (color_gradient == "solid sprinkled") {
          palette_probs = [50, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

        } else if (color_gradient == "uniform") {
          // skipping of one or two colors adds to color differentiation in depth
          if (chosen_palette.length > 4) {palette_probs = [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];}
          else {palette_probs = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];}

        } else if (color_gradient == "vertical grading") {
          ascending_param = j;
          descending_param = grid_nr_y - j;
          palette_probs = [ascending_param, descending_param, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

        } else if (color_gradient == "horizontal grading") {
          ascending_param = i;
          descending_param = grid_nr_x - i;
          palette_probs = [ascending_param, descending_param, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

        } else if (color_gradient == "vertical grading clean") {
          ascending_param = j;
          descending_param = grid_nr_y - j;
          palette_probs = [ascending_param, descending_param, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        } else if (color_gradient == "horizontal grading clean") {
          ascending_param = i;
          descending_param = grid_nr_x - i;
          palette_probs = [ascending_param, descending_param, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        } else {
          // in this case, palette_probs is not used so we assign it dummy values
          palette_probs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }


        // constructing a dynamic color palette with varying number of colors to which probabilities are assigned
        /*var allel_palette_dynamic = [];
        for (var n = 0; n < chosen_palette.length; n++) {
          allel_palette_dynamic.push([chosen_palette[n], palette_probs[n]]); // [palette color, probability]
        }*/

        // constructing a dynamic color palette with varying number of colors to which probabilities are assigned
        // palette probabilities are shifted with depth of layers
        var allel_palette_dynamic = [];
        for (var n = 0; n < chosen_palette.length; n++) {
          var shifted_idx = (n + k) % chosen_palette.length;
          allel_palette_dynamic.push([chosen_palette[n], palette_probs[shifted_idx]]); // [palette color, probability]
        }


        // assigning element color according to color_gradient type
        if (color_gradient == "solid" || color_gradient == "solid sprinkled" || color_gradient == "uniform" || color_gradient == "vertical grading" || color_gradient == "horizontal grading" || color_gradient == "vertical grading clean" || color_gradient == "horizontal grading clean") {
          var element_color = gene_weighted_choice(allel_palette_dynamic);

        } else if (color_gradient == "width stack") {
          var color_index = i % chosen_palette.length;
          var element_color = chosen_palette[color_index];

        } else if (color_gradient == "height stack") {
          var color_index = (j + k) % chosen_palette.length;
          var element_color = chosen_palette[color_index];

        } else if (color_gradient == "depth stack") {
          var color_index = k % chosen_palette.length;
          var element_color = chosen_palette[color_index];

        }




        //// ELEMENT CULL ////

        /*
        // culling rules - ALTERNATING
        if (j % 2 == 0) {pattern_cull_rule = "solid";}
        else {pattern_cull_rule = "solid";}
        */



        // probability to cull the element according to pattern
        var pattern_cull_rule = "solid";

        var pattern_cull_prob;
        if (pattern_cull_rule == "uniform") {
          pattern_cull_prob = 0.25;

        } else if (pattern_cull_rule == "solid") {
          pattern_cull_prob = 0.0;

        } else if (pattern_cull_rule == "down dissolve") {
          pattern_cull_prob = 1.0 - j * 0.06;

        } else if (pattern_cull_rule == "up dissolve") {
          pattern_cull_prob = 0.25 + j * 0.06;

        } else if (pattern_cull_rule == "left dissolve") {
          pattern_cull_prob = 1.0 - i * 0.007;

        } else if (pattern_cull_rule == "right dissolve") {
          pattern_cull_prob = 0.25 + i * 0.008;
        }


        var noise_value = perlin3D(i * noise_scale_x + noise_shift_x, j * noise_scale_y * noise_height_f + noise_shift_y, k * noise_scale_z + noise_shift_z);

        // probability to cull the element according to noise
        var noise_cull_prob;
        if (noise_cull_rule == "fuzzy") {
          noise_cull_prob = gene();

        } else if (noise_cull_rule == "clean") {
          noise_cull_prob = 0.50;
        }

        // defining conditions for culling the element
        var pattern_cull = gene() < pattern_cull_prob; // condition to cull the element according to pattern
        var noise_cull = noise_cull_prob < noise_value; // condition to cull the element according to noise

        // culling the element
        var element_exists = !(pattern_cull || noise_cull); // both conditions can cull the element
        //var element_exists = !pattern_cull;


        //// ASSIGNING ELEMENT PROPERTIES ////


        // defining element position
        var element_position = new THREE.Vector3(i * c_xy_scale + grid_offset_x, j * (c_length + y_gap) + grid_offset_y, k * c_xy_scale + grid_offset_z + grid_push_z);
        var element_grid_position = new THREE.Vector3(i, j, k);
        var element_grid_position_str = element_grid_position.x.toString() + ' ' + element_grid_position.y.toString() + ' ' + element_grid_position.z.toString();


        // exceptions in case the element does not exist at this grid point
        if (element_exists == true) {
          var imesh_idx = elements_per_palette_object[element_color]; // imesh index for this element so we can find it later when accessing transform matrices for that element
          elements_per_palette_object[element_color] += 1; // add one to the count of elements for this color - we need to know this nr when we create instanced mesh

        } else {
          var element_color = undefined;
          var imesh_idx = undefined;
        }

        // this data will be later used to create instanced meshes with all the elements
        var dense_matter_element = {exists: element_exists,
                                    position: element_position,
                                    grid_pos: element_grid_position,
                                    color: element_color,
                                    smooth: element_smooth,
                                    imesh_idx: imesh_idx};
        dense_matter_object[element_grid_position_str] = dense_matter_element;

      }
    }
  }

  // fill up imeshes_object with {color: imesh} pairs, each imesh will have its own color
  for (const [element_color, elements_per_palette] of Object.entries(elements_per_palette_object)) {
    var geometry_color = new THREE.Color(element_color);
    var geometry = new THREE.CylinderGeometry( cylinder_params[c_type][0], cylinder_params[c_type][1], cylinder_params[c_type][2], cylinder_params[c_type][3], cylinder_params[c_type][4], false );
    var material = new THREE.MeshPhongMaterial( {color: geometry_color, flatShading: true} ); //THREE.MeshBasicMaterial( {color: 0xff0000} ); THREE.MeshNormalMaterial();
    var imesh = new THREE.InstancedMesh(geometry, material, elements_per_palette);
    imeshes_object[element_color] = imesh;
    total_elements_existing += elements_per_palette;
  }

  //console.log(dense_matter_object);
  //console.log(elements_per_palette_object);
  console.log("%cQUANTITY", "color: white; background: #000000;");
  console.log("existing elements ->", total_elements_existing);
  console.log("density ->", Math.round(100 * total_elements_existing / total_possible_elements), "%");
  //console.log(imeshes_object);

  var axis_z = new THREE.Vector3(0, 0, 1);
  var axis_x = new THREE.Vector3(1, 0, 0);
  var element_axis = new THREE.Vector3(0, 0, 1);

  // iterate through dense_matter_object's keys and values and build instanced meshes for each color
  for (const [key, dense_matter_element] of Object.entries(dense_matter_object)) {
    if (dense_matter_element['exists'] == false) {continue;} // early exit - if the element doesn't exist, don't add it to the imesh

    //console.log(key, dense_matter_element);
    var dummy = new THREE.Object3D();
    var imesh = imeshes_object[dense_matter_element['color']];

    imesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame

    var element_position = dense_matter_element['position'];
    dummy.scale.set(c_xy_scale, c_length, c_xy_scale);
    dummy.quaternion.setFromUnitVectors(axis_z, element_axis.clone().normalize());
    dummy.position.set(element_position.x, element_position.y, element_position.z);

    if (dense_matter_element['smooth'] == false) {var rot_jitter_factors = [0.25, 0.15];} // rotation jitter will be applied
    else {var rot_jitter_factors = [0, 0];} // rotation jitter will NOT be applied - we will get a smooth and shiny surface

    dummy.rotateY(Math.PI * 0.28 + (gene() - 0.5) * rot_jitter_factors[0]); // rotate member around its axis to align with the grid, plus a random jitter (Math.PI * 0.28 + (gene() - 0.5) * 0.25)
    dummy.rotateOnWorldAxis(axis_x, (gene() - 0.5) * rot_jitter_factors[1]); // add a slight random rotation jitter around the X axis

    dummy.updateMatrix();
    imesh.setMatrixAt(imesh_index_tracker[dense_matter_element['color']], dummy.matrix);

    // add one to the index tracker for the imesh of that color
    imesh_index_tracker[dense_matter_element['color']] += 1;
  }

  // add instance meshes to the scene
  var sceneMeshes = []
  for (const [element_color, imesh] of Object.entries(imeshes_object)) {
      // global rotation of the instanced mesh
      imesh.rotateX(global_rot_x);
      imesh.rotateY(global_rot_y);

      imesh.instanceMatrix.needsUpdate = true;
      //imesh.instanceColor.needsUpdate = true;
      imesh.castShadow = true;
      imesh.receiveShadow = true;
      imesh.name = element_color;
      this.scene.add(imesh);
      sceneMeshes.push(imesh);
  }

  //KEDIT
  var chosen_palette_array = [];
  console.log(chosen_palette);
  for(i=0; i<chosen_palette.length; i++){
    var col = new THREE.Color(chosen_palette[i]);
    //col.setHex(chosen_palette[i]);
    console.log(col);
    chosen_palette_array.push(col)
  }

  //var imesh = this.scene.getObjectByName(element_color);

  //setInterval(function(){
  //let matrix = new THREE.Matrix4();
  //matrix.makeScale(1, 1, 1);
  //console.log(this.scene);
  var copyPalette = shiftArrayCopy(chosen_palette_array);
  var cycleTime = 0;
  //const sigmoid_amplitude = 0.05;
  setInterval(function () {

    if(cycleTime<=flickerDuration){ //During State Change
      var k=0;
      var stateChangeProb = cycleTime/flickerDuration;
      //console.log(stateChangeProb);
      for (const [element_color, imeshx] of Object.entries(imeshes_object)) {
        var selectedColor;

        /*
        for (let i=0; i<imeshx.count; i++){
          if (stateChangeProb > gene()){
            selectedColor = copyPalette[k]; //Update State with shifted palette
          } else {
            selectedColor = chosen_palette_array[k]; //Recede State
          }
          //imeshx.setMatrixAt(i, matrix);
          //matrix.setPosition(imeshx[i])
          //imeshx.getMatrixAt(i, matrix)
          //imeshx.setMatrixAt(i, matrix);
          sceneMeshes[k].setColorAt(i,selectedColor);
          //imesh.setColorAt(i,selectedColor);

        };*/

        //imeshx.instanceMatrix.needsUpdate = true;
        //console.log(imeshx.instanceColor)
        var sigmoidValue = sigmoid(cycleTime-flickerDuration/2,500)+0.08; //non linear activation
        //console.log(sigmoidValue);
        if (sigmoidValue > gene()){
        ////if (stateChangeProb > gene()){
          selectedColor = copyPalette[k]; //Update State with shifted palette
        } else {
          selectedColor = chosen_palette_array[k]; //Recede State
        }
        //imesh.instanceColor.needsUpdate = true;
        ////sceneMeshes[k].instanceColor.needsUpdate = true;
        imeshes_object[element_color].material.color = selectedColor;
        //imeshes_object[element_color].material.color = elements_per_palette_object; //Change all item colours
        k++;
      }
    }//Else: State Stable

    cycleTime += flickerInterval;

    if (cycleTime>=cycleDuration){
      chosen_palette_array=[...copyPalette];
      copyPalette = shiftArrayCopy(chosen_palette_array);
      //console.log(chosen_palette_array,copyPalette)
      cycleTime = 0;
    }
  }, flickerInterval);

  //  chosen_palette_array=copyPalette;
  //}, cycleDuration)



}

View.prototype.addInstances = function  () {

  var c_type = 'square beam';
  var c_xy_scale = thickness_scale_per_stage['moderate_constant']; // how much is thickness of the member scaled for every stage

  var cull_dist_bands; // culling of members happens at different rates at each of these distance bands
  var cull_precentage_bands; // culling precentages per distance bands (first one is 100%, all members get removed)
  var explosion_strength; // overall factor for translation during explosion - will be divided with the distance from the axis (closer to the axis, stronger the offset)
  var explosion_rot_range; // maximum range for the random rotation angle (in radians) while applying explosion
  var explosion_rot_reduction; // reduction of random rotation angle for each band (closer to the axis means more chaos)

  if ((explosion_type == 1) || (explosion_type == 2) || (explosion_type == 3) || (explosion_type == 4)) {
    // explosion along an axis
    cull_dist_bands = [20, 40, 60, 80];
    cull_precentage_bands = [1.0, 0.8, 0.6, 0.4];
    explosion_strength = 1000;
    explosion_rot_range = Math.PI/2;
    explosion_rot_reduction = [1.0, 0.6, 0.3];
  } else if ((explosion_type == 5) || (explosion_type == 6)) {
    // explosion from a point
    cull_dist_bands = [40, 80, 120, 160];
    cull_precentage_bands = [1.0, 0.8, 0.6, 0.4];
    explosion_strength = 1000;
    explosion_rot_range = Math.PI/2;
    explosion_rot_reduction = [1.0, 0.6, 0.3];
  }

  var triangle_radius = 0.5;
  var debris_multiplier = 5; // multiply the number of debris particles
  var debris_spread = 50; // distance range to randomly spread out the debris particles

  for (var n = 0; n < gDatas.length; n++) {
    var gData = gDatas[n];
    var dummy = new THREE.Object3D()
    var geometry = new THREE.CylinderGeometry( cylinder_params[c_type][0], cylinder_params[c_type][1], cylinder_params[c_type][2], cylinder_params[c_type][3], cylinder_params[c_type][4], false );
    var material = new THREE.MeshPhongMaterial( {color: 0xff00ff, flatShading: true} ); //THREE.MeshBasicMaterial( {color: 0xff0000} ); THREE.MeshNormalMaterial();
    var imesh = new THREE.InstancedMesh( geometry, material, gData.links.length );
    var axis = new THREE.Vector3(0, 1, 0);
    imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame
    var c = new THREE.Color()

    var exploded_dummies = []; // array to hold our transform matrices of exploded elements so we can use them to add more debris around the explosion area
    var debris_position_temp = new THREE.Vector3(); // temporary holder for positions of exploded members so we can use them for debris

    for (var i = 0; i < gData.links.length; i++) {
      var source_index = gData.links[i]['source'];
      var target_index = gData.links[i]['target'];
      var vector = new THREE.Vector3(gData.nodes[target_index].x-gData.nodes[source_index].x, gData.nodes[target_index].y-gData.nodes[source_index].y, gData.nodes[target_index].z-gData.nodes[source_index].z);
      dummy.scale.set(c_xy_scale[gData.nodes[source_index]['stage']], gData.links[i]['value'], c_xy_scale[gData.nodes[source_index]['stage']]); // (1, gData.links[i]['value'], 1)
      dummy.quaternion.setFromUnitVectors(axis, vector.clone().normalize());
      dummy.position.set((gData.nodes[source_index].x+gData.nodes[target_index].x)/2, (gData.nodes[source_index].y+gData.nodes[target_index].y)/2, (gData.nodes[source_index].z+gData.nodes[target_index].z)/2)
      dummy.updateMatrix();

      // EXPLODING LATTICE MEMBERS

      // setting default for all members not to get culled
      var cull_member = false;
      var cull_member_x_axis = false;
      var cull_member_y_axis = false;

      // in case we have to calculate explosion, proceede below, otherwise skip
      if (explosion_type != 0) {

        var dist_to_x_axis = Math.abs((gData.nodes[source_index].y + gData.nodes[target_index].y) / 2); // from member mid point to axis
        var dist_to_y_axis = Math.abs((gData.nodes[source_index].x + gData.nodes[target_index].x) / 2); // from member mid point to axis
        var end_to_x_axis = Math.min(Math.abs(gData.nodes[source_index].y), Math.abs(gData.nodes[target_index].y)); // from member end point to axis
        var end_to_y_axis = Math.min(Math.abs(gData.nodes[source_index].x), Math.abs(gData.nodes[target_index].x)); // from member end point to axis

        var projected_member_cent =  new THREE.Vector3((gData.nodes[source_index].x + gData.nodes[target_index].x) / 2, (gData.nodes[source_index].y + gData.nodes[target_index].y) / 2, 0);
        var projected_source = new THREE.Vector3(gData.nodes[source_index].x, gData.nodes[source_index].y, 0);
        var projected_target = new THREE.Vector3(gData.nodes[target_index].x, gData.nodes[target_index].y, 0);

        var dist_to_cent_a = projected_member_cent.distanceTo(explosion_center_a);
        var dist_to_cent_b = projected_member_cent.distanceTo(explosion_center_b);
        var dist_source_to_cent_a = projected_source.distanceTo(explosion_center_a);
        var dist_target_to_cent_a = projected_target.distanceTo(explosion_center_a);
        var dist_end_to_cent_a = Math.min(dist_source_to_cent_a, dist_target_to_cent_a);
        var dist_source_to_cent_b = projected_source.distanceTo(explosion_center_b);
        var dist_target_to_cent_b = projected_target.distanceTo(explosion_center_b);
        var dist_end_to_cent_b = Math.min(dist_source_to_cent_b, dist_target_to_cent_b);

        var explosion_axis = new THREE.Vector3((gData.nodes[source_index].x + gData.nodes[target_index].x) / 2, (gData.nodes[source_index].y + gData.nodes[target_index].y) / 2, (gData.nodes[source_index].z + gData.nodes[target_index].z) / 2).normalize();
        var dist_to_axis_explosion;

        // defining parameters for each explosion type

        if (explosion_type == 1) {
          dist_to_axis = dist_to_x_axis;
          dist_to_axis_explosion = dist_to_x_axis;
          end_to_axis = end_to_x_axis;

        } else if (explosion_type == 2) {
          dist_to_axis = dist_to_x_axis;
          dist_to_axis_explosion = dist_to_y_axis;
          end_to_axis = end_to_x_axis;

        } else if (explosion_type == 3) {
          dist_to_axis = dist_to_y_axis;
          dist_to_axis_explosion = dist_to_y_axis;
          end_to_axis = end_to_y_axis;

        } else if (explosion_type == 4) {
          dist_to_axis = dist_to_y_axis;
          dist_to_axis_explosion = dist_to_x_axis;
          end_to_axis = end_to_y_axis;

        } else if (explosion_type == 5) {
          dist_to_axis = dist_to_cent_a;
          dist_to_axis_explosion = dist_to_cent_a;
          end_to_axis = dist_end_to_cent_a;

        } else if (explosion_type == 6) {
          dist_to_axis = Math.min(dist_to_cent_a, dist_to_cent_b);
          dist_to_axis_explosion = Math.min(dist_to_cent_a, dist_to_cent_b);
          end_to_axis = Math.min(dist_end_to_cent_a, dist_end_to_cent_b);
        }


        if ((end_to_axis < cull_dist_bands[0]) || (dist_to_axis < cull_dist_bands[0])) {
          // apply explosion offset and random rotation for member within the explosion zone
          dummy.translateOnAxis(explosion_axis, explosion_strength / dist_to_axis_explosion);
          dummy.updateMatrix();
          // first band, closest, every member gets culled
          if (gene() < cull_precentage_bands[0]) {
            cull_member_x_axis = true;
            debris_position_temp = new THREE.Vector3((gData.nodes[source_index].x+gData.nodes[target_index].x)/2, (gData.nodes[source_index].y+gData.nodes[target_index].y)/2, (gData.nodes[source_index].z+gData.nodes[target_index].z)/2);
            debris_position_temp.add(explosion_axis.multiplyScalar(explosion_strength / dist_to_axis_explosion)); // debris will be pushed away from the axis the same as the members
            for (var d = 0; d < debris_multiplier; d++) {exploded_dummies.push(debris_position_temp);}
          }

        } else if ((end_to_axis < cull_dist_bands[1]) || (dist_to_axis < cull_dist_bands[1])) {
          // apply explosion offset and random rotation for member within the explosion zone
          dummy.translateOnAxis(explosion_axis, explosion_strength / dist_to_axis_explosion);
          dummy.rotateX(explosion_rot_reduction[0] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateY(explosion_rot_reduction[0] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateZ(explosion_rot_reduction[0] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.updateMatrix();
          // second band, 80% of members get culled
          if (gene() < cull_precentage_bands[1]) {
            cull_member_x_axis = true;
            debris_position_temp = new THREE.Vector3((gData.nodes[source_index].x+gData.nodes[target_index].x)/2, (gData.nodes[source_index].y+gData.nodes[target_index].y)/2, (gData.nodes[source_index].z+gData.nodes[target_index].z)/2);
            debris_position_temp.add(explosion_axis.multiplyScalar(explosion_strength / dist_to_axis_explosion)); // debris will be pushed away from the axis the same as the members
            for (var d = 0; d < debris_multiplier; d++) {exploded_dummies.push(debris_position_temp);}
          }

        } else if ((end_to_axis < cull_dist_bands[2]) || (dist_to_axis < cull_dist_bands[2])) {
          // apply explosion offset and random rotation for member within the explosion zone
          dummy.translateOnAxis(explosion_axis, explosion_strength / dist_to_axis_explosion);
          dummy.rotateX(explosion_rot_reduction[1] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateY(explosion_rot_reduction[1] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateZ(explosion_rot_reduction[1] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.updateMatrix();
          // third band, 60% of members get culled
          if (gene() < cull_precentage_bands[2]) {
            cull_member_x_axis = true;
            debris_position_temp = new THREE.Vector3((gData.nodes[source_index].x+gData.nodes[target_index].x)/2, (gData.nodes[source_index].y+gData.nodes[target_index].y)/2, (gData.nodes[source_index].z+gData.nodes[target_index].z)/2);
            debris_position_temp.add(explosion_axis.multiplyScalar(explosion_strength / dist_to_axis_explosion)); // debris will be pushed away from the axis the same as the members
            for (var d = 0; d < debris_multiplier; d++) {exploded_dummies.push(debris_position_temp);}
          }

        } else if ((end_to_axis < cull_dist_bands[3]) || (dist_to_axis < cull_dist_bands[3])) {
          // apply explosion offset and random rotation for member within the explosion zone
          dummy.translateOnAxis(explosion_axis, explosion_strength / dist_to_axis_explosion);
          dummy.rotateX(explosion_rot_reduction[2] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateY(explosion_rot_reduction[2] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.rotateZ(explosion_rot_reduction[2] * (gene() * explosion_rot_range * 2 - explosion_rot_range));
          dummy.updateMatrix();
          // third band, 40% of members get culled
          if (gene() < cull_precentage_bands[3]) {
            cull_member_x_axis = true;
            debris_position_temp = new THREE.Vector3((gData.nodes[source_index].x+gData.nodes[target_index].x)/2, (gData.nodes[source_index].y+gData.nodes[target_index].y)/2, (gData.nodes[source_index].z+gData.nodes[target_index].z)/2);
            debris_position_temp.add(explosion_axis.multiplyScalar(explosion_strength / dist_to_axis_explosion)); // debris will be pushed away from the axis the same as the members
            for (var d = 0; d < debris_multiplier; d++) {exploded_dummies.push(debris_position_temp);}
          }
        }

        cull_member = cull_member_x_axis;

      }
      // end of explosion part

      // cull_member is set per default to false, unless explosion part above defined it to be true
      if (!cull_member) {
        imesh.setMatrixAt( i, dummy.matrix );
      }

    }

    // global rotation of the lattice
    imesh.rotateX(global_rot_x);
    imesh.rotateY(global_rot_y);

    imesh.instanceMatrix.needsUpdate = true
    imesh.instanceColor.needsUpdate = true

    imesh.castShadow = true;
    imesh.receiveShadow = true;

    this.scene.add(imesh);

    //ref.current.instanceMatrix.needsUpdate = true


    // EXPLOSION DUST CLOUD

    // one triangle
    const vertices = [
      0, 1, 0, // top
      1, 0, 0, // right
      -1, 0, 0 // left
    ];
    const faces = [ 2, 1, 0 ]; // only one face

    var dummy = new THREE.Object3D();
    var triangle = new THREE.PolyhedronGeometry(vertices, faces, triangle_radius, 0);
    triangle.scale(0.5, 10, 0.5);
    var imesh_debris = new THREE.InstancedMesh( triangle, material, exploded_dummies.length )
    imesh_debris.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

    //console.log('exploded_dummies.length ->', exploded_dummies.length);
    //console.log(exploded_dummies);

    for (var i = 0; i < exploded_dummies.length; i++) {
      dummy.position.set(exploded_dummies[i].x, exploded_dummies[i].y, exploded_dummies[i].z);
      var random_axis = new THREE.Vector3(gene() * 2 - 1, gene() * 2 - 1, gene() * 2 - 1).normalize();
      dummy.translateOnAxis(random_axis, gene() * debris_spread);

      var uniscale = 0.2 + gene();
      dummy.scale.set(uniscale, uniscale, uniscale); //Dynamically assign this to give different sizes (eg add attribute to nData.nodes and call it here)

      dummy.rotateX(gene() * Math.PI/3 - Math.PI/6);
      dummy.rotateY(gene() * Math.PI/3 - Math.PI/6);
      dummy.rotateZ(gene() * Math.PI/3 - Math.PI/6);

      dummy.updateMatrix();
      imesh_debris.setMatrixAt( i, dummy.matrix );

    }


    imesh_debris.instanceMatrix.needsUpdate = true

    imesh_debris.castShadow = true; // remove for performance
    imesh_debris.receiveShadow = true;
    this.scene.add(imesh_debris);
  }

}

// takes as an input nData object for location of stars
View.prototype.addStarsOrdered = function ()
{
  var star_plane_distance = -2000; // z coordinate of the plane where stars reside (they also recieve no shadow)
  var star_jitter = 10; // every lattice node is randomly jittered so the stars don't align

  // one triangle
  const vertices = [
    0, 1, 0, // top
    1, 0, 0, // right
    -1, 0, 0 // left
  ];
  // only one face
  const faces = [ 2, 1, 0 ];
  const triangle_radius = 0.30; //0.5

  const geometry = new THREE.PolyhedronGeometry(vertices, faces, triangle_radius, 0);
  geometry.scale(1, 1.5, 1);
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );

  for (var n = 0; n < nDatas.length; n++) {
    var nData = nDatas[n];
    const imesh = new THREE.InstancedMesh( geometry, material, nData.nodes.length )
    imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

    for (var i = 0; i < nData.nodes.length; i++) {
      const dummy = new THREE.Object3D();

      var uniscale = 0.5 + gene();
      dummy.scale.set(uniscale,uniscale,uniscale); // dynamically assign this to give different sizes (eg add attribute to nData.nodes and call it here)
      dummy.position.set(nData.nodes[i].x + gene_range(-star_jitter, star_jitter), nData.nodes[i].y + gene_range(-star_jitter, star_jitter), star_plane_distance);

      dummy.rotateX(gene() * Math.PI/3 - Math.PI/6);
      dummy.rotateY(gene() * Math.PI/3 - Math.PI/6);
      dummy.rotateZ(gene() * Math.PI/3 - Math.PI/6);

      dummy.updateMatrix();
      imesh.setMatrixAt( i, dummy.matrix );
  }



  setInterval(function () {

    /*for (var n = 0; n < imesh.count; n++) {
      var refMatrix;
      const rotMatrix = new THREE.Matrix4.makeRotationAxis(cameraVector, rotTheta);
      imesh.getMatrixAt(n, refMatrix);
      imesh.setMatrixAt(n, dummy.matrix);
    }*/
    console.log("test")
    imesh.applyMatrix4(rotMatrixStaticIncrement);
    imesh.instanceMatrix.needsUpdate = true;
    //rotTheta += rotThetaDelta;
    //if (rotTheta >= Math.Pi*2) {rotTheta=0};
  }, cycleBackgroundUpdate)

  //imesh.castShadow = true; // remove for performance
  //imesh.receiveShadow = true; // stars recieve no shadow
  this.scene.add(imesh);

  }
}

View.prototype.addStarsRandom = function (bounds, qty)
{
  var star_plane_distance = -2000; // z coordinate of the plane where stars reside (they also recieve no shadow)

  // one triangle
  const vertices = [
    0, 1, 0, // top
    1, 0, 0, // right
    -1, 0, 0 // left
  ];
  // only one face
  const faces = [ 2, 1, 0 ];
  const triangle_radius = 0.30; //0.5

  const geometry = new THREE.PolyhedronGeometry(vertices, faces, triangle_radius, 0);
  geometry.scale(1, 1.5, 1);
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );

  const imesh = new THREE.InstancedMesh(geometry, material, qty);
  imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

  for (var i = 0; i < qty; i++) {
    const dummy = new THREE.Object3D();

    var uniscale = 0.5 + gene();
    dummy.scale.set(uniscale,uniscale,uniscale);
    dummy.position.set(gene() * bounds - bounds/2, gene() * bounds - bounds/2,  star_plane_distance);

    dummy.rotateX(gene() * Math.PI/3 - Math.PI/6);
    dummy.rotateY(gene() * Math.PI/3 - Math.PI/6);
    dummy.rotateZ(gene() * Math.PI/3 - Math.PI/6);

    dummy.updateMatrix();
    imesh.setMatrixAt( i, dummy.matrix );
  }

  imesh.instanceMatrix.needsUpdate = true

  //const axesHelper = new THREE.AxesHelper( 200 );
  //this.scene.add( axesHelper );

  //const cycle = 100000000;
  //const cycleUpdate = 1000;
  //const rotThetaDelta = Math.PI*2*cycleUpdate/cycle;
  //const cameraVector = this.camera.getWorldDirection();
  //const vector = new THREE.Vector3(0,0,1);
  //const rotMatrixStaticIncrement = new THREE.Matrix4();
  //rotMatrixStaticIncrement.makeRotationAxis(vector, rotThetaDelta)

  setInterval(function () {
    //console.log("r_random");
    //imesh.applyMatrix4(rotMatrixStaticIncrement);
    imesh.rotateZ(rotThetaDelta);
    imesh.instanceMatrix.needsUpdate = true;
  }, cycleBackgroundUpdate)
  //imesh.castShadow = true; // remove for performance
  //imesh.receiveShadow = true; // stars recieve no shadow
  this.scene.add(imesh);

}

View.prototype.addStarDust = function ()
{
  var star_plane_distance = -2000; // z coordinate of the plane where stars reside (they also recieve no shadow)

  // random walk
  var step_size = 5;
  var start_offset = 100;
  var branch_points = 4000; // number of stars in each random walk branch
  var nr_of_branches = 20; // number or random walk branches
  var star_crack_points = [];

  // loop that draws the all random walk branches
  for (var b = 0; b < nr_of_branches; b++) {
    var start_point = new THREE.Vector3(gene_range(-start_offset, start_offset), gene_range(-start_offset, start_offset), star_plane_distance);
    star_crack_points.push(start_point.clone());
    step_size = step_size * 0.95; // step size reduction factor for each branch
    var step_bias_up = (b % 2) * 0.5 / Math.sqrt(b + 1);
    var step_bias_down = -((b + 1) % 2) * 0.5 / Math.sqrt(b + 1);
    // drawing one random walk branch
    for (var i = 0; i < branch_points; i++) {
      var rand_vec = new THREE.Vector3(gene_range(-step_size, step_size), gene_range(-step_size + step_bias_up, step_size + step_bias_down), 0);
      var new_start_point = start_point.clone();
      new_start_point.add(rand_vec);
      star_crack_points.push(new_start_point);
      start_point = new_start_point.clone();
    }
  }

  // this is important to calculate for instanced mesh!
  var total_number_of_stars = branch_points * nr_of_branches;

  // one triangle
  const vertices = [
    0, 1, 0, // top
    1, 0, 0, // right
    -1, 0, 0 // left
  ];
  // only one face
  const faces = [ 2, 1, 0 ];
  const triangle_radius = 0.30; //0.5

  const geometry = new THREE.PolyhedronGeometry(vertices, faces, triangle_radius, 0);
  geometry.scale(1, 1.5, 1);
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );

  const imesh = new THREE.InstancedMesh(geometry, material, total_number_of_stars);
  imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

  // random walk
  for (var i = 0; i < star_crack_points.length; i++) {
    const dummy = new THREE.Object3D();

    var uniscale = 0.0 + gene();
    dummy.scale.set(uniscale,uniscale,uniscale);
    dummy.position.set(star_crack_points[i].x, star_crack_points[i].y,  star_plane_distance);

    dummy.rotateX(gene() * Math.PI/3 - Math.PI/6);
    dummy.rotateY(gene() * Math.PI/3 - Math.PI/6);
    dummy.rotateZ(gene() * Math.PI/3 - Math.PI/6);

    dummy.updateMatrix();
    imesh.setMatrixAt(i, dummy.matrix);
  }

  imesh.instanceMatrix.needsUpdate = true



  setInterval(function () {
    //console.log("r_star dust");
    //imesh.applyMatrix4(rotMatrixStaticIncrement);
    imesh.rotateZ(rotThetaDelta)
    imesh.instanceMatrix.needsUpdate = true;
  }, cycleBackgroundUpdate)
  //imesh.castShadow = true; // remove for performance
  //imesh.receiveShadow = true; // stars recieve no shadow
  this.scene.add(imesh);

}

View.prototype.addMoon = function ()
{
  var radius_x, radius_y, radius_moon_x, radius_moon_y, radius_star_x, radius_star_y, radius_elongation, radius_factors;
  var cent_x, cent_y, cent_moon_x, cent_moon_y, celestial_x, celestial_y, centers_x, centers_y;
  var angle, r, tilt_angle, nr_of_triangles, nr_of_stars, constellation_bounds;
  var hasStarShine, star_shine;

  var celestial_plane_distance = -1800; // z coordinate of the plane where stars reside (they also recieve no shadow)
  var monteCarloHit = true; // this will draw the triangle and is true by default, except for nebula case where it can become false
  var nr_of_tries = 100; // number of tries to try to displace the center of the celestial (used in a for loop)
  var cent_offset = center_piece_type != 'none' ? 100 : 0; // center offset is set if there is a lattice in the center, otherwise it's zero

  // define moon parameters
  radius_moon_x = gene_range(5, 50);
  radius_moon_y = radius_moon_x;
  // here we are trying to choose the center until at least one coordinate is not close to the center (so it doesn't overlap with the lattice in the center)
  for (var i = 0; i < nr_of_tries; i++) {
    cent_moon_x = gene_range(-100 - cent_offset/2, 100 + cent_offset/2);
    cent_moon_y = gene_range(-100 - cent_offset/2, 100 + cent_offset/2);
    if (Math.max(Math.abs(cent_x), Math.abs(cent_y)) > cent_offset) {break;}
  }

  // define shiny star parameters
  radius_star_x = 50;
  radius_star_y = 50;
  radius_x = radius_star_x;
  radius_y = radius_star_y;
  radius_elongation = 0.05;
  radius_factors = [];
  hasStarShine = [];
  centers_x = [];
  centers_y = [];
  nr_of_stars = generateRandomInt(1, 10);
  constellation_bounds = gene_range(150, 300);
  for (var i = 0; i < nr_of_stars; i++) {
    centers_x.push(gene_range(-constellation_bounds, constellation_bounds));
    centers_y.push(gene_range(-constellation_bounds, constellation_bounds));
    radius_factors.push(gene_range(0.05, 0.95)); // every star has a different size
    star_shine = gene() < 0.25 ? true : false;
    hasStarShine.push(star_shine); // determines if the star shine (like a plus sign) will be drawn for that star
  }
  tilt_angle = 0;
  nr_of_triangles = nr_of_stars * 1000;

  // place glowing disk in front of the stars - FULL MOON
  const light_disc_geo = new THREE.CircleGeometry(radius_moon_x, 128);
  const light_disc_material = new THREE.MeshBasicMaterial({color: '#f9f0de'});
  const light_disc_mesh = new THREE.Mesh(light_disc_geo, light_disc_material);
  light_disc_mesh.position.set(cent_moon_x, cent_moon_y, celestial_plane_distance - 100);


  // one triangle
  const vertices = [
    0, 1, 0, // top
    1, 0, 0, // right
    -1, 0, 0 // left
  ];
  // only one face
  const faces = [ 2, 1, 0 ];
  const triangle_radius = 0.30; //0.5

  const geometry = new THREE.PolyhedronGeometry(vertices, faces, triangle_radius, 0);
  geometry.scale(1, 1.5, 1);
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );

  const imesh = new THREE.InstancedMesh( geometry, material, nr_of_triangles )
  imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

  // main loop that calculates positions of all triangles
  for (var i = 0; i < nr_of_triangles; i++) {

    rand_idx = generateRandomInt(0, centers_x.length); // we choose a random index from the list that holds meteor coordinates
    angle = gene_range(0, Math.PI * 2); // full 360 degrees
    r = gene_range(0, gene_range(0, gene_range(0, gene_range(0, gene_range(0, 1))))); // more dense in the middle - CONSTELLATION
    cent_x = centers_x[rand_idx]; // draw random star from the coordinate list
    cent_y = centers_y[rand_idx]; // same as above

    if (hasStarShine[rand_idx] == true) {
      // shine part of the star (like a plus sign)
      if (gene() < 0.5) {
        radius_x = radius_star_x * radius_elongation * radius_factors[rand_idx]; // here radius_elongation is actually shortening
        radius_y = radius_star_y * radius_factors[rand_idx] * 5.0; // this last factor will additionally elongate the shine
      } else {
        radius_x = radius_star_x * radius_factors[rand_idx] * 5.0; // this last factor will additionally elongate the shine
        radius_y = radius_star_y * radius_elongation * radius_factors[rand_idx]; // here radius_elongation is actually shortening
      }
      // fuzzy spherical part of the star
      if (gene() < 0.25) {
        radius_x = radius_star_x * radius_factors[rand_idx];
        radius_y = radius_star_y * radius_factors[rand_idx];
      }

    } else {
      // fuzzy spherical part of the star
      radius_x = radius_star_x * radius_factors[rand_idx] * 0.25;
      radius_y = radius_star_y * radius_factors[rand_idx] * 0.25;
    }

    // determining the position of each triangle
    // general parametrization for a tilted ellipse
    //https://math.stackexchange.com/questions/2645689/what-is-the-parametric-equation-of-a-rotated-ellipse-given-the-angle-of-rotatio
    celestial_x = cent_x + r * radius_x * Math.cos(angle) * Math.cos(tilt_angle) - r * radius_y * Math.sin(angle) * Math.sin(tilt_angle);
    celestial_y = cent_y + r * radius_x * Math.cos(angle) * Math.sin(tilt_angle) + r * radius_y * Math.sin(angle) * Math.cos(tilt_angle);

    const dummy = new THREE.Object3D();
    var uniscale = 0.5 + gene();
    dummy.scale.set(uniscale, uniscale, uniscale); // dynamically assign this to give different sizes (eg add attribute to nData.nodes and call it here)
    dummy.position.set(celestial_x, celestial_y, celestial_plane_distance);

    dummy.rotateX(gene() * Math.PI/3 - Math.PI/6);
    dummy.rotateY(gene() * Math.PI/3 - Math.PI/6);
    dummy.rotateZ(gene() * Math.PI/3 - Math.PI/6);

    dummy.updateMatrix();
    // if any triangle ends up too far from the center, we don't draw it
    if (Math.max(Math.abs(celestial_x), Math.abs(celestial_y)) < 1000) {
      imesh.setMatrixAt( i, dummy.matrix );
    }
  }

  imesh.instanceMatrix.needsUpdate = true
  //imesh.castShadow = true; // remove for performance
  //imesh.receiveShadow = true; // stars recieve no shadow

  setInterval(function () {
    //console.log("r_moon");
    imesh.rotateZ(rotThetaDelta);
    //light_disc_mesh.rotateZ(rotThetaDelta);
    light_disc_mesh.applyMatrix4(rotMatrixStaticIncrement);
    //light_disc_mesh.updateMatrix();
    //light_disc_mesh.matrixWorldNeedsUpdate = true;
    //imesh.instanceMatrix.needsUpdate = true;
  }, cycleBackgroundUpdate)

  this.scene.add(light_disc_mesh);
  this.scene.add(imesh);

}


View.prototype.addLineMesh = function (data, dash_array, dash_ratio, line_thickness, dash_speed) {
  var temp_array = new Float32Array(6);
  //console.log(gData.nodes[data['source']].x)
  temp_array[0] = gData.nodes[data['source']].x;
  temp_array[1] = gData.nodes[data['source']].y;
  temp_array[2] = gData.nodes[data['source']].z;
  temp_array[3] = gData.nodes[data['target']].x;
  temp_array[4] = gData.nodes[data['target']].y;
  temp_array[5] = gData.nodes[data['target']].z;

  var geo = new THREE.BufferGeometry()

  geo.setAttribute( 'position', new THREE.BufferAttribute( temp_array, 3 ) );

  var g = new MeshLine();
  g.setGeometry( geo );
  //g.setFromPoints()
  this.meshline_data.push(g)

  var material = new MeshLineMaterial( {
    antialias: true,
    useMap: false,
    color: new THREE.Color( my_features.ink),
    opacity: 1,
    transparent: true, // switch to false is opacity is 1, switch to true when using dashed lines
    dashArray: dash_array, // 0.05, 0 -> no dash ; 1 -> half dashline length ; 2 -> dashline = length
    dashOffset: 0,
    dashRatio: dash_ratio, // 0.0 -> full line ; 0.5 -> balancing ; 1.0 -> full void
    //resolution: resolution,
    sizeAttenuation: false, // makes the line width constant regardless distance (1 unit is 1px on screen) (false - attenuate, true - don't attenuate)
    lineWidth: line_thickness, // 0.002, float defining width (if sizeAttenuation is true, it's world units; else is screen pixels)
  });

  var mesh = new THREE.Mesh( g.geometry, material );
  this.meshline_mesh.push(mesh);

  this.scene.add(mesh);
}



View.prototype.render = function () {

    this.composer.render();
    //this.renderer.clear();  //

    requestAnimationFrame(this.render.bind(this));
    this.controls.update();

    //this.renderer.clear();  //
    if (debug){
      var start_timer = new Date().getTime();
    }

    if (debug){
      var end_timer = new Date().getTime();
      composer_pass = end_timer - start_timer
    }
    if(snap) {
      //console.log(controller)
      capture(controller);
      snap = false;
    }
    if(recording) {
      capturer.capture( renderer.domElement );
    }
    //this.renderer.render(this.scene, this.camera); // When no layers are used

};

function Controller(viewArea) {
  var view = new View(viewArea);
  view.cam_distance = 700 //1000 for ortho
  this.view = view; //referenced outside

  var ticker = 0;
  var sigmoid_ticker = 0;
  var ticker_set = [];

  for (var i = 0; i < stage; i++) {
    ticker_set.push(0);
  }

  const parallex_amplitude = view.cam_distance;
  const parallex_delay = 5000;
  const parallex_framerate = 200; //33ms for 30fps and 15fps for 60fps
  const parallex_step = 0.5*Math.PI/parallex_framerate; //0.5*Math.PI/parallex_framerate
  const stopping_angle = Math.PI/2 //Change to desired sector angle IMPORTANT: Must fit in 2Pi with no remainder to get alignment every period

  //Sigmoid Function for motion
  const sigmoid_amplitude = 0.05 //0.113; //Best range to work from -Pi ti Pi

  const mid_sector = stopping_angle/2;
  var current_stage = 0
  var current_dir = 1

  const up = new THREE.Vector3(0,1,0)

  // LIGHT TRAVEL PARAMETERS
  var light_framerate = 50;
  light_framerate_change = 50; //Needs to be the same
  var base_light_angle = 1.0 * Math.PI/3; // starting angle, angle 0 is straight behind the camera - Math.PI/3, 0.75 * Math.PI/3
  base_light_angle_step = 0.0005; //0.05
  //var light_angle;
  var light_angle_step;

  if (light_source_type == 'west') {
    light_angle = -base_light_angle;
    light_angle_step = base_light_angle_step;
  } else if (light_source_type == 'east') {
    light_angle = base_light_angle;
    light_angle_step = -base_light_angle_step;
  } else if (light_source_type == 'north') {
    light_angle = base_light_angle;
    light_angle_step = -base_light_angle_step;
  } else if (light_source_type == 'south') {
    light_angle = -base_light_angle;
    light_angle_step = base_light_angle_step;
  }


  // LIGHT TRAVEL LOGIC
  var arc_division = 1.0;
  const lp = view.light.position;
  function update_light_position () {
    light_angle += light_angle_step*arc_division;

    if ((light_source_type == 'west') || (light_source_type == 'east')) {
      // rotation in XY plane
      view.light.position.set(Math.sin(light_angle)*parallex_amplitude, lp.y, Math.cos(light_angle)*parallex_amplitude); //1000,1000,1000
    } else if ((light_source_type == 'north') || (light_source_type == 'south')) {
    // rotation in YZ plane
    view.light.position.set(lp.x, Math.sin(light_angle)*parallex_amplitude, Math.cos(light_angle)*parallex_amplitude);
    }
    // rotation in XZ plane
    //view.light.position.set(Math.sin(light_angle)*parallex_amplitude, Math.cos(light_angle)*parallex_amplitude, lp.z);
  }

  //STATICLIGHT//var lightIntervalInstance = setInterval(function () {update_light_position()}, light_framerate);


  // DENSE MATTER COMPUTATION
  function update_dense_matter () {
    var rand_grid_pos_str = generateRandomInt(0, grid_nr_x).toString() + " " + generateRandomInt(0, grid_nr_y).toString() + " " + generateRandomInt(0, grid_nr_z).toString();
    //console.log(rand_grid_pos_str, dense_matter_object[rand_grid_pos_str]['position'], dense_matter_object[rand_grid_pos_str]['exists']);

    var dummy = new THREE.Object3D()
    var mat4 = new THREE.Matrix4();

    var selected_color = "#e6007b";
    var elementCount = elements_per_palette_object[selected_color];
    var axis = new THREE.Vector3(0, 1, 0);
    var rot_axis = new THREE.Vector3(1, 0, 0);
    var distance = 0.5;

    for (let i = 0; i < elementCount; i++) {
      imeshes_object[selected_color].getMatrixAt(i, mat4); // mat4 will contain the current transform matrix of the instance
      mat4.decompose(dummy.position, dummy.quaternion, dummy.scale); // map mat4 matrix onto our dummy object

      // START all element transformations here
      dummy.translateOnAxis(axis, distance);

      if (dummy.position.y > 500) {
        dummy.position.set(dummy.position.x, -500, dummy.position.z + 20);
      }

      //dummy.rotateOnWorldAxis(rot_axis, Math.PI/50);

      // END element transformations here

      dummy.updateMatrix();
      imeshes_object[selected_color].setMatrixAt(i, dummy.matrix);
    }
    imeshes_object[selected_color].instanceMatrix.needsUpdate = true;

  }

  // RUN FOR ANIMATION
  //var denseMatterIntervallInstance = setInterval(function () {update_dense_matter()}, 20);






  setTimeout(function ()  {
    setInterval(function () {
      start_timer = new Date().getTime()

      if (base_light_angle_step != Math.abs(light_angle_step)) { //if step changed update step
        //console.log(base_light_angle_step, Math.abs(light_angle_step));
        if (getKeyByValue(light_step_size_param, base_light_angle_step) == "DaySync") { //light_step_size_param.DaySync
          arc_division = base_light_angle_step*1000/light_framerate;
          //console.log("Arc Division Factor: " + arc_division.toString())
          if (light_angle_step == 0) {
            light_angle_step = base_light_angle_step;
          } else {
            light_angle_step = Math.sign(light_angle_step)*base_light_angle_step;
          }

          //console.log("After", Math.sign(light_angle_step) ,base_light_angle_step)
        } else {
          arc_division = 1.0;
          if (light_angle_step == 0) {
            light_angle_step = base_light_angle_step;
          } else {
            light_angle_step = Math.sign(light_angle_step)*base_light_angle_step;//use new amplitude with same sign, avoids another if statement
          }
        }
      }

      if (light_framerate != light_framerate_change) {
        clearInterval(lightIntervalInstance); //remove previous interval
        if (getKeyByValue(light_step_size_param, Math.abs(light_angle_step)) == "DaySync") { //light_step_size_param.DaySync
          arc_division = Math.abs(light_angle_step)*1000/light_framerate;
          console.log("Arc Division Factor: " + arc_division.toString())

        } else { arc_division = 1.0; }//Update light step as well if framerate is changed and
        light_framerate = light_framerate_change;
        //STATICLIGHT//lightIntervalInstance = setInterval(function () {update_light_position()}, light_framerate); //create new interval with updated framerate
      }


      if (debug) {
        var end_timer = new Date().getTime();
        pre_calc = (end_timer - start_timer);
      }

      if (debug) {
        end_timer = new Date().getTime();
        viz_update =  (end_timer - start_timer - pre_calc);
      }

      ticker += parallex_step; //parallex_step;

      for (var i = 0; i < stage; i++) {
        ticker_set[i] += steps[i];
      }

    }, parallex_framerate);
  }, parallex_delay)


  view.addDenseMatter(); // dense grid of colored elements

  //view.addInstances();
  //view.addStarsOrdered(); // ordered stars based on lattice nodes from nDatas
  view.addStarsRandom(random_starfield_bounds, nr_of_random_stars); // random stars - parameters > (bounds, quantity)
  view.addStarDust(); // star dust (made with random walk algorithm)
  view.addMoon(); // adds a large glowing moon with few shiny stars around


  view.render();


  // remove loading screen once the app is loaded to this point and min_loading_time has elapsed
  var loading_end_time = new Date().getTime();
  var loading_time = loading_end_time - loading_start_time;
  if (loading_time > min_loading_time) {
    for (i = 0; i < 21; i++) {
      let k = i; // we need to do this because: https://codehandbook.org/understanding-settimeout-inside-for-loop-in-javascript/
      setTimeout(function () {document.querySelector("#loading").style.opacity = 1.00 - k * 0.05;}, 100 * k);
    }
    setTimeout(function () {document.querySelector("#loading").style.display = "none";}, 2000);
  } else {
    for (i = 0; i < 21; i++) {
      let k = i; // we need to do this because: https://codehandbook.org/understanding-settimeout-inside-for-loop-in-javascript/
      setTimeout(function () {document.querySelector("#loading").style.opacity = 1.00 - k * 0.05;}, min_loading_time - loading_time + 100 * k);
    }
    setTimeout(function () {document.querySelector("#loading").style.display = "none";}, min_loading_time - loading_time + 2000);
  }
  setTimeout(function () {fxpreview();}, min_loading_time+3000)

  function onWindowResize() {
    //console.log("resize")
    viewportAdjust(document.getElementById('viewport'), false);
    fitCameraToViewport(view, viewportWidth, viewportHeight);
    }

    window.addEventListener( 'resize', onWindowResize );
}

function obscvrvm () {
  controller = new Controller('viewport');
}


function viewportAdjust(vp, inner=true) {
  ///ADJUST SIZE AND MARGIN
  if (inner) {
    if (window.innerWidth/aspect_ratio>window.innerHeight) { //If target viewport height is larger then inner height

      viewportHeight = window.innerHeight; //Force Height to be inner Height
      viewportWidth = aspect_ratio*window.innerHeight;  //Scale width proportionally

      margin_top = 0;
      margin_left = (window.innerWidth - viewportWidth)/2;
    } else {  //If target viewport width is larger then inner width

      viewportHeight = window.innerWidth/aspect_ratio; //Scale viewport height proportionally
      viewportWidth = window.innerWidth; //Force Width  to be inner Height

      margin_top = (window.innerHeight - viewportHeight)/2;
      margin_left = 0;


    }

    ///SCALING
    cam_factor_mod = cam_factor * Math.min((viewportWidth/1000)*quality, (viewportHeight/1000)*quality);

  } else {
    if (window.innerWidth/aspect_ratio>window.innerHeight) { //If target viewport height is larger then inner height

      //document.documentElement.scrollWidth/scrollHeight
      viewportHeight = window.innerHeight; //Force Height to be inner Height
      viewportWidth = aspect_ratio*window.innerHeight;  //Scale width proportionally

      margin_top = 0;
      margin_left = (window.innerWidth - viewportWidth)/2;
    } else {  //If target viewport width is larger then inner width

      viewportHeight = window.innerWidth/aspect_ratio; //Scale viewport height proportionally
      viewportWidth = window.innerWidth; //Force Width  to be inner Height

      margin_top = (window.innerHeight - viewportHeight)/2;
      margin_left = 0;

    }

    ///SCALING
    cam_factor_mod = cam_factor * Math.min(viewportWidth/1000, viewportHeight/1000);
  }
  vp.style.marginTop=margin_top+'px';
  vp.style.marginLeft=margin_left+'px';

}

function fitCameraToViewport(view_instance, w,h, adjust=true) {
  view_instance.renderer.setSize( w, h);
  view_instance.composer.setSize( w, h);
  //view_instance.camera.aspect = w / h;
  if (adjust) {
    view_instance.camera.left = -w / cam_factor_mod;
    view_instance.camera.right = w / cam_factor_mod;
    view_instance.camera.top = h / cam_factor_mod;
    view_instance.camera.bottom = -h / cam_factor_mod;
  }

  view_instance.camera.updateProjectionMatrix();
}


function capturer_custom_save() {
  setTimeout(() => {
    capturer.save(function( blob ) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `collectionfive_${parseInt(Math.random()*10000000)}.gif`;
      a.click();
      URL.revokeObjectURL(url);
      });
      setTimeout(() => {
        capturer = null; //Set capturer back to null after download
      }, 250);
    }, 0);
}

function check_drawing_buffer(q) {
  const max_side = 5500; // looks like the max buffer for Chrome on desktop is 5760, so we take a bit lower to be safe
  //console.log(window.devicePixelRatio)
  var taget_size = q*Math.max(viewportWidth, viewportHeight);
  if (taget_size > max_side) {
    var reduced_quality = q*max_side/taget_size;
    console.log("Browser drawing buffer exceed. Reverting to the following quality multiplier: " + reduced_quality.toFixed(2).toString());
    return reduced_quality;
  } else {
    return q
  }
}

// define a handler
function doc_keyUp(e) {
  // Example double key use: e.ctrlKey && e.key === 'ArrowDown'
  // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
  if (e.keyCode === 49 || e.keyCode === 97) { // 1 or NumPad 1
    snap = true;
    quality = 1;
  } else if (e.keyCode === 50 || e.keyCode === 98) {// 2 or NumPad 2
    snap = true;
    quality = check_drawing_buffer(2);
  } else if (e.keyCode === 51 || e.keyCode === 99) {// 3 or NumPad 3
    snap = true;
    quality = check_drawing_buffer(3);
  } else if (e.keyCode === 52 || e.keyCode === 100) { // 4 or NumPad 4
    snap = true;
    quality = check_drawing_buffer(4);
  } else if (e.keyCode === 53 || e.keyCode === 101) { // 5 or NumPad 5
    snap = true;
    quality = check_drawing_buffer(5);
  } else if (e.keyCode === 71 ) {  //"g" = Gif
    recording = !recording;
    if(recording){
      //new capturer instance
      capturer = new CCapture( {
        verbose: false,
        display: false,
        //quality: 99,
        //name: variant_name,
        //framerate:,
        //autoSaveTime:, //does not work for gif
        //timeLimit: 10000,
        format: 'gif',
        workersPath: 'js/capture/src/'
      } );
      capturer.start();
      setTimeout(() => {
        if (capturer != null) {
          capturer.stop();
          capturer_custom_save();
        }
      },5000)
    }
    else if (capturer != null) { //If capturer in ongoing and button press the "g" button again
      capturer.stop();
      capturer_custom_save();

    }
  } else if (e.keyCode === 70 ) {  //"f" = increment light travel framerate
    light_framerate_change = findNextValueByValue(light_framerate_change, light_frame_speed_param)
    console.log("light framerate changed to: " + getKeyByValue(light_frame_speed_param, light_framerate_change))
  } else if (e.keyCode === 84 ) {  //"t" = increase travel speed
    base_light_angle_step = findNextValueByValue(base_light_angle_step, light_step_size_param)
    console.log("light angle step changed to: " + getKeyByValue(light_step_size_param, base_light_angle_step))
  } else if (e.keyCode === 65 ) {  //"a" = jump light angle by 30 degrees
    light_angle += Math.PI/6; //advance light angle by 30deg
    console.log("Skipped 30degrees")
  } else if (e.keyCode === 66 ) {  //"b" = flip background from black to white
    background_toggle = !background_toggle;
    if (background_toggle) {
      document.body.style.backgroundColor = "black";
      console.log("Background: black")
    } else {
      document.body.style.backgroundColor = "white";
      console.log("Background: white")
    }

  }
  else if (e.keyCode === 73 && !e.ctrlKey) {  //i and not ctrl
    document.getElementById("keybinding").style.display = "block";
    document.querySelector("#keybinding").style.opacity = 1
    //Load modal with decription for all the keys for few
    //seconds and make it fade to invisible after a few seconds.
    //Each additional non active key press restarts the fade out animation
    if (typeof fade !== 'undefined') {
      clearInterval(fade)
      };
    var fade;
    setTimeout(function() {
      fade = setInterval(function () {
        document.querySelector("#keybinding").style.opacity -= 0.025;
        if (document.querySelector("#keybinding").style.opacity <= 0 ) {
          document.querySelector("#keybinding").style.display = "none";
          clearInterval(fade)
        }
      }, 100);
    },3000);
  }
}

const handler = (e) => {
    obscvrvm();
};

const capture = (contx) => {
  ///DOCSIZE
  document.documentElement.scrollWidth = viewportWidth*quality;
  document.documentElement.scrollHeight = viewportHeight*quality;
  ///SCALING
  cam_factor_mod = cam_factor * Math.min(viewportWidth*quality/1000, viewportHeight*quality/1000);
  ///SetMargin to 0
  document.getElementById('viewport').style.marginTop=0 +'px';
  document.getElementById('viewport').style.marginLeft=0 +'px';
  fitCameraToViewport(contx.view, viewportWidth*quality, viewportHeight*quality, true); //Projection Matrix Updated here

  composer.render();

  try {
    const urlBase64 = renderer.domElement.toDataURL('img/png');
    const a = document.createElement("a");
    a.href = urlBase64;
    a.download = `collectionfive_${palette_name}_${parseInt(Math.random()*10000000)}.png`;
    a.click();
    URL.revokeObjectURL(urlBase64);
  }
  catch(e) {
    console.log("Browser does not support taking screenshot of 3d context");
    return;
  }
  // Set to standard quality
  quality = 1;

  viewportAdjust(document.getElementById('viewport'))
  cam_factor_mod = cam_factor * Math.min(viewportWidth*quality/1000, viewportHeight*quality/1000);

  fitCameraToViewport(contx.view, viewportWidth, viewportHeight); //Projection Matrix Updated

  composer.render();
};

// register the capture key handler
document.addEventListener('keyup', doc_keyUp, false);

document.addEventListener('DOMContentLoaded', () => {
  handler();
});
