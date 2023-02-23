//////PARAMS//////


//Settings
var dynamic_track = false;
var linewidth_scale = 0.00001; // 0.00001, line width to line length ratio
var loading_start_time = new Date().getTime();
var min_loading_time = 1000; // this is the minimum that the loading screen will be shown, in miliseconds
var debug = true;
var cam_factor = 4; //controls the "zoom" when using orthographic camera, default was 4
var cam_factor_mod;



//////COMPOSITION ALLEL DEFINITION//////

const daily_arc_second = 2*Math.PI/86400;

const allel_aspect_ratio = [
  [0.75, 1],
  [1.0, 1],
  [1.5, 1]
];

const allel_frame_type = [
  ['none', 10],
  ['narrow', 50],
  ['dominating', 40]
];

const allel_center_piece_type = [
  ['none', 10],
  ['plane', 15],
  ['triangle', 15],
  ['double_triangle', 5],
  ['tetrahedron', 5],
  ['pentagon', 10],
  ['octahedron', 10],
  ['hexahedron', 10],
  ['dodecahedron', 10],
  ['station_h', 3],
  ['station_t', 3],
  ['station_o', 2],
  ['station_d', 2]
];

// explosion_type
// 0 - no explosion
// 1 - along X axis, more dynamic blast along the axis
// 2 - along X axis, screen center is prioritized, in other places debris stays more in place
// 3 - along Y axis, otherwise same as 1
// 4 - along Y axis, otherwise same as 2
// 5 - in the explosion center A, which is random
// 6 - in the explosion center A and B, which are random but symmetrical
const allel_explosion_type = [
  [0, 70],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 4],
  [6, 10]
];

const allel_light_source_type = [
  ['west', 0],
  ['east', 0],
  ['north', 1],
  ['south', 0]
];

// all celestial types - 'none', 'comet', 'eclipse', 'ultra eclipse', 'moon', 'planet', 'orbit', 'meteor shower', 'quasar', 'nova', 'rapture', 'constellation'
const allel_celestial_object_types = [
  [['none'], 35],
  [['comet'], 5],
  [['eclipse'], 10],
  [['moon'], 10],
  [['planet'], 10],
  [['orbit'], 5],
  [['meteor shower'], 10],
  [['constellation'], 15]
];

const allel_celestial_object_types_explosion = [
  [['none'], 20],
  [['constellation'], 10],
  [['ultra eclipse'], 5],
  [['meteor shower'], 12], [['meteor shower', 'ultra eclipse'], 2], [['meteor shower', 'quasar'], 2], [['meteor shower', 'nova'], 2], [['meteor shower', 'rapture'], 2],
  [['quasar'], 10], [['quasar', 'constellation'], 5],
  [['nova'], 10], [['nova', 'constellation'], 5],
  [['rapture'], 15]
];

const allel_celestial_object_types_empty = [
  [['none'], 10],
  [['comet'], 5], [['comet', 'eclipse'], 2], [['comet', 'moon'], 2], [['comet', 'planet'], 2], [['comet', 'orbit'], 2], [['comet', 'meteor shower'], 2],
  [['eclipse'], 10],
  [['ultra eclipse'], 3],
  [['moon'], 15],
  [['planet'], 5],
  [['orbit'], 5],
  [['meteor shower'], 10], [['meteor shower', 'eclipse'], 2], [['meteor shower', 'moon'], 2], [['meteor shower', 'planet'], 2], [['meteor shower', 'orbit'], 1],
  [['quasar'], 5],
  [['nova'], 5],
  [['rapture'], 5],
  [['constellation'], 5]
];

const allel_celestials_reduced = [
  [['none'], 0],
  [['comet'], 0],
  [['eclipse'], 0],
  [['moon'], 0],
  [['full moon'], 1],
  [['planet'], 0],
  [['meteor shower'], 0],
  [['constellation'], 0]
];


//////LATTICE ALLEL DEFINITION//////

// in OBSCVRVM, it is allel_center_piece_type which determines the central lattice primitive type, so these probabilites don't matter
const allel_primitive = [
  ['plane', 1],
  ['triangle', 1],
  ['tetrahedron', 1],
  ['pentagon', 1],
  ['octahedron', 1],
  ['hexahedron', 1],
  ['dodecahedron', 1],
];

