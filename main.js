/*

__/\\\\\\\\\\\\\\\__/\\\\\\\\\\\\\\\________/\\\\\\\\\__/\\\\\\\\\\\\\\\_______/\\\\\_______/\\\\\_____/\\\__/\\\\\\\\\\\________/\\\\\\\\\_____/\\\\\\\\\____        
 _\///////\\\/////__\/\\\///////////______/\\\////////__\///////\\\/////______/\\\///\\\____\/\\\\\\___\/\\\_\/////\\\///______/\\\////////____/\\\\\\\\\\\\\__       
  _______\/\\\_______\/\\\_______________/\\\/_________________\/\\\_________/\\\/__\///\\\__\/\\\/\\\__\/\\\_____\/\\\_______/\\\/____________/\\\/////////\\\_      
   _______\/\\\_______\/\\\\\\\\\\\______/\\\___________________\/\\\________/\\\______\//\\\_\/\\\//\\\_\/\\\_____\/\\\______/\\\_____________\/\\\_______\/\\\_     
    _______\/\\\_______\/\\\///////______\/\\\___________________\/\\\_______\/\\\_______\/\\\_\/\\\\//\\\\/\\\_____\/\\\_____\/\\\_____________\/\\\\\\\\\\\\\\\_    
     _______\/\\\_______\/\\\_____________\//\\\__________________\/\\\_______\//\\\______/\\\__\/\\\_\//\\\/\\\_____\/\\\_____\//\\\____________\/\\\/////////\\\_   
      _______\/\\\_______\/\\\______________\///\\\________________\/\\\________\///\\\__/\\\____\/\\\__\//\\\\\\_____\/\\\______\///\\\__________\/\\\_______\/\\\_  
       _______\/\\\_______\/\\\\\\\\\\\\\\\____\////\\\\\\\\\_______\/\\\__________\///\\\\\/_____\/\\\___\//\\\\\__/\\\\\\\\\\\____\////\\\\\\\\\_\/\\\_______\/\\\_ 
        _______\///________\///////////////________\/////////________\///_____________\/////_______\///_____\/////__\///////////________\/////////__\///________\///__


          T E C T O N I C A  |  { p r o t o c e l l : l a b s }  |  2 0 2 4
*/


var dense_matter_memory = {}; // memory object that has a key timestamp and matrix value
var dense_matter_object = {}; // grid coordinates are the key, dense matter data is the value
var elements_per_palette_object = {}; // color is the key, nr of elements is the value
var imesh_index_tracker = {}; // color is the key, index nr is the value
var imeshes_object = {}; // color is the key, imesh is the value
var animation_frametime = 0;
var animation_direction = true;
var animation_initiated = false;
var animation_center_comm = false;
var gif_frame_n = 10;
var explosion_state_t = null;
var palette_state_t = null;


// animation Settings
const nDecimal = 10;
const animation_time = 2; // in seconds, originally 1 sec
const animation_increment = 0.1;
var color_animation = true;

//////FXHASH FEATURES//////

$fx.features({
  "seed": seed,
  "triptych": triptych,
  "pigments": pigments,
  "palette": palette_name,
  "pattern": pattern,
  "dimension": dimension_type,
  "structure": noise_feature,
  "form": noise_form,
  "dissipation": noise_cull_rule,
  "attachment": attachment_type
});



//////CONSOLE LOG//////

console.clear(); // clear the console at the beginning

var tectonica_logo =  "%c                                                                           \n"
                    + "%c     T E C T O N I C A  |  { p r o t o c e l l : l a b s }  |  2 0 2 4     \n"
                    + "%c                                                                           \n";

console.log( tectonica_logo,
            `color: white; background: ${chosen_palette[0]}; font-weight: bold; font-family: "Courier New", monospace;`,
            `color: white; background: ${chosen_palette[1]}; font-weight: bold; font-family: "Courier New", monospace;`,
            `color: white; background: ${chosen_palette[2]}; font-weight: bold; font-family: "Courier New", monospace;`);

console.log("%c    %c    %c    %c    %c    %c    %c    %c    %c    %c    ",
            `color: white; background: ${chosen_palette[0]};`,
            `color: white; background: ${chosen_palette[1]};`,
            `color: white; background: ${chosen_palette[2]};`,
            `color: white; background: ${chosen_palette[3]};`,
            `color: white; background: ${chosen_palette[4]};`,
            `color: white; background: ${chosen_palette[5]};`,
            `color: white; background: ${chosen_palette[6]};`,
            `color: white; background: ${chosen_palette[7]};`,
            `color: white; background: ${chosen_palette[8]};`,
            `color: white; background: ${chosen_palette[9]};`); // overprinting in case there are up to 10 colors (undefined is returned in case the color doesn't exist)

console.log('%c TOKEN FEATURES ', 'color: white; background: #000000;', '\n',
            'seed -> ' + seed,  '\n',
            'triptych -> ' + triptych,   '\n',
            'pigments -> ' + pigments, '\n',
            'palette -> ' + palette_name, '\n',
            'pattern -> ' + pattern, '\n',
            'dimension -> ' + dimension_type, '\n',
            'structure -> ' + noise_feature, '\n',
            'form -> ' + noise_form, '\n',
            'dissipation -> ' + noise_cull_rule, '\n',
            'attachment -> ' + attachment_type, '\n');

console.log('%c CONTROLS ', 'color: white; background: #000000;', '\n',
            'click      : explode/unexplode', '\n',
            'click hold',   '\n',
            '   or      : new explosion center  ', '\n',
            'E + click   ', '\n',
            'P          : pause/unpause palette cycle', '\n',
            'B          : white/black background', '\n',
            'S          : download loader', '\n',
            'G          : gif capture + explode', '\n',
            '1-5        : png capture 1-5x res', '\n');

console.log('%c URL PARAMS ', 'color: white; background: #000000;', '\n',
            'shadow -> int n^2, shadow map resolution', '\n',
            'explosion -> float [0,1], fixes explosion state', '\n',
            'palette -> int, fixes palette cycle', '\n',
            'gif -> int, number of gif frames', '\n\n',
            'example (add this to the URL):', '\n',
            '?shadow=4096&explosion=0.5&palette=0&gif=10', '\n');

//////END CONSOLE LOG//////


var composer_pass = 0.00000;

///VIEWPORT SETUP///

var viewport = document.getElementById("viewport");
var margin_left = 0;
var margin_top = 0;
var viewportHeight;
var viewportWidth;

var background_toggle = false;

var controller;

var renderer = new THREE.WebGLRenderer({antialias: false, alpha: true, preserveDrawingBuffer: true}); //antialias: true

renderer.toneMapping = THREE.LinearToneMapping ; // default is THREE.NoToneMapping, other options: LinearToneMapping, ReinhardToneMapping, CineonToneMapping, ACESFilmicToneMapping...
renderer.toneMappingExposure = 10; // default is 1

const composer = new THREE.EffectComposer(renderer);
let snap = false;
let quality = 0;
let standard_quality = 1.0; // 2.0, 4.0
quality = standard_quality; // set the current quality to standard
let shadermult = 1.0; // 1.0 looks the best, better bluring of lines
var capturer = null;
let recording = false;

