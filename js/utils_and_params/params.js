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





const palettes = {
  "Dessau": [ "#f9f0de", // white
              "#e51531", // red
              "#2a70ae", // blue
              "#fab511", // yellow
              "#080808"],// black

  "Dessau_light": [ "#f9f0de", // white
                    "#e51531", // red
                    "#2a70ae", // blue
                    "#fab511"], // yellow

  "Edo":    [ "#f9f0de", // white
              "#e51531", // red
              "#080808"], // black

  "Edo_dark": [ "#ebe2cf", // light gray
                "#2a2b29", // dark gray
                "#1d1e1b"], // black

  "Shirokuro": [ "#ebe2cf", // light gray
                 "#cac3b3", // gray
                 "#1d1e1b"], // black

  "Sashiko_light": [ "#ebe2cf", // light gray
                     "#20315d", // blue
                     "#1c2342", // dark blue
                     "#1d1f2b"], // black

  "Blueprint": [ "#f9f6f2", // white
                 "#ebe2cf", // light gray
                 "#2c52a0"], // light blue

  "Akiba": [ "#ebe2cf", // light gray
             "#c5c8ba", // gray
             "#f8c1c1", // light pink
             "#2c52a0"], // light blue

  "Napoli": [ "#f9f6f2", // white
              "#ebe2cf", // light gray
              "#d7312e", // red
              "#40483a"], // dark green

  "Arashiyama": [ "#cec29d", // light brown
                  "#505e3f", // light olive 
                  "#39472b", // dark green
                  "#2a3320"], // dark olive
                                  
  "Ex_Astris": [ "#ebe2cf", // light gray
                 "#c5c8ba", // gray
                 "#262d49", // dark blue
                 "#e4032c"], // red

  "Brubeck_mod": [ "#f7f8e6", // white
                   "#d83715", // red
                   "#224870", // blue
                   "#151a1b"], // black

  /*"Nineties_mod": [ "#2c2f7a", // blue
                    "#2a70ae", // blue
                    "#005742", // teal
                    "#8b5ba2", // purple
                    "#1d1e1b", // black
                    "#ebe2cf"], // light gray*/

  "Tabata": [ "#ece3d0", // light gray
              "#e51531", // red
              "#1d1d1b", // black
              "#f8c1c1"], // light pink

  "Yoyogi_mod": [ "#e40520", // red
                  "#e1318a", // pink
                  "#484395", // blue
                  "#19171a", // black
                  "#ece3d0"], // white

  "Osaki": [ "#f299a5", // light pink
             "#084698", // blue
             "#1a86c8", // light blue
             "#74afe0", // super light blue
             "#a0d6da", // light teal
             "#f8f9f2"], // white

  "Shinagawa": [ "#e87e95", // light pink
                 "#6cc7df", // light blue
                 "#816987", // light purple
                 "#f9f6f2"], // white

  "Shinjuku_mod": [ "#fcbd32", // yellow
                    "#007b5d", // teal
                    "#0089c5", // blue
                    "#221e1f", // black
                    "#ece3d0"], // white

  "Meguro_mod": [ "#f9f6f2", // white
                  "#e51f23", // red
                  "#e6007b", // pink
                  "#005aa7", // blue
                  "#5ec5ee"], // light blue

  "Asphalt_mod": [ "#00a19d", // teal
                   "#fff8e5", // white
                   "#2c2e43", // dark gray
                   "#b2b1b9", // light gray
                   "#595260"], // gray

  "Diatomite_mod": [ "#fff8f3", // white
                     "#a3e4db", // light teal
                     "#1c6dd0", // blue
                     "#2c2e43", // dark gray
                     "#ffd523"], // yellow

  "Arkose": [ "#a2d2ff", // light blue
              "#fef9ef", // white
              "#ff865e", // light red
              "#fee440"], // yellow

  "Hematite": [ "#3db2ff", // light blue
                "#ffedda", // white
                "#ffb830", // orange
                "#ff2442"], // red

  "Fisherprice_mod": [ "#f9af06", // orange yellow
                       "#1e62ad", // blue
                       "#ece7d9", // white
                       "#01906d", // green
                       "#e74620"], // red

  "Dark_Crystals": [ "#d94939", // light red
                     "#066278", // dark teal
                     "#e3e0d5"], // white

  "Sea_Dark_mod": [ "#e4e2d5", // white
                    "#324a58", // dark blue
                    "#deb55c"], // yellow

  "Noir_mod": [ "#22252a", // black
                "#2f3237", // dark gray
                "#62646a", // gray
                "#aeb1b7", // light gray
                "#e1e4ea"], // white

  "Ocean": [ "#00a19d", // teal
             "#005aa7", // blue
             "#2a70ae", // blue
             "#1e62ad", // blue
             "#0089c5", // blue
             "#20315d", // blue
             "#066278", // dark teal
             "#181e3e", // dark blue
             "#2d5d7d", // gray blue
             "#3db2ff", // light blue
             "#2c52a0", // light blue
             "#5ec5ee", // light blue
             "#6cc7df", // light blue
             "#1d1f2b"], // black

  "Furnace": [ "#e51531", // red
               "#d7312e", // red
               "#e4032c", // red
               "#d83715", // red
               "#ff2442", // red
               "#e74620", // red
               "#e51f23", // red
               "#f9af06", // orange yellow
               "#fab511", // yellow
               "#ff865e", // light red
               "#19171a"], // black

  "Charcoal": [ "#020202", // black
                "#080808", // black
                "#1a1a1a", // black
                "#1d1d1d", // black
                "#222222", // black
                "#2c2c2c", // dark gray
                "#3c3c3c"], // gray

  /*"Marble": [ "#f9f0de", // white
              "#f9f6f2", // white
              "#f7f8e6", // white
              "#fff8e5", // white
              "#e1e4ea", // white
              "#e4e2d5", // white
              "#ece7d9", // white
              "#ffedda", // white
              "#aeb1b7", // light gray
              "#ece3d0"], // white */

  "Chloroplast": [  "#40483a", // dark green
                    "#505e3f", // light olive 
                    "#39472b", // dark green
                    "#2a3320", // dark olive
                    "#066278", // dark teal
                    "#007b5d", // teal
                    "#005742", // teal
                    "#00a19d", // teal
                    "#a0d6da", // light teal
                    "#01906d", // green
                    "#1d1e1b"], // black     

}