function get_start_bounds(primitive) { 
  var start_bounds;
  if (primitive == 'plane') {start_bounds = 500.0;} // checked
  else if (primitive == 'triangle') {start_bounds = 500.0;} // checked
  else if (primitive == 'tetrahedron') {start_bounds = 500.0;} // checked
  else if (primitive == 'pentagon') {start_bounds = 500.0;} // checked
  else if (primitive == 'octahedron') {start_bounds = 400.0;} // checked
  else if (primitive == 'hexahedron') {start_bounds = 500.0;}  // checked
  else if (primitive == 'dodecahedron') {start_bounds = 400.0;} // sometimes out of bounds
  else if (primitive == 'station_h') {start_bounds = 50.0;}
  else if (primitive == 'station_t') {start_bounds = 50.0;}
  else if (primitive == 'station_o') {start_bounds = 50.0;}
  else if (primitive == 'station_d') {start_bounds = 50.0;}
  return start_bounds
}

function get_allel_stage(primitive) {
    if (primitive == 'plane' || primitive == 'triangle' || primitive == 'tetrahedron' || primitive == 'pentagon' || primitive == 'octahedron') {
    var allel_stage = [
      [5, 20],
      [6, 80]
    ];
    } else if (primitive == 'dodecahedron' || primitive == 'hexahedron' || primitive == 'station_h' || primitive == 'station_t' || primitive == 'station_o' || primitive == 'station_d'){
    var allel_stage = [
      [5, 100],
      [6, 0]
    ];
    }
    return allel_stage
}

function get_double_sided(primitive) {
  var double_sided = gene() < 0.5 ? false : true;
  //if (primitive == 'plane' || primitive == 'triangle' || primitive == 'pentagon') {double_sided = true} // exceptions - only allowed to be double sided
  if (primitive == 'pentagon' || primitive == 'octahedron'|| primitive == 'hexahedron' || primitive == 'dodecahedron' || primitive == 'station_h' || primitive == 'station_t' || primitive == 'station_o' || primitive == 'station_d') {double_sided = false} // exception - only allowed to be single sided
  return double_sided
}

function get_start_rot(primitive) {
  var start_rot = 0; // this parameter is only used with triangle and pentagon primitives
  if (primitive == 'pentagon') {var start_rot = gene() < 0.5 ? -54 : 126;} // in 50% of cases pentagon will be rotated 180 deg
  if (primitive == 'triangle') {var start_rot = gene() < 0.5 ? -30 : 150;} // in 50% of cases triangle will be rotated 180 deg
  return start_rot
}

function get_steps(stage) {
  var steps = [];
  for (var i = 0; i < stage; i++) {
    steps.push(Math.PI/gene_range(50, 200))
  }
  return steps
}

function get_sub_rules(bias) {
  return [gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1]
}

function get_extrude_bounds(primitive) { 
  var extrude_bounds;
  if (primitive == 'plane') {extrude_bounds = 100;}
  else if (primitive == 'triangle') {extrude_bounds = 100;}
  else if (primitive == 'tetrahedron') {extrude_bounds = 50;}
  else if (primitive == 'pentagon') {extrude_bounds = 100;}
  else if (primitive == 'octahedron') {extrude_bounds = 50;}
  else if (primitive == 'hexahedron') {extrude_bounds = 50;}
  else if (primitive == 'dodecahedron') {extrude_bounds = 100;}
  else if (primitive == 'station_h') {extrude_bounds = 25;}
  else if (primitive == 'station_t') {extrude_bounds = 25;}
  else if (primitive == 'station_o') {extrude_bounds = 25;}
  else if (primitive == 'station_d') {extrude_bounds = 25;}
  return extrude_bounds
}

const allel_extrude_bounds = [
  [50, 25],
  [100, 25],
  [200, 50]
];

function get_extrude_face(range, factors) {
  return [gene_range(range[0] * factors[0], range[1] * factors[0]),
          gene_range(range[0] * factors[1], range[1] * factors[1]),
          gene_range(range[0] * factors[2], range[1] * factors[2]),
          gene_range(range[0] * factors[3], range[1] * factors[3]),
          gene_range(range[0] * factors[4], range[1] * factors[4]),
          gene_range(range[0] * factors[5], range[1] * factors[5]),
          gene_range(range[0] * factors[6], range[1] * factors[6]),
          gene_range(range[0] * factors[7], range[1] * factors[7])]
}

function get_contract_middle(range) {
  return [gene_range(range[0], range[1]), 
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1]),
          gene_range(range[0], range[1])]
}

function get_leave_middle(bias) {
  return [gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1,
          gene() < bias ? 0 : 1]
}

const allel_transformation = [
  ['none', 1],    //Stay in original mesh
  ['synchronous', 3],     //All stages transform at the same rate
  ['sequential', 1],    //Each stage waits for the previous to transform
  ['asynchronous',3],   //Each stage has it's own period and speed
  ['temporal',3],  //Transforming over longer period of times
  ['modal',3]  //Transforming with random mutations
  ];