function View(viewArea) {

  if (window.innerWidth/aspect_ratio>window.innerHeight) { // if target viewport height is larger then inner height

    viewportHeight = window.innerHeight; // force Height to be inner Height
    viewportWidth = aspect_ratio*window.innerHeight;  // scale width proportionally

    margin_top = 0;
    margin_left = (window.innerWidth - viewportWidth)/2;
  } else {  // if target viewport width is larger then inner width

    viewportHeight = window.innerWidth/aspect_ratio; // scale viewport height proportionally
    viewportWidth = window.innerWidth; // force Width  to be inner Height

    margin_top = (window.innerHeight - viewportHeight)/2;
    margin_left = 0;
  }

  viewport.style.marginTop=margin_top+'px';
  viewport.style.marginLeft=margin_left+'px';

  
  
  /// SCALING
  cam_factor_mod = cam_factor * Math.min(viewportWidth/1000, viewportHeight/1000);

  renderer.setSize( viewportWidth*standard_quality, viewportHeight*standard_quality );
  renderer.shadowMap.enabled = true;
  renderer.domElement.id = 'tectonicacanvas';

  viewport.appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  // cam_factor controls the "zoom" when using orthographic camera
  var camera = new THREE.OrthographicCamera( -viewportWidth/cam_factor_mod, viewportWidth/cam_factor_mod, viewportHeight/cam_factor_mod, -viewportHeight/cam_factor_mod, 0, 5000 );

  camera.position.set(0, 0, 2000);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  composer.setSize(viewportWidth*standard_quality, viewportHeight*standard_quality)



  // change scene background to solid color
  scene.background = new THREE.Color('#010102'); // slightly bluish dark sky, before #080808, #020202


  // ADD LIGHTING
  var light = new THREE.DirectionalLight(0xffffff, 1.0); // color, intensity (0.9 before)

  light.position.set(2000, 2000, 750);
  light.castShadow = true;
  light.shadow.camera.near = 1000;
  light.shadow.camera.far = 3500;
  light.shadow.bias = - 0.000222;

  light.shadow.camera.left = - 1000;
  light.shadow.camera.right = 1000;
  light.shadow.camera.top = 1000;
  light.shadow.camera.bottom = - 1000;

  var shadow = 8192; // multiples of 2 -> 8192, 4096, 2048, 1024... - in TECTONICA we use non-square shadow map (shadow x shadow/2 pix)
  var paramsAssigned = false;
  

  // URL PARAMS

  // usage: add this to the url =>    ?shadow=4096&explosion=0.5&palette=3&gif=10
  try {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const shadowString = urlParams.get('shadow');
    try {
      const explosionState = urlParams.get('explosion');
      if (explosionState!=null) {
        explosion_state_t = Math.abs(parseFloat(explosionState));
      }
    } 
    catch (error) {"error in explosion state URL param\nstate should be a float number between 0 and 1"}
    try {
      const paletteState = urlParams.get('palette');
      if (paletteState!=null) {
        palette_state_t = Math.abs(parseInt(paletteState));
      }
    } 
    catch (error) {"error in palette state URL param\npallette needs to be an integer"}
    try {
      const gifFrames = urlParams.get('gif');
      if (gifFrames!=null) {
        gif_frame_n = Math.abs(parseInt(gifFrames));
      }
    } 
    catch (error) {}
    if (shadowString!=null) {
        shadow = Math.abs(parseInt(shadowString));
        paramsAssigned = true;
      }
  } catch (error) {
    //console.log("shadow variable must be a positive integer")
  }

  if (Number.isInteger(shadow) & paramsAssigned) { // if values are overiden by urlParams, for a minimum overide add: & shadow > 2048
    console.log("using custom url parameter for shadow map size: " + shadow.toString())
    light.shadow.mapSize.width = shadow;
    light.shadow.mapSize.height = shadow;
  } else if (Number.isInteger(shadow) & iOS()) { // default on iOS
    light.shadow.mapSize.width = Math.min(shadow, 2048);
    light.shadow.mapSize.height = Math.min(shadow, 2048);
  } else if ((Number.isInteger(shadow) & !iOS())){ // default on desktop
    light.shadow.mapSize.width = Math.max(shadow, 4096);
    light.shadow.mapSize.height = Math.max(shadow/2, 4096);
  } else { // only if there was an error while inputing urlParams
    light.shadow.mapSize.width = 8192;
    light.shadow.mapSize.height = 4096;
  }

  scene.add(light);

  const amblight = new THREE.AmbientLight(0xffffff, 0.015); // 0-1, zero works great for shadows with strong contrast, had it at 0.1 for tectonica during testing
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



  // original order - renderPass, effectFXAA, bloomPass
  // changed the order after we introduced OutputPass

  // renders the scene
  const renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.composer.addPass(renderPass);

  // bloom
  const bloomPass = new THREE.UnrealBloomPass();
  bloomPass.strength = 0.10;
  bloomPass.radius = 0.0;
  bloomPass.threshold = 0.05;
  this.composer.addPass(bloomPass)

  // output pass
  const outputPass = new THREE.OutputPass();
  this.composer.addPass(outputPass);

  // FXAA antialiasing
  effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
  effectFXAA.uniforms['resolution'].value.x = 1 / (viewportWidth * standard_quality * window.devicePixelRatio*shadermult);
  effectFXAA.uniforms['resolution'].value.y = 1 / (viewportHeight * standard_quality * window.devicePixelRatio*shadermult);
  this.composer.addPass(effectFXAA);

}

