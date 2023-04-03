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


          T E C T O N I C A  |  { p r o t o c e l l : l a b s }  |  2 0 2 3
*/



var dense_matter_object = {}; // grid coordinates are the key, dense matter data is the value
var elements_per_palette_object = {}; // color is the key, nr of elements is the value
var imesh_index_tracker = {}; // color is the key, index nr is the value
var imeshes_object = {}; // color is the key, imesh is the value




//////FXHASH FEATURES//////

$fx.features({
  "Pigments": pigments,
  "Palette": palette_name,
  "Pattern": pattern,
  "Dimension": dimension_type,
  "Structure": noise_feature,
  "Form": noise_form,
  "Dissipation": noise_cull_rule,
  "Attachment": attachment_type,
  "Exploded": exploded
});

console.log('%cTOKEN FEATURES', 'color: white; background: #000000;', '\n',
            'Pigments -> ' + pigments, '\n',
            'Palette -> ' + palette_name, '\n',
            'Pattern -> ' + pattern, '\n',
            'Dimension -> ' + dimension_type, '\n',
            'Structure -> ' + noise_feature, '\n',
            'Form -> ' + noise_form, '\n',
            'Dissipation -> ' + noise_cull_rule, '\n',
            'Attachment -> ' + attachment_type, '\n',
            'Exploded -> ' + exploded, '\n');

/*window.$fxhashFeatures = {
  'Dimension': feature_dimension,
  'Frame': feature_frame,
  'Primitive': feature_primitive,
  'State': feature_state,
  'Celestial': feature_celestial
};*/



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
    var material = new THREE.MeshPhongMaterial( {flatShading: true} ); //THREE.MeshBasicMaterial( {color: 0xff0000} ); THREE.MeshNormalMaterial();
    
    //KEDIT
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

    //KEDIT
    var instanceColors = [];
    for(var i = 0; i < imesh.count; i++){
      instanceColors.push(geometry_color.r);
      instanceColors.push(geometry_color.g);
      instanceColors.push(geometry_color.b);
    }
    var instanceColorsBase = new Float32Array(instanceColors.length);
    instanceColorsBase.set(instanceColors);
    geometry.setAttribute( 'instanceColor', new THREE.InstancedBufferAttribute( new Float32Array( instanceColors ), 3 ) );
    geometry.setAttribute( 'instanceColorBase', new THREE.BufferAttribute(new Float32Array( instanceColorsBase ), 3 ) );

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

    if (dense_matter_element['smooth'] == false) {var rot_jitter_factors = [0.25 * jitter_reduction, 0.15 * jitter_reduction];} // rotation jitter will be applied
    //if (dense_matter_element['smooth'] == false) {var rot_jitter_factors = [0.12, 0.07];} // rotation jitter will be applied
    else {var rot_jitter_factors = [0, 0];} // rotation jitter will NOT be applied - we will get a smooth and shiny surface

    dummy.rotateY(Math.PI * 0.28 + (gene() - 0.5) * rot_jitter_factors[0]); // rotate member around its axis to align with the grid, plus a random jitter (Math.PI * 0.28 + (gene() - 0.5) * 0.25)
    dummy.rotateOnWorldAxis(axis_x, (gene() - 0.5) * rot_jitter_factors[1]); // add a slight random rotation jitter around the X axis



    //// EXPLODING ELEMENTS ////

    if (exploded) {

      // calculate explosion parameters for each element
      var strength_perturbance = gene_range(0.5, 1.0); // explosion strength will be randomly modified by this factor
      var direction_perturbance = new THREE.Vector3(gene_range(-1, 1), gene_range(-1, 1), gene_range(-1, 1)).multiplyScalar(0.2); // explosion direction will be randomly modified by this vector
      var explosion_axis = new THREE.Vector3().subVectors(element_position, explosion_center_a).normalize().add(direction_perturbance);
      var dist_to_cent_a = element_position.distanceTo(explosion_center_a);

      // apply explosion offset and random rotation for exploded elements
      dummy.translateOnAxis(explosion_axis, strength_perturbance * explosion_strength / Math.pow(dist_to_cent_a, 2));
      dummy.rotateX(explosion_strength * explosion_rot_factor * (gene() * explosion_rot_range * 2 - explosion_rot_range) / Math.pow(dist_to_cent_a, 3));
      dummy.rotateY(explosion_strength * explosion_rot_factor * (gene() * explosion_rot_range * 2 - explosion_rot_range) / Math.pow(dist_to_cent_a, 3));
      dummy.rotateZ(explosion_strength * explosion_rot_factor * (gene() * explosion_rot_range * 2 - explosion_rot_range) / Math.pow(dist_to_cent_a, 3));
    
    }
    //// END EXPLOSION PART ////




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
  const total_width = c_xy_scale*grid_nr_x
  //const sigmoid_amplitude = 0.05;

  setInterval(function () {

    if(cycleTime<=flickerDuration){ //During State Change
      var k=0;
      var stateChangeProb = cycleTime/flickerDuration;
      //console.log(stateChangeProb);
      for (const [element_color, imeshx] of Object.entries(imeshes_object)) {
        var selectedColor;

        //var test = [0,0]
        for (let i=0; i<imeshx.count; i++){
          
          let matrix = new THREE.Matrix4()
          sceneMeshes[k].getMatrixAt(i, matrix)  //X is index 12,

          //let tempObj = new THREE.Object3D()
          //matrix.decompose(tempObj.position, tempObj.quaternion, tempObj.scale)
          //console.log(tempObj.position.x)

          var prop = matrix.elements[12]/total_width;

          //Check Bounds
          /*
          if (test[0]==0 & test[1]==0) {
            test = [prop,prop]
          }

          if (prop>test[1]) {
            test[1] = prop
          } else {
            if (prop<test[0]) {
              test[0]= prop
            }
          }*/
          
          var xMod = prop+0.5 //X position modifier. 
          xMod = xMod*(1-stateChangeProb) //For a full transition the stateChange Prob needs to take over
          //console.log(xMod);
          if (stateChangeProb-xMod > gene()){
            selectedColor = copyPalette[k]; //Update State with shifted palette
          } else {
            selectedColor = chosen_palette_array[k]; //Recede State
          }
          sceneMeshes[k].geometry.attributes.instanceColor.setXYZ(i, selectedColor.r, selectedColor.g, selectedColor.b);
        };
        //console.log(test)

        //imeshx.instanceMatrix.needsUpdate = true;
        var sigmoidValue = sigmoid(cycleTime-flickerDuration/2,500)+0.08; //non linear activation
        if (sigmoidValue > gene()){
        ////if (stateChangeProb > gene()){
          selectedColor = copyPalette[k]; //Update State with shifted palette
        } else {
          selectedColor = chosen_palette_array[k]; //Recede State
        }
        sceneMeshes[k].geometry.attributes.instanceColor.needsUpdate = true;
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

  // define moon parameters
  radius_moon_x = gene_range(5, 50);
  radius_moon_y = radius_moon_x;
  cent_moon_x = gene_range(-100, 100);
  cent_moon_y = gene_range(-100, 100);

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



  view.addDenseMatter(); // dense grid of colored elements

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
      a.download = `tectonica_${parseInt(Math.random()*10000000)}.gif`;
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
    a.download = `tectonica_${palette_name}_${parseInt(Math.random()*10000000)}.png`;
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