function get_transformation_index(transformation_type) {
  var transformation_index = null
  for (var i = 0; i < allel_transformation.length; i++) {
    if (allel_transformation[i][0] == transformation_type) { transformation_index = i }
  }
  return transformation_index
}

const cylinder_params = {
  'standard' : [0.5, 0.5, 1, 6, 1],
  'square beam' : [0.5, 0.5, 1, 4, 1]
};

// how much is thickness of the member scaled for every stage
const thickness_scale_per_stage = {
  'getting_thinner' : [1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.6, 0.6],
  'moderate_constant' : [5, 5, 5, 5, 5, 5, 5, 5, 5],
  'thick_constant' : [20, 20, 20, 20, 20, 20, 20, 20, 20]
};



//////GENERAL PIECE COMPOSITION CHOOSING//////

// all input parameters are optional, they will be chosen at random if not passed into the function
function generate_composition_params(aspect_ratio, frame_type, center_piece_type, center_piece_factor, explosion_type, light_source_type, celestial_object_types) {

  if (aspect_ratio == undefined) {aspect_ratio = gene_weighted_choice(allel_aspect_ratio);}
  if (frame_type == undefined) {frame_type = gene_weighted_choice(allel_frame_type);}
  if (center_piece_type == undefined) {center_piece_type = gene_weighted_choice(allel_center_piece_type);}
  if (center_piece_factor == undefined) {center_piece_factor = 0.5;} // default scale is 0.5
  if (explosion_type == undefined) {explosion_type = gene_weighted_choice(allel_explosion_type);}
  if (light_source_type == undefined) {light_source_type = gene_weighted_choice(allel_light_source_type);}
  if (celestial_object_types == undefined) {celestial_object_types = gene_weighted_choice(allel_celestial_object_types);}
  
  var explosion_center_a = new THREE.Vector3(gene_range(-200, 200), gene_range(-200, 200), 0);
  var explosion_center_b = new THREE.Vector3(-explosion_center_a.x, -explosion_center_a.y, 0);

  // EXCEPTIONS AND OVER-RIDES
  if (center_piece_type == 'none') {frame_type = 'narrow'; explosion_type = 0;} // we never want to have a completely empty piece, also if frame is empty, there is no explosion
  if (explosion_type != 0) {celestial_object_types = gene_weighted_choice(allel_celestial_object_types_explosion);} // second choice priority for celestial object types
  if (center_piece_type == 'none') {celestial_object_types = gene_weighted_choice(allel_celestial_object_types_empty);} // first choice priority for celestial object types
  if (center_piece_type == 'triangle' && (explosion_type == 1 || explosion_type == 2 || explosion_type == 3 || explosion_type == 4)) {center_piece_factor = 0.75;} // make triangle bigger for horizontal and vertical explosions
  if (center_piece_type == 'triangle' && (explosion_type == 5 || explosion_type == 6)) {center_piece_factor = 0.65;} // make triangle bigger for point explosions
  if (center_piece_type == 'octahedron' && explosion_type != 0) {center_piece_factor = 0.65;} // make octahedron bigger for explosions
  if (center_piece_type == 'tetrahedron' && explosion_type != 0) {center_piece_factor = 0.75;} // make tetrahedron bigger for explosions
  if (center_piece_type == 'dodecahedron' && explosion_type != 0) {center_piece_factor = 0.75;} // make dodecahedron bigger for explosions

  // FXHASH FEATURES DEFINITION
  var feature_dimension
  var feature_frame
  var feature_primitive
  var feature_state
  var feature_celestial

  // 0.75, 1.0, 1.5
  if (aspect_ratio < 1.0) {feature_dimension = 'portrait';}
  else if (aspect_ratio > 1.0) {feature_dimension = 'landscape';}
  else {feature_dimension = 'square';}

  // 'none', 'narrow', 'dominating'
  feature_frame = frame_type;

  // 'none', 'plane', 'triangle', 'double_triangle', 'tetrahedron', 'pentagon', 'octahedron', 'hexahedron', 'dodecahedron', 'station_h', 'station_t', 'station_o', 'station_d'
  if (center_piece_type == 'double_triangle') {feature_primitive = 'star';}
  else if (center_piece_type == 'station_h' || center_piece_type == 'station_t' || center_piece_type == 'station_o' || center_piece_type == 'station_d') {feature_primitive = 'station';}
  else {feature_primitive = center_piece_type;}

  // 0, 1, 2, 3, 4, 5, 6
  if (explosion_type >= 1 && explosion_type <= 4) {feature_state = 'sliced';}
  else if (explosion_type >= 5 && explosion_type <= 6) {feature_state = 'pierced';}
  else {feature_state = 'pristine';}

  // 'none', 'comet', 'eclipse', 'ultra eclipse', 'moon', 'planet', 'orbit', 'meteor shower', 'quasar', 'nova', 'rapture', 'constellation'
  if (celestial_object_types.length == 1) {feature_celestial = celestial_object_types[0];}
  else if (celestial_object_types.length == 2) {feature_celestial = celestial_object_types[0] + ' and ' + celestial_object_types[1];}


  // this object will hold all of our composition parameters which we can unpack when we need them
  var composition_params = {
    aspect_ratio: aspect_ratio,
    frame_type: frame_type,
    center_piece_type: center_piece_type,
    center_piece_factor: center_piece_factor,
    explosion_type: explosion_type,
    light_source_type: light_source_type,
    explosion_center_a: explosion_center_a,
    explosion_center_b: explosion_center_b,
    celestial_object_types: celestial_object_types,
    feature_dimension: feature_dimension,
    feature_frame: feature_frame,
    feature_primitive: feature_primitive,
    feature_state: feature_state,
    feature_celestial: feature_celestial
  }

  return composition_params
}