View.prototype.addDenseMatter = function  () {

  // PARAMETERS

  const allel_color_gradient_quadrants = [
    ["sol", 1], // solid sprinkled
    ["uni", 1], // uniform
    ["ver", 1], // vertical grading
    ["hor", 1], // horizontal grading
    ["wid", 1], // width stack
    ["hei", 1], // height stack
    ["dep", 1] // depth stack
  ];
  
  const allel_quadrant_div = [
    [1.5, 1],
    [1.75, 1],
    [2.0, 1],
    [3.0, 1],
    [4.0, 1]
  ];

  const allel_color_features_vert = [
    ["non", 80], // none
    ["vspa", 5], // vertical stripe sparse
    ["vdas", 5], // vertical stripe dashed
    ["vblo", 5], // vertical stripe blocks
    ["vsol", 5] // vertical stripe solid
  ];
  
  const allel_color_features_horiz = [
    ["non", 85], // none
    ["hdas", 5], // horizontal stripe dashed
    ["hblo", 5], // horizontal stripe blocks
    ["hsol", 5] // horizontal stripe solid
  ];
  
  const allel_noise_scale_x = [
    [0.05, 2],
    [0.10, 1],
    [0.15, 1],
    [0.20, 1]
  ];
  
  const allel_noise_scale_y = [
    [0.10, 1],
    [0.20, 1],
    [0.30, 1],
    [0.40, 1],
    [0.50, 1]
  ];
  
  const allel_noise_scale_z = [
    [0.10, 1],
    [0.20, 1],
    [0.30, 1],
    [0.40, 1],
    [0.50, 1]
  ];

  // profile type, element thickness, element length, number in x (width), number in y (height), number in z (depth)
  const dimensions = {
    "voxel": ["square 1x1", 8, 8, 70, 110, 20], // ["square 1x1", 5, 5, 115, 190, 30], ["square 1x1", 10, 10, 58, 95, 20], ["square 1x1", 8, 8, 72, 120, 15]
    "pin": ["square beam", 5, 25, 115, 37, 30],
    "stick": ["square beam", 5, 50, 115, 20, 30],
    "needle": ["square beam", 2.5, 75, 220, 15, 30],
    "wire": ["square beam", 2.5, 100, 110, 11, 30]
  }

  const attachment_values = {
    "tight": 1,
    "detached": 10,
    "loose": 25,
    "floating": 50
  }

  const cylinder_params = {
    "square beam" : [0.5, 0.5, 1, 4, 1], // here the side length is less than 1.0 as the first parameter is radius
    "square 1x1" : [0.7, 0.7, 1, 4, 1] // first parameter is the radius, which gives us a square with a side close to 1.0
  }


  // pattern parameters
  if (pattern == "noisy") {var color_gradient_default = "uni";}
  if (pattern == "graded") {var color_gradient_default = gene() < 0.5 ? "ver" : "hor";}
  if (pattern == "layered") {var color_gradient_default = gene() < 0.5 ? "sol" : "dep";}
  if (pattern == "stacked") {var color_gradient_default = "hei";}
  if (pattern == "composed") {var color_gradient_default = "sol";} // this one is just a placeholder, patterns for quadrants will be determined separately

  // quadrant parameters
  var quadrants = pattern == "composed" ? true : false; // if the color gradient is "composed", quadrants will be triggered
  var quadrant_div_x = gene_weighted_choice(allel_quadrant_div); // 1.5 - 4.0, controls the vertical division line with QUADRANTS
  var quadrant_div_y = gene_weighted_choice(allel_quadrant_div); // 1.5 - 4.0, controls the horizontal division line with QUADRANTS

  // determines the color grading for each segment of the QUADRANT
  var color_gradient_quadrants = [gene_weighted_choice(allel_color_gradient_quadrants),
                                  gene_weighted_choice(allel_color_gradient_quadrants),
                                  gene_weighted_choice(allel_color_gradient_quadrants),
                                  gene_weighted_choice(allel_color_gradient_quadrants)];
                            
  // jitter parameters
  var jitter_reduction = (dimension_type == "voxel" || dimension_type == "needle") ? 0.5 : 1.0; // if dimension type is "voxel" or "needle" there will be less random jitter of the elements
  if (dimension_type == "wire") {jitter_reduction = 0.75}; // for dimension type "wire" random jitter is set to medium value between min and max
  
  // element and composition dimensions
  var c_type = dimensions[dimension_type][0]; // profile type
  var c_xy_scale = dimensions[dimension_type][1]; // element thickness
  var c_length = dimensions[dimension_type][2]; // element length
  var grid_nr_x = dimensions[dimension_type][3]; // number in x (width)
  var grid_nr_y = dimensions[dimension_type][4]; // number in y (height)
  var grid_nr_z = dimensions[dimension_type][5]; // number in z (depth)
  var y_gap = attachment_values[attachment_type]; // y_gap will depend on the attachment type
  var x_gap = dimension_type == "wire" ? 3.0 : 0; // x_gap is larger for wire dimension, otherwise it's always zero

  // slight additional offset added to center the grid to the screen vertically
  if (dimension_type == "stick") {var extra_offset = 12;}
  else if (dimension_type == "needle" || dimension_type == "wire") {var extra_offset = -10;}
  else {var extra_offset = 0;}

  // left and right triptych pieces also get an additional vertical offset to align better
  if ((triptych == "left") && (dimension_type == "voxel")) {extra_offset -= 5;}
  else if ((triptych == "right") && (dimension_type == "voxel")) {extra_offset += 5;}
  else if ((triptych == "left") && (dimension_type == "pin")) {extra_offset -= 5;}
  else if ((triptych == "right") && (dimension_type == "pin")) {extra_offset += 5;}
  else if ((triptych == "left") && (dimension_type == "stick")) {extra_offset += 20;}
  else if ((triptych == "right") && (dimension_type == "stick")) {extra_offset -= 20;}
  else if ((triptych == "left") && (dimension_type == "needle")) {extra_offset += 20;}
  else if ((triptych == "right") && (dimension_type == "needle")) {extra_offset -= 20;}
  else if ((triptych == "left") && (dimension_type == "wire")) {extra_offset += 20;}
  else if ((triptych == "right") && (dimension_type == "wire")) {extra_offset -= 20;}

  // grid offsets
  var grid_offset_x = -(grid_nr_x * (c_xy_scale + x_gap)) / 2.0;
  var grid_offset_y = extra_offset -(grid_nr_y * (c_length + y_gap)) / 2.0;
  var grid_offset_z = -(grid_nr_z * (c_xy_scale + x_gap)) / 2.0;
  var total_elements_existing = 0; // will be calculated later
  var total_possible_elements = grid_nr_x * grid_nr_y * grid_nr_z;

  // additional color features appearing
  var color_features_vert = gene_weighted_choice(allel_color_features_vert);
  var color_features_horiz = gene_weighted_choice(allel_color_features_horiz);
  var color_features = [color_features_vert, color_features_horiz];

  // stripe parameters
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


  // noise parameters
  var noise_form_scales = noise_form == "expressive" ? [1.0, 1.0] : [0.1, 0.25]; // factors which will scale noise sampling dimensions
  var noise_height_f = c_length/c_xy_scale; // noise height factor

  var noise_scale_x, noise_scale_y, noise_scale_z;
  if (noise_feature == "cracks") {
    noise_scale_x = gene_weighted_choice(allel_noise_scale_x) * noise_form_scales[1];
    noise_scale_y = 0.01 * noise_form_scales[0];
    noise_scale_z = 0.025;

  } else if (noise_feature == "bands") {
    noise_scale_x = 0.01 * noise_form_scales[0];
    noise_scale_y = gene_weighted_choice(allel_noise_scale_y);
    noise_scale_z = 0.05 * noise_form_scales[0];

  } else if (noise_feature == "sheets") {
    noise_scale_x = 0.01 * noise_form_scales[0];
    noise_scale_y = 0.01 * noise_form_scales[0];
    noise_scale_z = gene_weighted_choice(allel_noise_scale_z);

  } else { // in any other case, noise_feature == "unbiased"
    noise_scale_x = 0.01 * noise_form_scales[0];
    noise_scale_y = 0.01 * noise_form_scales[0];
    noise_scale_z = noise_cull_rule == "clean" ? 0.05 : 0.01;
  }

  // triptych type determines the shift in noise pattern so three triptychs can align
  var triptych_shift_x, triptych_shift_y;
  var triptych_shift_amplitude_x = 500 * noise_scale_x / c_xy_scale;
  var triptych_shift_amplitude_y = 125 * noise_scale_y / c_length;

  if (dimension_type == "voxel") {triptych_shift_amplitude_y = 25 * noise_scale_y / c_length;}

  if (triptych == "right") {
    triptych_shift_x = triptych_shift_amplitude_x;
    triptych_shift_y = triptych_shift_amplitude_y;
  } else if (triptych == "left") {
    triptych_shift_x = -triptych_shift_amplitude_x;
    triptych_shift_y = -triptych_shift_amplitude_y;
  } else {
    triptych_shift_x = 0;
    triptych_shift_y = 0;
  }

  // random shift of noise to get a different pattern
  var noise_shift_x = gene_range(-100, 100) + triptych_shift_x;
  var noise_shift_y = gene_range(-100, 100) + triptych_shift_y;
  var noise_shift_z = gene_range(-100, 100);



  // GRID GENERATION

  // use elements_per_palette objects to count nr of elements for each color - we need to know this nr when we create instanced mesh
  for (i in chosen_palette) {
    elements_per_palette_object[chosen_palette[i]] = 0; // for each color we set nr of elements to zero
    imesh_index_tracker[chosen_palette[i]] = 0; // for each color we set the starting index to zero
  }

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
        if ((color_features.includes("vspa")) && (Math.floor(i/stripe_param_a) % stripe_param_b == i % stripe_param_c)) {
          color_gradient = "wid";
          grid_push_z = 0;
          element_smooth = true;
        }

        if ((color_features.includes("vdas")) && (Math.floor(i/stripe_width) % stripe_spacing == stripe_shift)) {
          color_gradient = "wid";
          grid_push_z = shift_sign_vert * 10;
          element_smooth = true;
        }

        if ((color_features.includes("vblo")) && (Math.floor(i/stripe_width) % stripe_spacing == stripe_shift)) {
          color_gradient = "hei";
          grid_push_z = shift_sign_vert * 10;
          element_smooth = true;
        }

        if ((color_features.includes("vsol")) && (Math.floor(i/stripe_width) % stripe_spacing == stripe_shift)) {
          color_gradient = "dep";
          grid_push_z = shift_sign_vert * 10;
          element_smooth = true;
        }

        if ((color_features.includes("hdas")) && (j % stripe_spacing == stripe_shift)) {
          color_gradient = "wid";
          grid_push_z = shift_sign_horiz * 10;
          element_smooth = true;
        }

        if ((color_features.includes("hsol")) && (j % stripe_spacing == stripe_shift)) {
          color_gradient = "hei";
          grid_push_z = shift_sign_horiz * 10;
          element_smooth = true;
        }

        if ((color_features.includes("hblo")) && (j % stripe_spacing == stripe_shift) && ((i % block_spacing > block_spacing/2) && (i % block_spacing <= block_width + block_spacing/2))) {
          color_gradient = "hei";
          grid_push_z = shift_sign_horiz * 10;
          element_smooth = true;
        }


        // probabilities for each palette color, if there are more probabilities than there are colors these will be ignored
        // we can keep this order the same as the colors in chosen_palette are already shuffled
        var palette_probs, ascending_param, descending_param;
        if (color_gradient == "sol") {
          palette_probs = [50, 1, 1, 1, 1, 1, 1, 1, 1, 1];

        } else if (color_gradient == "uni") {
          // skipping of one or two colors adds to color differentiation in depth
          if (chosen_palette.length > 4) {palette_probs = [0, 0, 1, 1, 1, 1, 1, 1, 1, 1];}
          else {palette_probs = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1];}

        } else if (color_gradient == "ver") {
          ascending_param = j;
          descending_param = grid_nr_y - j;
          palette_probs = [ascending_param, descending_param, 1, 1, 1, 1, 1, 1, 1, 1];

        } else if (color_gradient == "hor") {
          ascending_param = i;
          descending_param = grid_nr_x - i;
          palette_probs = [ascending_param, descending_param, 1, 1, 1, 1, 1, 1, 1, 1];

        } else {
          // in this case, palette_probs is not used so we assign it dummy values
          palette_probs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }


        // constructing a dynamic color palette with varying number of colors to which probabilities are assigned
        // palette probabilities are shifted with depth of layers
        var allel_palette_dynamic = [];
        for (var n = 0; n < chosen_palette.length; n++) {
          var shifted_idx = (n + k) % chosen_palette.length;
          allel_palette_dynamic.push([chosen_palette[n], palette_probs[shifted_idx]]); // [palette color, probability]
        }


        // assigning element color according to color_gradient type
        if (color_gradient == "sol" || color_gradient == "uni" || color_gradient == "ver" || color_gradient == "hor" ) {
          var element_color = gene_weighted_choice(allel_palette_dynamic);

        } else if (color_gradient == "wid") {
          var color_index = i % chosen_palette.length;
          var element_color = chosen_palette[color_index];

        } else if (color_gradient == "hei") {
          var color_index = (j + k) % chosen_palette.length;
          var element_color = chosen_palette[color_index];

        } else if (color_gradient == "dep") {
          var color_index = k % chosen_palette.length;
          var element_color = chosen_palette[color_index];

        }


        //// ELEMENT CULL ////

        var noise_value = perlin3D(i * noise_scale_x + noise_shift_x, j * noise_scale_y * noise_height_f + noise_shift_y, k * noise_scale_z + noise_shift_z);

        // probability to cull the element according to noise
        var noise_cull_prob;
        if (noise_cull_rule == "fuzzy") {
          noise_cull_prob = gene();

        } else if (noise_cull_rule == "clean") {
          noise_cull_prob = 0.50;
        }

        // defining conditions for culling the element
        var noise_cull = noise_cull_prob < noise_value; // condition to cull the element according to noise
        var element_exists = !noise_cull; // culling the element


        //// ASSIGNING ELEMENT PROPERTIES ////

        // defining element position
        var element_position = new THREE.Vector3(i * (c_xy_scale + x_gap) + grid_offset_x, j * (c_length + y_gap) + grid_offset_y, k * (c_xy_scale + x_gap) + grid_offset_z + grid_push_z);
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
                                    dist_to_ctr: null,
                                    exp_vectors: null,
                                    str_perturbance: null,
                                    rotation_gene: null,
                                    grid_pos: element_grid_position,
                                    color: element_color,
                                    smooth: element_smooth,
                                    base_matrix: null,
                                    imesh_idx: imesh_idx};
        dense_matter_object[element_grid_position_str] = dense_matter_element;

      }
    }
  }

  // fill up imeshes_object with {color: imesh} pairs, each imesh will have its own color
  for (const [element_color, elements_per_palette] of Object.entries(elements_per_palette_object)) {
    var geometry_color = new THREE.Color(element_color);
    var geometry = new THREE.CylinderGeometry( cylinder_params[c_type][0], cylinder_params[c_type][1], cylinder_params[c_type][2], cylinder_params[c_type][3], cylinder_params[c_type][4], false );
    var material = new THREE.MeshPhongMaterial( {flatShading: true} ); //THREE.MeshBasicMaterial( {color: 0xff0000} ); THREE.MeshNormalMaterial();
    
    // KEDIT
    var colorParsChunk = [
      'attribute vec3 instanceColor;',
      'varying vec3 vInstanceColor;',
      '#include <common>'
    ].join( '\n' );

    var instanceColorChunk = [
      '#include <begin_vertex>',
      '\tvInstanceColor = instanceColor;'
    ].join( '\n' );

    var fragmentParsChunk = [
      'varying vec3 vInstanceColor;',
      '#include <common>'
    ].join( '\n' );

    var colorChunk = [
      'vec4 diffuseColor = vec4( diffuse * vInstanceColor, opacity );'
    ].join( '\n' );

    material.onBeforeCompile = function ( shader ) {

      shader.vertexShader = shader.vertexShader
        .replace( '#include <common>', colorParsChunk )
        .replace( '#include <begin_vertex>', instanceColorChunk );

      shader.fragmentShader = shader.fragmentShader
        .replace( '#include <common>', fragmentParsChunk )
        .replace( 'vec4 diffuseColor = vec4( diffuse, opacity );', colorChunk );

    };
    
    var imesh = new THREE.InstancedMesh(geometry, material, elements_per_palette);

    // KEDIT
    var instanceColors = [];
    for(var i = 0; i < imesh.count; i++){
      instanceColors.push(geometry_color.r);
      instanceColors.push(geometry_color.g);
      instanceColors.push(geometry_color.b);
    }
    var instanceColorsBase = new Float32Array(instanceColors.length);
    instanceColorsBase.set(instanceColors);
    geometry.setAttribute( 'instanceColor', new THREE.InstancedBufferAttribute( new Float32Array( instanceColors ), 3 ) );
    geometry.setAttribute( 'instanceColorBase', new THREE.BufferAttribute( new Float32Array( instanceColorsBase ), 3 ) );

    imeshes_object[element_color] = imesh;
    total_elements_existing += elements_per_palette;
  }


  console.log('%c QUANTITY ', 'color: white; background: #000000;', '\n',
            'Existing elements -> ' + total_elements_existing,  '\n',
            'Density -> ' + Math.round(100 * total_elements_existing / total_possible_elements).toString() + "%",   '\n');

  var axis_z = new THREE.Vector3(0, 0, 1);
  var axis_x = new THREE.Vector3(1, 0, 0);
  var element_axis = new THREE.Vector3(0, 0, 1);

  // iterate through dense_matter_object's keys and values and build instanced meshes for each color
  for (const [key, dense_matter_element] of Object.entries(dense_matter_object)) {
    if (dense_matter_element['exists'] == false) {continue;} // early exit - if the element doesn't exist, don't add it to the imesh

    var dummy = new THREE.Object3D();
    var imesh = imeshes_object[dense_matter_element['color']];

    imesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
    imesh.frustumCulled = false;

    var element_position = dense_matter_element['position'];
    dummy.scale.set(c_xy_scale, c_length, c_xy_scale);
    dummy.quaternion.setFromUnitVectors(axis_z, element_axis.clone().normalize());
    dummy.position.set(element_position.x, element_position.y, element_position.z);

    if (dense_matter_element['smooth'] == false) {var rot_jitter_factors = [0.50 * jitter_reduction, 0.15 * jitter_reduction];} // rotation jitter will be applied - before we had [0.25 * jitter_reduction, 0.15 * jitter_reduction]
    else {var rot_jitter_factors = [0, 0];} // rotation jitter will NOT be applied - we will get a smooth and shiny surface

    dummy.rotateY(Math.PI * 0.28 + (gene() - 0.5) * rot_jitter_factors[0]); // rotate member around its axis to align with the grid, plus a random jitter (Math.PI * 0.28 + (gene() - 0.5) * 0.25)
    dummy.rotateOnWorldAxis(axis_x, (gene() - 0.5) * rot_jitter_factors[1]); // add a slight random rotation jitter around the X axis

    dummy.updateMatrix();
    dense_matter_element['base_matrix'] = dummy.matrix;
    imesh.setMatrixAt(imesh_index_tracker[dense_matter_element['color']], dummy.matrix);

    // add one to the index tracker for the imesh of that color
    imesh_index_tracker[dense_matter_element['color']] += 1;

  }

  View.prototype.DenseMatterCreateExplosionVectors(explosion_center_a); // always create

  // add instance meshes to the scene
  var sceneMeshes = []
  for (const [element_color, imesh] of Object.entries(imeshes_object)) {
      // global rotation of the instanced mesh
      imesh.rotateX(global_rot_x);
      imesh.rotateY(global_rot_y);

      imesh.instanceMatrix.needsUpdate = true;
      // imesh.instanceColor.needsUpdate = true;
      imesh.castShadow = true;
      imesh.receiveShadow = true;
      imesh.name = element_color;
      this.scene.add(imesh);
      sceneMeshes.push(imesh);
  }

  // KEDIT
  var chosen_palette_array = [];

  for(i=0; i<chosen_palette.length; i++){
    var col = new THREE.Color(chosen_palette[i]);
    chosen_palette_array.push(col)
  }
  var copyPalette = shiftArrayCopy(chosen_palette_array);
  var cycleTime = 0;
  const total_width = c_xy_scale*grid_nr_x


  if (palette_state_t == null) {
      setInterval(function () {

          if (color_animation) {
              if (cycleTime <= flickerDuration) { // during state change
                  var k = 0;

                  for (const [element_color, imeshx] of Object.entries(imeshes_object)) {
                      var selectedColor;
                      for (let i = 0; i < imeshx.count; i++) {
                          let matrix = new THREE.Matrix4()
                          sceneMeshes[k].getMatrixAt(i, matrix)  // x is index 12,
                          var prop = matrix.elements[12] / total_width; // normalizing the x/width this leads to -0.5 to 0.5
                          var xMod = prop + 0.5 // xMod is now running from  0=>1
                          var sigmoidValue = 1 - 1.1 * sigmoid((xMod - 3.0 * (cycleTime / cycleDuration) * 1.4 + 0.2), 0.05);
                          if (sigmoidValue > gene()) {   // stateChangeProb-xMod
                              selectedColor = copyPalette[k]; // update state with shifted palette
                          } else {
                              selectedColor = chosen_palette_array[k]; // recede State
                          }
                          sceneMeshes[k].geometry.attributes.instanceColor.setXYZ(i, selectedColor.r, selectedColor.g, selectedColor.b);
                      };

                      sceneMeshes[k].geometry.attributes.instanceColor.needsUpdate = true;
                      //imeshes_object[element_color].material.color = elements_per_palette_object; // change all item colours
                      k++;
                  }
              }// else: state stable

              cycleTime += flickerInterval;

              if (cycleTime >= cycleDuration) {
                  chosen_palette_array = [...copyPalette];
                  copyPalette = shiftArrayCopy(chosen_palette_array);
                  cycleTime = 0;
              }
          }


    }, flickerInterval);

  } else {

    for (let i = 0; i < palette_state_t % copyPalette.length; i++) {
      chosen_palette_array=[...copyPalette];
      copyPalette = shiftArrayCopy(chosen_palette_array);     
      var k=0;
      for (const [element_color, imeshx] of Object.entries(imeshes_object)) {
        var selectedColor;
        for (let i=0; i<imeshx.count; i++){
          
          let matrix = new THREE.Matrix4()
          sceneMeshes[k].getMatrixAt(i, matrix)  
          selectedColor = chosen_palette_array[k]; // recede state
          sceneMeshes[k].geometry.attributes.instanceColor.setXYZ(i, selectedColor.r, selectedColor.g, selectedColor.b);
        };

        sceneMeshes[k].geometry.attributes.instanceColor.needsUpdate = true;
        k++;
      }
    }
  }



}