const palettes_v2 = {
  "ColorHunt_01": ['#eaeaea', '#ff2e63', '#252a34', '#08d9d6'],
  "ColorHunt_02": ['#eeeeee', '#00adb5', '#393e46', '#222831'],
  //"ColorHunt_03": ['#521262', '#6639a6', '#3490de', '#6fe7dd'],
  "ColorHunt_04": ['#eeeeee', '#d72323', '#3a4750', '#303841'],
  "ColorHunt_05": ['#d9faff', '#00bbf0', '#005792', '#00204a'],
  "ColorHunt_06": ['#40514e', '#11999e', '#30e3ca', '#e4f9f5'],
  "ColorHunt_07": ['#a7ff83', '#17b978', '#086972', '#071a52'],
  "ColorHunt_08": ['#c5e3f6', '#fc5c9c', '#fccde2', '#fcefee'],
  "Coolors_01": ['#114b5f', '#1a936f', '#88d498', '#c6dabf', '#f3e9d2'],
  "Coolors_02": ['#114b5f', '#028090', '#e4fde1', '#456990', '#f45b69'],
  "Coolors_03": ['#06aed5', '#086788', '#f0c808', '#fff1d0', '#dd1c1a'],
  "Coolors_04": ['#ffbf00', '#e83f6f', '#2274a5', '#32936f', '#f9f0de'],
  "Coolors_05": ['#ffbf00', '#e83f6f', '#2274a5', '#f9f0de', '#080808'],
  "colorsmuzli_01": ['#8a00d4', '#d527b7', '#f782c2', '#f9c46b', '#e3e3e3'],
  "colorsmuzli_02": ['#e74645', '#fb7756', '#facd60', '#fdfa66', '#1ac0c6'],
  "colorsmuzli_05": ['#1f306e', '#553772', '#8f3b76', '#f5487f', '#f9f0de'],
  "colorsmuzli_06": ['#343090', '#5f59f7', '#6592fd', '#44c2fd', '#f9f0de'],
  "ColourLovers_01": ['#e8ddcb', '#cdb380', '#036564', '#033649', '#031634'],
  "ColourLovers_02": ['#3fb8af', '#7fc7af', '#dad8a7', '#ff9e9d', '#ff3d7f'],
  "ColourLovers_03": ['#69d2e7', '#a7dbd8', '#e0e4cc', '#f38630', '#fa6900'],
  //"AdobeColor_01": ['#a6032f', '#022873', '#035aa6', '#04b2d9', '#05dbf2'],
  "AdobeColor_02": ['#1b3da6', '#26488c', '#2372d9', '#62abd9', '#f2d857'],
  //"AdobeColor_03": ['#3f0259', '#f2e205', '#f2b705', '#f2ebdc', '#d95e32'],
  //"AdobeColor_04": ['#080808', '#f2e205', '#f2b705', '#f2ebdc', '#d95e32'],
  "AdobeColor_05": ['#485922', '#798c35', '#b4bf5e', '#242614', '#f2f2f2'],
  "ColorLeap_01": ['#fef7ee', '#fef000', '#fb0002', '#1c82eb', '#1d1e1b'],
  "ColorLeap_02": ['#c87994', '#c3d2cf', '#52a29f', '#283730', '#0e0312'],
  "Bauhaus_01": ['#f44336', '#ffd966', '#2a5779', '#f3f6f4', '#080808'],
  "Hokusai_01": ['#7d9ba6', '#c0b7a8', '#ddd3c4', '#10284a', '#474b4e'],
  "Stary_Night": ['#070c0f', '#1d5880', '#fece3e', '#f8e288', '#9fc798'],
  "byrnes": ["#c54514", "#dca215", "#23507f", "#e8e7d4"], // red, yellow, blue, white
  "saami": ["#eab700", "#e64818", "#2c6393", "#eecfca", "#e7e6e4"], // yellow, red, blue, light lila, white
  "cc234": ["#ffce49", "#ede8dc", "#ff5736", "#ff99b4"], // yellow, white, red, light pink
  "sprague": ["#ec2f28", "#f8cd28", "#1e95bb", "#fbaab3", "#fcefdf"], // red, yellow, blue, light pink, white
  "jud_horizon": ["#f8c3df", "#f2e420", "#28b3d0", "#648731", "#ef6a7d", "#f2f0e1"], // light pink, yellow, blue, green, red, white
  "hilda": ["#eb5627", "#eebb20", "#4e9eb8", "#f7f5d0", "#77c1c0"], // red, yellow, blue, white, light blue
  "jung_croc": ["#f13274", "#eed03e", "#405e7f", "#19a198", "#ede8dc"], // red, yellow, blue, teal, white
  "cc245": ["#0d4a4e", "#ff947b", "#ead3a2", "#5284ab"], // green, light red, beige, blue
  "rohlfs_1R": ["#004996", "#567bae", "#ff4c48", "#ffbcb3", "#fff8e7"], // deep blue, blue, red, light lila, white
  "rohlfs_4": ["#fde500", "#2f2043", "#f76975", "#fbbeca", "#eff0dd"], // yellow, deep purple, light red, light lila, white
  "system_5": ["#db4549", "#d1e1e1", "#3e6a90", "#2e3853", "#a3c9d3"], // red, white, blue, dark blue, light blue
  "jung_horse": ["#e72e81", "#f0bf36", "#3056a2", "#e8e7d4"], // red, yellow, blue, white
  "system_4": ["#e31f4f", "#f0ac3f", "#18acab", "#26265a", "#ea7d81", "#dcd9d0"], // red, yellow, teal, deep blue, light lila, light gray
  "jud_playground": ["#f04924", "#fcce09", "#408ac9", "#f9f0de", "#080808"], // red, yellow, blue, white, black
  "kov_05": ["#de3f1a", "#de9232", "#007158", "#e6cdaf", "#869679", "#7aa5a6"], // red, yellow, green, white, olive green, light green
  "jud_mural": ["#ca3122", "#e5af16", "#4a93a2", "#0e7e39", "#e2b9bd", "#e3ded8"], // red, yellow, light blue, green, light lila, white
  "vintage_01": ["#655D8A", "#7897AB", "#D885A3", "#FDCEB9"], // purple, teal, pink, beige
  "vintage_02": ["#4C0027", "#570530", "#750550", "#980F5A", "#f9f0de"], // dark maroon, maroon, light maroon, maroon purple, white
  "vintage_03": ["#151515", "#301B3F", "#3C415C", "#655D8A", "#f9f0de"], // black, dark purple, light purple, purple, white
  "blood_honey": ["#900C3F", "#C70039", "#FF5733", "#FFC300", "#f9f0de"], // maroon, red, orange, yellow, white
  // "": ["#", "#", "#", "#", "#", "#"],

}