//////LATTICE PARAMETER CHOOSING//////

// all input parameters are optional, they will be chosen at random if not passed into the function
function generate_lattice_params(type, stage, position) {

  if (type == undefined) {var primitive = gene_weighted_choice(allel_primitive);}
  else {var primitive = type;}

  if (type == 'double_triangle') {primitive = 'triangle';} // draw as single triangle, and handle the second one in main.js

  var start_bounds = get_start_bounds(primitive);
  var deform_type = [1, 1, 1]; /// lattice is not deformed

  if (position == undefined) {var position = new THREE.Vector3(0, 0, 0);}

  if (stage == undefined) {var stage = gene_weighted_choice(get_allel_stage(primitive));}

  var double_sided = get_double_sided(primitive);
  var start_rot = get_start_rot(primitive); // this parameter is only used with triangle and pentagon primitives

  var sub_rules = get_sub_rules(0.5); //bias - how much due the rules weight towards pyramid or tapered (0.5 is equal probability)
  var mod_rules = [1, 1, 1, 1, 1, 1, 1, 1]; // we only draw symmetrical lattices so mod_rules are fixed
  
  var extrude_bounds = get_extrude_bounds(primitive);
  var extrude_face = get_extrude_face([-extrude_bounds, extrude_bounds], [1.0, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25]); // range, factors of range reduction for every stage
  var extrude_face0 = get_extrude_face([-extrude_bounds, extrude_bounds], [1.0, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25]); // range, factors of range reduction for every stage
  var contract_middle = get_contract_middle([0.0, 0.95]); //range between [0, 1] 
  var leave_middle = get_leave_middle(0.5); // bias - weight towards leaving the middle quad vs removing it (0.5 is equal probability)

  var flip_dash = gene() < 0.5 ? false : true; // flip full and dashed lines

  var steps = get_steps(stage);
  var transformation_type = gene_weighted_choice(allel_transformation);
  var transformation_index = get_transformation_index(transformation_type);
  var triangulate = false;


  if (type == 'station_h') {
    primitive = 'hexahedron';
    sub_rules[0] = 1; // force rule tapered for the first iteration
    extrude_face[0] = gene() < 0.75 ? 150 : 1000; // first extrusion will be very large
    contract_middle[0] = gene() < 0.75 ? 0.01 : 0.95; // small contraction of the first face creates long "arms" at the side of the cube
  }

  if (type == 'station_t') {
    primitive = 'tetrahedron';
    sub_rules[0] = 1; // force rule tapered for the first iteration
    extrude_face[0] = gene() < 0.75 ? 200 : 1000; // first extrusion will be very large
    contract_middle[0] = gene() < 0.75 ? 0.01 : 0.95; // small contraction of the first face creates long "arms" at the side of the cube
  }

  if (type == 'station_o') {
    primitive = 'octahedron';
    sub_rules[0] = 1; // force rule tapered for the first iteration
    extrude_face[0] = gene() < 0.75 ? 150 : 1000; // first extrusion will be very large
    contract_middle[0] = gene() < 0.75 ? 0.01 : 0.95; // small contraction of the first face creates long "arms" at the side of the cube
  }

  if (type == 'station_d') {
    primitive = 'dodecahedron';
    sub_rules[0] = 1; // force rule tapered for the first iteration
    extrude_face[0] = gene() < 0.75 ? 200 : 1000; // first extrusion will be very large
    contract_middle[0] = gene() < 0.75 ? 0.01 : 0.95; // small contraction of the first face creates long "arms" at the side of the cube
  }

  // this object will hold all of our lattice parameters which we can unpack when we need them
  var lattice_params = {
    start_bounds: start_bounds,
    primitive: primitive,
    deform_type: deform_type,
    position: position,
    stage: stage,
    double_sided: double_sided,
    start_rot: start_rot,
    sub_rules: sub_rules,
    mod_rules: mod_rules,
    extrude_face: extrude_face,
    extrude_face0, extrude_face0,
    contract_middle: contract_middle,
    leave_middle: leave_middle,
    flip_dash: flip_dash,
    steps: steps,
    transformation_type: transformation_type,
    transformation_index: transformation_index,
    triangulate: triangulate,
  }

  return lattice_params
}