View.prototype.DenseMatterCreateExplosionVectors = function (cntr_pt) {
  for (const [key, dense_matter_element] of Object.entries(dense_matter_object)) {
    if (dense_matter_element['exists'] == false) {continue;}
    var element_position = dense_matter_element['position'];

    dense_matter_element['rotation_gene'] = {'x':gene(), 'y':gene(), 'z':gene()};
    // calculate explosion parameters for each element
    dense_matter_element['dist_to_ctr'] = element_position.distanceTo(cntr_pt);
    dense_matter_element['str_perturbance'] = gene_range(0.95, 1.0); // explosion strength will be randomly modified by this factor - gene_range(0.5, 1.0)
    var explosion_axis = new THREE.Vector3().subVectors(element_position, cntr_pt).normalize(); // vectors should be computed once per animation, refreshed only when user changes center
    dense_matter_element['exp_vector'] = explosion_axis; 
  }
}

View.prototype.DenseMatterUpdateT = function (t) {
  dense_matter_memory[t] = {}; // holder for element wise objects
  var t_sqrt = Math.sqrt(t); // non-linear movement, explosion slowing down with time (sqrt - square root)
  // apply explosion offset and random rotation for exploded elements
  for (const [key, dense_matter_element] of Object.entries(dense_matter_object)) {
    if (dense_matter_element['exists'] == false) {continue;}
    var dummy = new THREE.Object3D();
    var explosion_axis = dense_matter_element['exp_vector'];
    var dist_to_cent_a = dense_matter_element['dist_to_ctr']; // optimization: does not need to be calculated every time
    dummy.applyMatrix4(dense_matter_element['base_matrix']);
    var strength_perturbance = dense_matter_element['str_perturbance'];
    var rot_perturbance = explosion_rot_factor / dist_to_cent_a; // elements closer to the explosion will rotate more (and end up flying further away)
    dummy.translateOnAxis(explosion_axis, strength_perturbance * t_sqrt * explosion_strength / Math.pow(dist_to_cent_a, 2)); // change this to fixed positions + explosion translations
    dummy.rotateX(t_sqrt * explosion_strength * rot_perturbance * (dense_matter_element['rotation_gene'].x * explosion_rot_range * 2 - explosion_rot_range) / Math.pow(dist_to_cent_a, 3));
    dummy.rotateY(t_sqrt * explosion_strength * rot_perturbance * (dense_matter_element['rotation_gene'].y * explosion_rot_range * 2 - explosion_rot_range) / Math.pow(dist_to_cent_a, 3));
    dummy.rotateZ(t_sqrt * explosion_strength * rot_perturbance * (dense_matter_element['rotation_gene'].z * explosion_rot_range * 2 - explosion_rot_range) / Math.pow(dist_to_cent_a, 3));
    dummy.updateMatrix();
    dense_matter_memory[t][key] = dummy.matrix;
  }
}