const palettes_v3 = {
  "Dessau": [ "#f9f0de", "#e51531", "#2a70ae", "#fab511", "#080808"], // white, red, blue, yellow, black
  "Dessau_light": [ "#f9f0de", "#e51531", "#2a70ae", "#fab511"], // white, red, blue, yellow
  "Edo": [ "#f9f0de", "#e51531", "#080808"], // white, red, black
  "Edo_dark": [ "#ebe2cf", "#2a2b29", "#1d1e1b"], // light gray, dark gray, black
  "Shirokuro": [ "#ebe2cf", "#cac3b3", "#1d1e1b"], // light gray, gray, black
  "Sashiko_light": [ "#ebe2cf", "#20315d", "#1c2342", "#1d1f2b"], // light gray, blue, dark blue, black
  "Blueprint": [ "#f9f6f2", "#ebe2cf", "#2c52a0"], // white, light gray, light blue
  "Akiba": [ "#ebe2cf", "#c5c8ba", "#f8c1c1", "#2c52a0"], // light gray, gray, light pink, light blue
  "Napoli": [ "#f9f6f2", "#ebe2cf", "#d7312e", "#40483a"], // white, light gray, red, dark green
  "Arashiyama": [ "#cec29d", "#505e3f", "#39472b", "#2a3320"], // light brown, light olive, dark green, dark olive                 
  "Ex_Astris": [ "#ebe2cf", "#c5c8ba", "#262d49", "#e4032c"], // light gray, gray, dark blue, red
  "Brubeck_mod": [ "#f7f8e6", "#d83715", "#224870", "#151a1b"], // white, red, blue, black
  "Tabata": [ "#ece3d0", "#e51531", "#1d1d1b", "#f8c1c1"], // light gray, red, black, light pink
  "Yoyogi_mod": [ "#e40520", "#e1318a", "#484395", "#19171a", "#ece3d0"], // red, pink, blue, black, white
  "Osaki": [ "#f299a5", "#084698", "#1a86c8", "#74afe0", "#a0d6da", "#f8f9f2"], // light pink, blue, light blue, super light blue, light teal, white
  "Shinagawa": [ "#e87e95", "#6cc7df", "#816987", "#f9f6f2"], // light pink, light blue, light purple, white
  "Shinjuku_mod": [ "#fcbd32", "#007b5d", "#0089c5", "#221e1f", "#ece3d0"], // yellow, teal, blue, black, white
  "Meguro_mod": [ "#f9f6f2", "#e51f23", "#e6007b", "#005aa7", "#5ec5ee"], // white, red, pink, blue, light blue
  "Asphalt_mod": [ "#00a19d", "#fff8e5", "#2c2e43", "#b2b1b9", "#595260"], // teal, white, dark gray, light gray, gray
  "Diatomite_mod": [ "#fff8f3", "#a3e4db", "#1c6dd0", "#2c2e43", "#ffd523"], // white, light teal, blue, dark gray, yellow
  "Arkose": [ "#a2d2ff", "#fef9ef", "#ff865e", "#fee440"], // light blue, white, light red, yellow
  "Hematite": [ "#3db2ff", "#ffedda", "#ffb830", "#ff2442"], // light blue, white, orange, red
  "Fisherprice_mod": [ "#f9af06", "#1e62ad", "#ece7d9", "#01906d", "#e74620"], // orange yellow, blue, white, green, red
  "Dark_Crystals": [ "#d94939", "#066278", "#e3e0d5"], // light red, dark teal, white
  "Sea_Dark_mod": [ "#e4e2d5", "#324a58", "#deb55c"], // white, dark blue, yellow
  "Noir_mod": [ "#22252a", "#2f3237", "#62646a", "#aeb1b7", "#e1e4ea"], // black, dark gray, gray, light gray, white
  "Ocean": [ "#00a19d", "#005aa7", "#2a70ae", "#1e62ad", "#0089c5", "#20315d", "#066278", "#181e3e", "#2d5d7d", "#3db2ff", "#2c52a0", "#5ec5ee", "#6cc7df", "#1d1f2b"], // teal, blue, blue, blue, blue, blue, dark teal, dark blue, gray blue, light blue, light blue, light blue, light blue, black
  "Furnace": [ "#e51531", "#d7312e", "#e4032c", "#d83715", "#ff2442", "#e74620", "#e51f23", "#f9af06", "#fab511", "#ff865e", "#19171a"], // red, red, red, red, red, red, red, orange yellow, yellow, light red, black
  "Charcoal": [ "#020202", "#080808", "#1a1a1a", "#1d1d1d", "#222222", "#2c2c2c", "#3c3c3c"], // black, black, black, black, black, dark gray, gray
  "Chloroplast": ["#40483a", "#505e3f", "#39472b", "#2a3320", "#066278", "#007b5d", "#005742", "#00a19d", "#a0d6da", "#01906d", "#1d1e1b"], // dark green, light olive, dark green, dark olive, dark teal, teal, teal, teal, light teal, green, black 
  "ColorHunt_01": ['#eaeaea', '#ff2e63', '#252a34', '#08d9d6'],
  "ColorHunt_02": ['#eeeeee', '#00adb5', '#393e46', '#222831'],
  "ColorHunt_04": ['#eeeeee', '#d72323', '#3a4750', '#303841'],
  "ColorHunt_05": ['#d9faff', '#00bbf0', '#005792', '#00204a'],
  "ColorHunt_06": ['#40514e', '#11999e', '#30e3ca', '#e4f9f5'],
  "ColorHunt_07": ['#a7ff83', '#17b978', '#086972', '#071a52'],
  "ColorHunt_08": ['#c5e3f6', '#fc5c9c', '#fccde2', '#fcefee'],
  "Coolors_01": ['#114b5f', '#1a936f', '#88d498', '#c6dabf', '#f3e9d2'],
  "Coolors_02": ['#114b5f', '#028090', '#e4fde1', '#456990', '#f45b69'],
  "Coolors_03": ['#06aed5', '#086788', '#f0c808', '#fff1d0', '#dd1c1a'],
  "Coolors_04": ['#ffbf00', '#e83f6f', '#2274a5', '#32936f', '#f9f0de'],
  "Coolors_05": ['#ffbf00', '#e83f6f', '#2274a5', '#f9f0de', '#080808'],
  "colorsmuzli_01": ['#8a00d4', '#d527b7', '#f782c2', '#f9c46b', '#e3e3e3'],
  "colorsmuzli_02": ['#e74645', '#fb7756', '#facd60', '#fdfa66', '#1ac0c6'],
  "colorsmuzli_05": ['#1f306e', '#553772', '#8f3b76', '#f5487f', '#f9f0de'],
  "colorsmuzli_06": ['#343090', '#5f59f7', '#6592fd', '#44c2fd', '#f9f0de'],
  "ColourLovers_01": ['#e8ddcb', '#cdb380', '#036564', '#033649', '#031634'],
  "ColourLovers_02": ['#3fb8af', '#7fc7af', '#dad8a7', '#ff9e9d', '#ff3d7f'],
  "ColourLovers_03": ['#69d2e7', '#a7dbd8', '#e0e4cc', '#f38630', '#fa6900'],
  "AdobeColor_02": ['#1b3da6', '#26488c', '#2372d9', '#62abd9', '#f2d857'],
  "AdobeColor_05": ['#485922', '#798c35', '#b4bf5e', '#242614', '#f2f2f2'],
  "ColorLeap_01": ['#fef7ee', '#fef000', '#fb0002', '#1c82eb', '#1d1e1b'],
  "ColorLeap_02": ['#c87994', '#c3d2cf', '#52a29f', '#283730', '#0e0312'],
  "Bauhaus_01": ['#f44336', '#ffd966', '#2a5779', '#f3f6f4', '#080808'],
  "Hokusai_01": ['#7d9ba6', '#c0b7a8', '#ddd3c4', '#10284a', '#474b4e'],
  "Stary_Night": ['#070c0f', '#1d5880', '#fece3e', '#f8e288', '#9fc798'],
  "byrnes": ["#c54514", "#dca215", "#23507f", "#e8e7d4"], // red, yellow, blue, white
  "saami": ["#eab700", "#e64818", "#2c6393", "#eecfca", "#e7e6e4"], // yellow, red, blue, light lila, white
  "cc234": ["#ffce49", "#ede8dc", "#ff5736", "#ff99b4"], // yellow, white, red, light pink
  "sprague": ["#ec2f28", "#f8cd28", "#1e95bb", "#fbaab3", "#fcefdf"], // red, yellow, blue, light pink, white
  "jud_horizon": ["#f8c3df", "#f2e420", "#28b3d0", "#648731", "#ef6a7d", "#f2f0e1"], // light pink, yellow, blue, green, red, white
  "hilda": ["#eb5627", "#eebb20", "#4e9eb8", "#f7f5d0", "#77c1c0"], // red, yellow, blue, white, light blue
  "jung_croc": ["#f13274", "#eed03e", "#405e7f", "#19a198", "#ede8dc"], // red, yellow, blue, teal, white
  "cc245": ["#0d4a4e", "#ff947b", "#ead3a2", "#5284ab"], // green, light red, beige, blue
  "rohlfs_1R": ["#004996", "#567bae", "#ff4c48", "#ffbcb3", "#fff8e7"], // deep blue, blue, red, light lila, white
  "rohlfs_4": ["#fde500", "#2f2043", "#f76975", "#fbbeca", "#eff0dd"], // yellow, deep purple, light red, light lila, white
  "system_5": ["#db4549", "#d1e1e1", "#3e6a90", "#2e3853", "#a3c9d3"], // red, white, blue, dark blue, light blue
  "jung_horse": ["#e72e81", "#f0bf36", "#3056a2", "#e8e7d4"], // red, yellow, blue, white
  "system_4": ["#e31f4f", "#f0ac3f", "#18acab", "#26265a", "#ea7d81", "#dcd9d0"], // red, yellow, teal, deep blue, light lila, light gray
  "jud_playground": ["#f04924", "#fcce09", "#408ac9", "#f9f0de", "#080808"], // red, yellow, blue, white, black
  "kov_05": ["#de3f1a", "#de9232", "#007158", "#e6cdaf", "#869679", "#7aa5a6"], // red, yellow, green, white, olive green, light green
  "jud_mural": ["#ca3122", "#e5af16", "#4a93a2", "#0e7e39", "#e2b9bd", "#e3ded8"], // red, yellow, light blue, green, light lila, white
  "vintage_01": ["#655D8A", "#7897AB", "#D885A3", "#FDCEB9"], // purple, teal, pink, beige
  "vintage_02": ["#4C0027", "#570530", "#750550", "#980F5A", "#f9f0de"], // dark maroon, maroon, light maroon, maroon purple, white
  "vintage_03": ["#151515", "#301B3F", "#3C415C", "#655D8A", "#f9f0de"], // black, dark purple, light purple, purple, white
  "blood_honey": ["#900C3F", "#C70039", "#FF5733", "#FFC300", "#f9f0de"], // maroon, red, orange, yellow, white
}


const allel_color_features_vert = [
  ["none", 10],
  ["vertical stripe sparse", 1],
  ["vertical stripe dashed", 1],
  ["vertical stripe blocks", 1],
  ["vertical stripe solid", 1]
];

const allel_color_features_horiz = [
  ["none", 10],
  ["horizontal stripe dashed", 1],
  ["horizontal stripe blocks", 1],
  ["horizontal stripe solid", 1]
];

const allel_noise_cull_rule = [
  ["clean", 1],
  ["fuzzy", 1]
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
  ["cracks", 1],
  ["bands", 1],
  ["sheets", 1],
  ["unbiased", 1]
]

const allel_color_gradient = [
  //["solid", 1],
  ["solid sprinkled", 1],
  ["uniform", 1],
  ["vertical grading", 1],
  ["horizontal grading", 1],
  //["vertical grading clean", 1],
  //["horizontal grading clean", 1],
  ["width stack", 1],
  ["height stack", 1],
  ["depth stack", 1]
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