// used only for the frame lattice
function generate_frame_params(stage, frame_type, position) {

  // frame lattice is always a plane primitve
  var primitive = 'plane';
  var start_bounds = get_start_bounds(primitive);

  // canvas aspect ratio will deform the frame lattice so it fits the canvas
  if (aspect_ratio < 1) {
    var deform_type = [1, 1/aspect_ratio, 1];
  } else {
    var deform_type = [1*aspect_ratio, 1, 1];
  }

  if (position == undefined) {var position = new THREE.Vector3(0, 0, 0);}
  else if (frame_type == 'extra_narrow') {var position = new THREE.Vector3(0, 0, 1000);} // this will make the extra narrow frame come in front of the dominating lattice below

  if (stage == undefined) {var stage = gene_weighted_choice(get_allel_stage(primitive));}

  var double_sided = get_double_sided(primitive);
  if (frame_type == 'dominating') {double_sided = gene() < 0.65 ? false : true;} // dominating frame has less chance of being double sided, this will reduce these messy, overpowering lattices

  var start_rot = get_start_rot(primitive); // this parameter is only used with triangle and pentagon primitives

  var sub_rules = get_sub_rules(0.5); //bias - how much due the rules weight towards pyramid or tapered (0.5 is equal probability)
  if ((frame_type == 'narrow') || (frame_type == 'extra_narrow')) {sub_rules[0] = 1;} // force rule tapered for the first iteration

  var mod_rules = [1, 1, 1, 1, 1, 1, 1, 1]; // we only draw symmetrical lattices so mod_rules are fixed

  var extrude_bounds;
  if (frame_type == 'dominating') {extrude_bounds = gene_weighted_choice(allel_extrude_bounds);} // more variety for dominating frame lattice
  else {extrude_bounds = 100;}

  var extrude_face = get_extrude_face([-extrude_bounds, extrude_bounds], [1.0, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25]); // range, factors of range reduction for every stage
  var extrude_face0 = get_extrude_face([-extrude_bounds, extrude_bounds], [1.0, 0.5, 0.5, 0.25, 0.25, 0.25, 0.25, 0.25]); // range, factors of range reduction for every stage
  var contract_middle = get_contract_middle([0.0, 0.95]); //range between [0, 1] 
  if (frame_type == 'narrow') {contract_middle[0] = gene_range(0.05, 0.25);} // force small contraction of the middle face which forms the inside of the frame composition
  else if (frame_type == 'extra_narrow') {contract_middle[0] = gene_range(0.05, 0.10);}

  var leave_middle = get_leave_middle(0.5); // bias - weight towards leaving the middle quad vs removing it (0.5 is equal probability)
  if ((frame_type == 'narrow') || (frame_type == 'extra_narrow')) {leave_middle[0] = 0;} // force removal of the middle face which forms the inside of the frame composition

  var steps = get_steps(stage);
  var transformation_type = gene_weighted_choice(allel_transformation);
  var transformation_index = get_transformation_index(transformation_type);

  // this object will hold all of our lattice parameters which we can unpack when we need them
  var lattice_params = {
    start_bounds: start_bounds,
    primitive: primitive,
    deform_type: deform_type,
    position: position,
    stage: stage,
    double_sided: double_sided,
    start_rot: start_rot,
    sub_rules: sub_rules,
    mod_rules: mod_rules,
    extrude_face: extrude_face,
    extrude_face0, extrude_face0,
    contract_middle: contract_middle,
    leave_middle: leave_middle,
    steps: steps,
    transformation_index: transformation_index
  }

  return lattice_params
}