View.prototype.DenseMatterUpdateFromMemory = function (t) {
  
  // apply explosion offset and random rotation for exploded elements
  for (const [key, dense_matter_element] of Object.entries(dense_matter_object)) {
    if (dense_matter_element['exists'] == false) {continue;}
    var imesh_idx = dense_matter_element['imesh_idx'];
    var imesh = imeshes_object[dense_matter_element['color']]
    if (dense_matter_memory[t] == undefined) {
      console.log(dense_matter_memory, t);
    }
    imesh.setMatrixAt(imesh_idx, dense_matter_memory[t][key]); // update position 
  }

  // update imeshes
  for (const [key, imesh] of Object.entries(imeshes_object)) {
    imesh.instanceMatrix.needsUpdate = true;
  }
}

View.prototype.addStarsRandom = function (bounds, qty)
{
  var star_plane_distance = -2000; // z coordinate of the plane where stars reside (they also recieve no shadow)

  // one triangle
  const star_vertices = [
    0, 1, 0, // top
    1, 0, 0, // right
    -1, 0, 0 // left
  ];

  const star_face = [ 2, 1, 0 ]; // one face

  // for each triptych part we will have different random stars so we need to assign a different seeded prng
  if (triptych == "left") {
    var gene_stars = gene_t_l;
  } else if (triptych == "right") {
    var gene_stars = gene_t_r;
  } else { // triptych == "middle"
    var gene_stars = gene;
  }
  
  const geometry = new THREE.PolyhedronGeometry(star_vertices, star_face, 0.30, 0); // third parameter is star radius
  geometry.scale(1, 1.5, 1);
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );

  const imesh = new THREE.InstancedMesh(geometry, material, qty);
  imesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame

  for (var i = 0; i < qty; i++) {
    const dummy = new THREE.Object3D();

    var uniscale = 0.5 + gene_stars();
    dummy.scale.set(uniscale,uniscale,uniscale);
    dummy.position.set(gene_stars() * bounds - bounds/2, gene_stars() * bounds - bounds/2,  star_plane_distance);

    dummy.rotateX(gene_stars() * Math.PI/3 - Math.PI/6);
    dummy.rotateY(gene_stars() * Math.PI/3 - Math.PI/6);
    dummy.rotateZ(gene_stars() * Math.PI/3 - Math.PI/6);

    dummy.updateMatrix();
    imesh.setMatrixAt( i, dummy.matrix );
  }

  imesh.instanceMatrix.needsUpdate = true

  this.scene.add(imesh);

}