// all input parameters are optional, they will be chosen at random if not passed into the function
function generate_module_params(position) {

  var start_bounds = 100;
  var primitive = 'hexahedron';
  var deform_type = [1, 1, 1];
  if (position == undefined) {var position = new THREE.Vector3(0, 0, 0);}
  var stage = 1;
  var double_sided = 'false';
  var start_rot = 0;
  var sub_rules = [1, 1, 1, 1, 1, 1, 1, 1];
  var mod_rules = [1, 1, 1, 1, 1, 1, 1, 1]; // we only draw symmetrical lattices so mod_rules are fixed
  var extrude_face = [-10, -10, -10, -10, -10, -10, -10, -10];
  var extrude_face0 = extrude_face;
  var contract_middle = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];
  var leave_middle = ['true', 'true', 'true', 'true', 'true', 'true', 'true', 'true'];

  var steps = get_steps(stage);
  var transformation_type = gene_weighted_choice(allel_transformation);
  var transformation_index = get_transformation_index(transformation_type);

  // this object will hold all of our lattice parameters which we can unpack when we need them
  var module_params = {
    start_bounds: start_bounds,
    primitive: primitive,
    deform_type: deform_type,
    position: position,
    stage: stage,
    double_sided: double_sided,
    start_rot: start_rot,
    sub_rules: sub_rules,
    mod_rules: mod_rules,
    extrude_face: extrude_face,
    extrude_face0, extrude_face0,
    contract_middle: contract_middle,
    leave_middle: leave_middle,
    steps: steps,
    transformation_type: transformation_type,
    transformation_index: transformation_index
  }

  return module_params
}




//////ANIMATION SETTINGS CHOOSING//////
const light_frame_speed_param = {
  Fast: 25, // light increment per 1/100 of a second
  Normal: 50, // light increment per 1/30 of a second
  Slow: 500, // light increment per half-second
  SuperSlow: 1000, // light increment per second
}

const light_step_size_param = {
  Paused: 0,
  DaySync: 0.000072,//2*Math.PI/86400,
  SuperSmall: 0.00025,
  Small: 0.0005,
  Medium: 0.0010,
  Large: 0.0015
}