View.prototype.addStarDust = function ()
{
  var star_plane_distance = -2000; // z coordinate of the plane where stars reside (they also recieve no shadow)

  // one triangle
  const star_vertices = [
    0, 1, 0, // top
    1, 0, 0, // right
    -1, 0, 0 // left
  ];

  const star_face = [ 2, 1, 0 ]; // one face

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

  const geometry = new THREE.PolyhedronGeometry(star_vertices, star_face, 0.30, 0); // third parameter is star radius
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

  this.scene.add(imesh);

}


View.prototype.addMoon = function ()
{
  var radius_moon, cent_moon_x, cent_moon_y, tilt_angle, phase_start, phase_deg, moon_phase, deg_to_next, next_phase;
  var celestial_plane_distance = -1800; // z coordinate of the plane where stars reside (they also recieve no shadow)

  var time = loading_start_time; // this will be continuously updated for every frame later
  var mills_of_day = loading_start_time % 86400000; // how many milliseconds have passed in a day
  var phase_of_day = mills_of_day / 86400000; // how many milliseconds have passed in a day in %

  // define moon parameters
  radius_moon = gene_range(5, 50);
  cent_moon_x = gene_range(-100, 100);
  cent_moon_y = gene_range(-100, 100);
  phase_start = gene_range(-Math.PI, Math.PI) + 2 * Math.PI * phase_of_day; // each part of the day will have a specific time offset, it takes 24h to complete a full moon transition
  tilt_angle = gene_range(-Math.PI/2, Math.PI/2); // rotation axis tilt angle: -+ 90 deg

  phase_deg = ((phase_start + 2 * Math.PI) * (180 / Math.PI)) % 360;

  // determine the name of the moon phase
  if ((phase_deg >= 0) && (phase_deg < 15)) { moon_phase = "🌗 Third Quarter"; deg_to_next = 15 - phase_deg; next_phase = "🌘";}
  else if ((phase_deg >= 15) && (phase_deg < 75))  { moon_phase = "🌘 Waning Crescent"; deg_to_next = 75 - phase_deg; next_phase = "🌑";}
  else if ((phase_deg >= 75) && (phase_deg < 105))  { moon_phase = "🌑 New Moon"; deg_to_next = 105 - phase_deg; next_phase = "🌒";}
  else if ((phase_deg >= 105) && (phase_deg < 165))  { moon_phase = "🌒 Waxing Crescent"; deg_to_next = 165 - phase_deg; next_phase = "🌓";}
  else if ((phase_deg >= 165) && (phase_deg < 195))  { moon_phase = "🌓 First Quarter"; deg_to_next = 195 - phase_deg; next_phase = "🌔";}
  else if ((phase_deg >= 195) && (phase_deg < 255))  { moon_phase = "🌔 Waxing Gibbous"; deg_to_next = 255 - phase_deg; next_phase = "🌕";}
  else if ((phase_deg >= 255) && (phase_deg < 285))  { moon_phase = "🌕 Full Moon"; deg_to_next = 285 - phase_deg; next_phase = "🌖";}
  else if ((phase_deg >= 285) && (phase_deg < 345))  { moon_phase = "🌖 Waning Gibbous"; deg_to_next = 345 - phase_deg; next_phase = "🌗";}
  else if ((phase_deg >= 345) && (phase_deg < 360)) { moon_phase = "🌗 Third Quarter"; deg_to_next = 375 - phase_deg; next_phase = "🌘";} // 375 degrees to the next phase because we have to go over 0 degrees up to 15 again

  // print moon info to the console
  console.log('%c MOON ', 'color: white; background: #000000;', '\n',
            'Phase -> ' + moon_phase,  '\n',
            'Time to ' + next_phase + ' -> ' + Math.floor(deg_to_next * 4) + ' min', '\n');

  // place glowing hemisphere in front of the stars - MOON LIGHT SIDE
  const hemisphere_light = new THREE.SphereGeometry( radius_moon, 64, 32, 0, 2 * Math.PI, 0, Math.PI / 2 ); // last four arguments are phiStart, phiEnd, thetaStart, thetaEnd
  const material_light = new THREE.MeshBasicMaterial( { color: '#ccc5b6' } ); // f9f0de (98% brightness), ccc5b6 (80% brightness) - the goal is to reduce glow from the bloom effect
  const moon_light = new THREE.Mesh( hemisphere_light, material_light );
  moon_light.position.set(cent_moon_x, cent_moon_y, celestial_plane_distance - 100);
  moon_light.rotation.z += Math.PI/2  + tilt_angle;
  moon_light.rotateX(-phase_start); 

  // place dark hemisphere in front of the stars - MOON DARK SIDE
  const hemisphere_dark = new THREE.SphereGeometry( radius_moon, 64, 32, 0, 2 * Math.PI, 0, Math.PI / 2 ); // last four arguments are phiStart, phiEnd, thetaStart, thetaEnd
  const material_dark = new THREE.MeshBasicMaterial( { color: '#010102' } );
  const moon_dark = new THREE.Mesh( hemisphere_dark, material_dark );
  moon_dark.position.set(cent_moon_x, cent_moon_y, celestial_plane_distance - 100);
  moon_dark.rotation.z -= Math.PI / 2 - tilt_angle;
  moon_dark.rotateX(phase_start);

  // rotate moon hemispheres to cycle through moon phases
  // full cycle lasts 24h and is synced with the clock
  setInterval(function () {
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;
    // apply a rotation transform around the mesh object's local frame
    // mesh.rotation.y applies it to the global frame
    moon_light.rotateX(-2 * Math.PI * deltaTime / 86400000); // 86400000 is number of milliseconds in a day
    moon_dark.rotateX(2 * Math.PI * deltaTime / 86400000);
  }, cycleBackgroundUpdate)

  this.scene.add(moon_light);
  this.scene.add(moon_dark);

}


View.prototype.calculateFrames = function () {
  for (let animation_frametime_x = 0; animation_frametime_x < animation_time; animation_frametime_x+=animation_increment) {
    if (animation_frametime_x < animation_time) {
      animation_frametime_x = Math.round(animation_frametime_x * Math.pow(10, nDecimal)) / Math.pow(10, nDecimal);
      View.prototype.DenseMatterUpdateT(animation_frametime_x);
    }
  }
}

View.prototype.preRender = function () {
  // empty cache
  dense_matter_memory = {};

  // cycle frames and pre-calc matrices
  View.prototype.calculateFrames();
}

View.prototype.render = function () {
    animation_frametime = Math.round(animation_frametime * Math.pow(10, nDecimal)) / Math.pow(10, nDecimal);

    if (explosion_state_t != null) {
      animation_frametime = explosion_state_t; // fix explosion t to URL param
    }

    if (animation_frametime < animation_time) {
      
      View.prototype.DenseMatterUpdateFromMemory(animation_frametime);
    }

    if (debug){
      var start_timer = new Date().getTime();
    }

    this.composer.render();

    requestAnimationFrame(this.render.bind(this));

    if (animation_initiated) {
      if (animation_direction){
        if (animation_frametime < animation_time){
          animation_frametime += animation_increment;
        } 
      }
      else {
        if (animation_frametime > 0) {
          animation_frametime -= animation_increment;
        }
      }
    }


    if (debug){
      var end_timer = new Date().getTime();
      composer_pass = end_timer - start_timer
    }
    if(snap) {
      capture(controller);
      snap = false;
    }
    if(recording & capturer!=null) {
      capturer.capture( renderer.domElement );
    }

};