const palettes_v3 = {

  //1. Horizon, sunshine, grapefruit - bauhaus light (8)
  
  "Otti":             ["#a3d3ff", "#fefaee", "#ff855f", "#ffe550"], // light blue, white, light red, yellow - Otti Berger
  "Stölzl":           ["#c44414", "#daa211", "#255080", "#e7e7d7"], // red, yellow, blue, white - Gunta Stölzl
  "Albers":           ["#f9f0df", "#e51335", "#2a72ae", "#fbb515"], // white, red, blue, yellow - Anni Albers
  "Brandt":           ["#3bb3ff", "#feeddd", "#ffbb33", "#ff2244"], // light blue, white, orange, red - Marianne Brandt
  "Koch-Otte":        ["#ee5626", "#eebb22", "#4d9db9", "#f5f5d5", "#7cc1c1"], // red, yellow, blue, white, light blue - Benita Koch-Otte
  "Arndt":            ["#e22e82", "#efbf33", "#3555a5", "#e7e7d7"], // red, yellow, blue, white - Gertrude Arndt
  "Siedhoff-Buscher": ["#ebb707", "#e84818", "#266396", "#eecece", "#e4e4e4"], // yellow, red, blue, light lila, white - Alma Siedhoff-Buscher
  "Heymann":          ["#ee2f2f", "#f2cd22", "#1b94bb", "#faaaba", "#feeede"], // red, yellow, blue, light pink, white - Margarete Heymann
  
  //2. Night, embers, citrus - bauhaus (5)
  
  "van der Rohe": ["#f34333", "#fdd666", "#275777", "#f3f3f3", "#090909"], // - Ludwig Mies van der Rohe
  "Gropius":      ["#fef5ee", "#faf000", "#fb0101", "#1c81ea", "#1e1e1e"], // - Walter Gropius
  "Breuer":       ["#ffbf0b", "#ee3e6e", "#2277a7", "#f9f0df", "#090909"], // - Marcel Breuer
  "Gray":         ["#f9f0df", "#e51335", "#2a72ae", "#fbb515", "#090909"], // white, red, blue, yellow, black - Eileen Gray
  "Le Corbusier": ["#f24222", "#fccc0c", "#4888c8", "#f9f0df", "#090909"], // red, yellow, blue, white, black - Le Corbusier
  
  //3. Ivy, apatite, tourmaline - bauhaus + green (8)
  
  "O'Keeffe":   ["#0e4a4e", "#ff9777", "#ead2a2", "#5484a8"], // green, light red, beige, blue - Georgia O'Keeffe
  "Dalí":       ["#e54545", "#f77757", "#fccc66", "#fafa66", "#1ac1ca"], // - Salvador Dalí
  "Matisse":    ["#06add6", "#066888", "#f0cc0c", "#fff1d1", "#dd1d1d"], // - Henri Matisse
  "Kandinsky":  ["#ffbf0b", "#ee3e6e", "#2277a7", "#33936d", "#f9f0df"], // - Wassily Kandinsky
  "Chagall":    ["#f6af06", "#1e66aa", "#eee7d7", "#019166", "#e74422"], // orange yellow, blue, white, green, red - Marc Chagall
  "Negreiros":  ["#f8c8de", "#f2e222", "#28b2d2", "#668833", "#ef6e7e", "#f2f2e2"], // light pink, yellow, blue, green, red, white - Almada Negreiros
  "Picasso":    ["#f33373", "#eed333", "#445e7e", "#19a199", "#ede8dd"], // red, yellow, blue, teal, white - Pablo Picasso
  "Klee":       ["#de3e1e", "#de9333", "#007555", "#eccdad", "#889979", "#7aa7a7"], // red, yellow, green, white, olive green, light green - Paul Klee
  
  //4. Sodalite, glacier, rust - blue red (7)
  
  "Planck":     ["#f8f8e8", "#d83818", "#224772", "#151a1a"], // white, red, blue, black - Max Planck
  "Thomson":    ["#144b5b", "#088191", "#e5fde5", "#466994", "#f55b66"], // - Sir Joseph John Thomson
  "Einstein":   ["#ebe0ce", "#c5c5bb", "#242d44", "#e4042e"], // light gray, gray, dark blue, red - Albert Einstein
  "Heisenberg": ["#f9f9f0", "#e11e21", "#e7007e", "#005aa5", "#5ec5ee"], // white, red, pink, blue, light blue - Werner Heisenberg
  "Bohr":       ["#f999a9", "#044499", "#1a88c1", "#77aee7", "#a6d6d6", "#f9f9f0"], // light pink, blue, light blue, super light blue, light teal, white - Niels Bohr
  "Feynman":    ["#004999", "#557baa", "#ff4f44", "#ffbcbc", "#fff8e8"], // deep blue, blue, red, light lila, white - Richard Feynman
  "Dirac":      ["#db4545", "#d0e0e0", "#3a6a93", "#2e3855", "#a3c6d3"], // red, white, blue, dark blue, light blue - Paul Dirac
  
  //5. Ocean, lapis, sulphur - blue yellow (4)
  
  "Babbage":  ["#1a3daa", "#244888", "#2277d7", "#62aad6", "#f2d552"], // - Charles Babbage
  "Lovelace": ["#dafaff", "#00bbfb", "#005995", "#002044"], // - Ada Lovelace
  "Leibniz":  ["#fff8f8", "#a3e3dd", "#1c6dd6", "#2c2c44", "#ffd525"], // white, light teal, blue, dark gray, yellow - Gottfried Wilhelm Leibniz
  "Boole":    ["#070c0c", "#1d5581", "#fece3c", "#f8e288", "#9fc999"], // - George Boole
  
  //6. Moss, cedar, algae - green (3)
  
  "Zancan":  ["#445522", "#788c33", "#b5be5e", "#242414", "#f2f2f2"], // - Zancan
  "Muir":    ["#cec09c", "#505e3e", "#374727", "#2a3322"], // light brown, light olive, dark green, dark olive - John Muir
  "Thoreau": ["#144b5b", "#1a966a", "#88d899", "#cadaba", "#f9e9d9"], // - Henry David Thoreau
  
  //7. Ink, steel, salt (2)
  
  "Hokusai":   ["#7d9aa7", "#c0b8a8", "#ddd4c4", "#10244a", "#444b4e"], // - Katsushika Hokusai
  "Hiroshige": ["#ebe0ce", "#20335c", "#1c2244", "#1d1f2d"], // light gray, blue, dark blue, black - Utagawa Hiroshige
  
  //8. Charcoal, papyrus, marble - monochrome (4)
  
  "Charcoal":       ["#090909", "#1a1a1a", "#1d1d1d", "#222222", "#2c2c2c", "#3c3c3c"], // black, black, black, black, dark gray, gray
  "Marble":         ["#cac5b5", "#ebe0ce", "#f9f0df", "#eee7d7", "#fff8f8", "#feeddd"], // gray, light gray, white, white, white
  "Adams":          ["#ebe0ce", "#2a2b2c", "#1e1e1e"], // light gray, dark gray, black - Ansel Adams
  "New York Times": ["#ebe0ce", "#cac5b5", "#1e1e1e"], // light gray, gray, black
  
  //9. Murex, rhodochrosite, marshmallow - pink purple (8)
  
  "Minsky":      ["#c5e5f5", "#fd5d9d", "#fccce0", "#feefef"], // - Marvin Minsky
  "Newell":      ["#8d00d8", "#d722b7", "#f288c2", "#f9c66c", "#e2e2e2"], // - Allen Newell
  "Simon":       ["#1f336f", "#553773", "#8b3b7b", "#f7447f", "#f9f0df"], // - Herbert A. Simon
  "McCarthy":    ["#3fb3aa", "#7cc7ac", "#dadaaa", "#fe9e9e", "#ff3f7f"], // - John McCarthy
  "Solomonoff":  ["#e77e99", "#6cc6dd", "#866686", "#f9f9f0"], // light pink, light blue, light purple, white - Ray Solomonoff
  "Shannon":     ["#665d8d", "#7799aa", "#d885a5", "#fccebb"], // purple, teal, pink, beige - Claude Shannon
  "von Neumann": ["#4a0020", "#550533", "#750555", "#990f5f", "#f9f0df"], // dark maroon, maroon, light maroon, maroon purple, white - John von Neumann
  "Turing":      ["#e40422", "#e33388", "#434394", "#191919", "#ece3d3"], // red, pink, blue, black, white - Alan Turing
  
  //10. Furnace, ruby, soot - red (5)
  
  "Kapoor":   ["#900f3f", "#c70033", "#ff5333", "#ffcc00", "#f9f0df"], // maroon, red, orange, yellow, white - Anish Kapoor
  "Golid":    ["#fece44", "#ede8dd", "#ff5333", "#ff99b9"], // yellow, white, red, light pink - Kjetil Golid
  "Busia":    ["#f9f0df", "#e51335", "#090909"], // white, red, black - Kwame Bruce Busia
  "Judd":     ["#e51335", "#e4042e", "#d83818", "#ff2244", "#e74422", "#e11e21", "#faaf0f", "#fbb515", "#ff855f", "#191919"], // red, red, red, red, red, red, orange yellow, yellow, light red, black - Donald Judd
  "Malevich": ["#ece3d3", "#e51335", "#1d1d1d", "#fcc1c1"], // light gray, red, black, light pink - Kazimir Malevich
}