function Controller(viewArea) {
  var view = new View(viewArea);
  view.cam_distance = 700 // 1000 for ortho
  this.view = view; // referenced outside
  
  view.addDenseMatter(); // dense grid of colored elements
  view.addStarsRandom(1000, 15000); // random stars - parameters > (bounds, quantity)
  
  // star dust and the moon appear only in the middle (default) triptych
  if (triptych == "middle") {
    view.addStarDust(); // star dust (made with random walk algorithm)
    view.addMoon(); // adds a large glowing moon with few shiny stars around
  }
  onWindowResize();
  view.preRender();
 

  // remove loading screen once the app is loaded to this point and min_loading_time has elapsed
  var loading_end_time = new Date().getTime();
  var loading_time = loading_end_time - loading_start_time;
  if (loading_time > min_loading_time) {
    for (i = 0; i < 21; i++) {
      let k = i; // we need to do this because: https://codehandbook.org/understanding-settimeout-inside-for-loop-in-javascript/
      setTimeout(function () {document.querySelector("#loading").style.opacity = 1.00 - k * 0.05;}, 100 * k);
    }
    setTimeout(function () {document.querySelector("#loading").style.display = "none";}, 2000);
    view.render();
  } else {
    for (i = 0; i < 21; i++) {
      let k = i; // we need to do this because: https://codehandbook.org/understanding-settimeout-inside-for-loop-in-javascript/
      setTimeout(function () {document.querySelector("#loading").style.opacity = 1.00 - k * 0.05;}, min_loading_time - loading_time + 100 * k);
    }
    setTimeout(function () {document.querySelector("#loading").style.display = "none";}, min_loading_time - loading_time + 2000);
    view.render();
  }
  setTimeout(function () {$fx.preview();}, min_loading_time+3000)

  function onWindowResize() {
    viewportAdjust(document.getElementById('viewport'), false);
    fitCameraToViewport(view, viewportWidth, viewportHeight);
    }

   window.addEventListener( 'resize', onWindowResize );

   const raycaster = new THREE.Raycaster();
   const pointer = new THREE.Vector2();

    function resetClickCenter(event) {
        x = 0;
        y = 0;
        if(event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel'){
            console.log(event)
            var touch = event.touches[0] || event.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (event.type == 'mousedown' || event.type == 'mouseup' || event.type == 'mousemove' || event.type == 'mouseover'|| event.type=='mouseout' || event.type=='mouseenter' || event.type=='mouseleave') {
            x = event.clientX;
            y = event.clientY;
        }
        pointer.x = (x / window.innerWidth) * 2 - 1;
        pointer.y = - (y / window.innerHeight) * 2 + 1;
        console.log("coordinates", "x =", x, "y =", y);
        raycaster.setFromCamera(pointer, view.camera);
        const intersects = raycaster.intersectObjects(view.scene.children, true);

        // randomize explosion power for every click
        explosion_power = gene_range(5, 15); // explosion strength
        explosion_strength = 200000 * explosion_power;

        for (let i = 0; i < intersects.length; i++) {
            intersects[i].point.z = 0; // find the middle plane
            View.prototype.DenseMatterCreateExplosionVectors(intersects[i].point)
            break;
        }

        View.prototype.preRender(); // clear and recalculate frames
    }

    function onPointerDoubleClick(event, trigger_after=false) {
        resetClickCenter(event);
        if (trigger_after) {
          //onPointerClick(event);
          console.log("new explosion center set")
          animation_initiated = true;
        }
    }
    
    function onPointerClick( event ) {

    if (animation_initiated) {

      animation_direction = !animation_direction;
      
      //animation_frametime = 0; // reset animation
      
    } else {
      animation_initiated = true; // this is to start animation the first time, second time it's already set to true
    }
  
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    if (animation_center_comm) {

      resetClickCenter(event);

      animation_center_comm = false; // wait for p to be pressed again
      
    }
    }
  
  function isTouchDevice() {
      return 'ontouchstart' in window        // works on most browsers
          || navigator.maxTouchPoints;       // works on IE10/11 and Surface
  }
  var mouseTimer;
  var touchTimer;
  function mouseDown(event) { 
    if (!isTouchDevice()) {
      //mouseUp();
      //event.preventDefault();
      mouseTimer = window.setTimeout(function () {
        console.log("click hold")
        onPointerDoubleClick(event, true);
        
        },800); // set timeout to fire in 2 seconds when the user presses mouse button down
    }
  }

  function mouseUp(event) { 
    if (!isTouchDevice()) {
      if (mouseTimer) {
        window.clearTimeout(mouseTimer);  // cancel timer when mouse button is released
        console.log("click")
        onPointerClick(event);
      } 
    }
  }

  function touchDown(event) { 
    if (isTouchDevice()) {
    //event.preventDefault();
      touchTimer = window.setTimeout(function () {
      console.log("tap hold")
      onPointerDoubleClick(event, true);
      
      },800); // set timeout to fire in 2 seconds when the user presses mouse button down
    }
  }
  //function touchDownTest(event) {console.log("TDown")}
  //function touchUpTest(event){console.log("TUp")}
  function touchUp(event) { 
    if (isTouchDevice()) {
      if (touchTimer) {
        window.clearTimeout(touchTimer);  // cancel timer when mouse button is released
        console.log("tap")
        onPointerClick(event);
      }  
    }
  }

    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("touchstart", touchDown)
    window.addEventListener("touchend",touchUp);
}

function tectonica () {
  controller = new Controller('viewport');
}

function viewportAdjust(vp, inner=true) {
  /// ADJUST SIZE AND MARGIN
  if (inner) {
    if (window.innerWidth/aspect_ratio>window.innerHeight) { // if target viewport height is larger then inner height

      viewportHeight = window.innerHeight; // force Height to be inner Height
      viewportWidth = aspect_ratio*window.innerHeight;  // scale width proportionally

      margin_top = 0;
      margin_left = (window.innerWidth - viewportWidth)/2;
    } else {  // if target viewport width is larger then inner width

      viewportHeight = window.innerWidth/aspect_ratio; // scale viewport height proportionally
      viewportWidth = window.innerWidth; // force Width to be inner Height

      margin_top = (window.innerHeight - viewportHeight)/2;
      margin_left = 0;
    }

    /// SCALING
    cam_factor_mod = cam_factor * Math.min((viewportWidth/1000)*quality, (viewportHeight/1000)*quality);

  } else {
    if (window.innerWidth/aspect_ratio>window.innerHeight) { // if target viewport height is larger then inner height

      viewportHeight = window.innerHeight; // force Height to be inner Height
      viewportWidth = aspect_ratio*window.innerHeight;  // scale width proportionally

      margin_top = 0;
      margin_left = (window.innerWidth - viewportWidth)/2;
    } else {  // if target viewport width is larger then inner width

      viewportHeight = window.innerWidth/aspect_ratio; // scale viewport height proportionally
      viewportWidth = window.innerWidth; // force Width  to be inner Height

      margin_top = (window.innerHeight - viewportHeight)/2;
      margin_left = 0;

    }

    /// SCALING
    cam_factor_mod = cam_factor * Math.min(viewportWidth/1000, viewportHeight/1000);

  }
  vp.style.marginTop=margin_top+'px';
  vp.style.marginLeft=margin_left+'px';

}

function fitCameraToViewport(view_instance, w,h, adjust=true) {
  view_instance.renderer.setSize( w, h);
  view_instance.composer.setSize( w, h);
  effectFXAA.uniforms['resolution'].value.x = 1 / (w* window.devicePixelRatio*shadermult);
  effectFXAA.uniforms['resolution'].value.y = 1 / (h* window.devicePixelRatio*shadermult);

  if (adjust) {
    view_instance.camera.left = -w / cam_factor_mod;
    view_instance.camera.right = w / cam_factor_mod;
    view_instance.camera.top = h / cam_factor_mod;
    view_instance.camera.bottom = -h / cam_factor_mod;
  }

  view_instance.camera.updateProjectionMatrix();
}


function capturer_custom_save() {
  console.log("saving gif");
  setTimeout(() => {
    capturer.save(function( blob ) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tectonica_${$fx.minter.slice(31)}_${seed.toString().padStart(3,"0")}_${palette_name}_${parseInt(Math.random()*100000)}.gif`;
      a.click();
      URL.revokeObjectURL(url);
      });
      setTimeout(() => {
        capturer = null; // set capturer back to null after download
      }, 250);
    }, 0);
}

function check_drawing_buffer(q) {
  const max_side = 5500; // looks like the max buffer for Chrome on desktop is 5760, so we take a bit lower to be safe
  //console.log(window.devicePixelRatio)
  var taget_size = q*Math.max(viewportWidth, viewportHeight);
  if (taget_size > max_side) {
    var reduced_quality = q*max_side/taget_size;
    console.log("browser drawing buffer exceed, reverting to the following quality multiplier: " + reduced_quality.toFixed(2).toString());
    return reduced_quality;
  } else {
    return q
  }
}

// define a handler
function doc_keyUp(e) {
  // example double key use: e.ctrlKey && e.key === 'ArrowDown'
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
  } else if (e.keyCode === 71 ) {  // "g" = Gif
    recording = !recording;
    
    if(recording){
      
      // new capturer instance
      capturer = new CCapture( {
        verbose: false,
        display: false,
        //quality: 99,
        //name: variant_name,
        framerate: gif_frame_n,
        //autoSaveTime:, //does not work for gif
        //timeLimit: 10000,
        format: 'gif',
        workersPath: 'js/capture/src/'
      } );
        animation_frametime = 0;
        animation_direction = true;
        animation_initiated = true;
      capturer.start();
      setTimeout(() => {
        if (capturer != null) {
          capturer.stop();
          capturer_custom_save();
        }
      },5000)
    }
    else if (capturer != null) { // if capturer in ongoing and button press the "g" button again
      capturer.stop();
      capturer_custom_save();
    }
  } else if (e.keyCode === 66 ) {  // "b" = flip background from black to white
    background_toggle = !background_toggle;
      if (background_toggle) {
          document.body.style.backgroundColor = "white";
          console.log("background: white")

      } else {
          document.body.style.backgroundColor = "black";
          console.log("background: black")

    }
  }
  else if (e.keyCode === 69) { // "e" = reset explosion center
      console.log("pick point for explosion")
      animation_center_comm = true;
  }
  else if (e.keyCode === 80) { // "p" = pause/unpause palette cycle
      color_animation = !color_animation;
  }
}

const handler = (e) => {
    tectonica();
};



const capture = (contx) => {
  /// DOCSIZE
  document.documentElement.scrollWidth = viewportWidth*quality;
  document.documentElement.scrollHeight = viewportHeight*quality;
  /// SCALING
  cam_factor_mod = cam_factor * Math.min(viewportWidth*quality/1000, viewportHeight*quality/1000);
  /// set margin to 0
  document.getElementById('viewport').style.marginTop=0 +'px';
  document.getElementById('viewport').style.marginLeft=0 +'px';
  fitCameraToViewport(contx.view, viewportWidth*quality, viewportHeight*quality, true); // projection matrix updated here

  composer.render();

  try {
    const urlBase64 = renderer.domElement.toDataURL('img/png');
    const a = document.createElement("a");
    a.href = urlBase64;
    a.download = `tectonica_${$fx.minter.slice(31)}_${seed.toString().padStart(3,"0")}_${palette_name}_${parseInt(Math.random()*100000)}.png`;
    a.click();
    URL.revokeObjectURL(urlBase64);
  }
  catch(e) {
    console.log("browser does not support taking screenshot of a 3D context");
    return;
  }
  // set to standard quality
  quality = standard_quality;
  cam_factor_mod = cam_factor * Math.min(viewportWidth*quality/1000, viewportHeight*quality/1000);
  composer.render();

  viewportAdjust(document.getElementById('viewport'), false);
  fitCameraToViewport(contx.view, viewportWidth, viewportHeight);
};


// register the capture key handler
document.addEventListener('keyup', doc_keyUp, false);

document.addEventListener('DOMContentLoaded', () => {
  handler();
});