const allel_color_features_vert = [
  ["none", 80],
  ["vertical stripe sparse", 5],
  ["vertical stripe dashed", 5],
  ["vertical stripe blocks", 5],
  ["vertical stripe solid", 5]
];

const allel_color_features_horiz = [
  ["none", 85],
  ["horizontal stripe dashed", 5],
  ["horizontal stripe blocks", 5],
  ["horizontal stripe solid", 5]
];

const allel_noise_cull_rule = [
  ["clean", 65],
  ["fuzzy", 35]
];

const allel_noise_scale_x = [
  [0.05, 2],
  [0.10, 1],
  [0.15, 1],
  [0.20, 1]
]

const allel_noise_scale_y = [
  [0.10, 1],
  [0.20, 1],
  [0.30, 1],
  [0.40, 1],
  [0.50, 1]
]

const allel_noise_scale_z = [
  [0.10, 1],
  [0.20, 1],
  [0.30, 1],
  [0.40, 1],
  [0.50, 1]
]

const allel_noise_features = [
  ["cracks", 20],
  ["bands", 20],
  ["sheets", 30],
  ["unbiased", 30]
]

// taken out:
//["solid", 1],
//["vertical grading clean", 1],
//["horizontal grading clean", 1],
//["width stack", 10],

const allel_color_gradient = [
  ["solid sprinkled", 15],
  ["uniform", 15],
  ["vertical grading", 15],
  ["horizontal grading", 15],
  ["height stack", 15],
  ["depth stack", 25]
]

const allel_color_gradient_quadrants = [
  ["solid sprinkled", 1],
  ["uniform", 1],
  ["vertical grading", 1],
  ["horizontal grading", 1],
  ["width stack", 1],
  ["height stack", 1],
  ["depth stack", 1]
]

const allel_quadrant_div = [
  [1.5, 1],
  [1.75, 1],
  [2.0, 1],
  [3.0, 1],
  [4.0, 1]
]