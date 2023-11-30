//////PARAMS//////


//////SETTINGS//////
var dynamic_track = false;
var linewidth_scale = 0.00001; // 0.00001, line width to line length ratio
var loading_start_time = new Date().getTime();
var min_loading_time = 1000; // this is the minimum that the loading screen will be shown, in miliseconds
var debug = true;
var cam_factor = 4; //controls the "zoom" when using orthographic camera, default was 4
var cam_factor_mod;
var aspect_ratio = "0.5625"; //// 0.5625 - 16:9 aspect ratio, 0.75 - portrait (used in O B S C V R V M)
var global_rot_x = -Math.PI/16; // global rotation of the model around the X axis
var global_rot_y = Math.PI/16; // global rotation of the model around the Y axis


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

// STARS - random
var random_starfield_bounds = 1000; // O B S C V R V M - 1500
var nr_of_random_stars = 15000; // O B S C V R V M - 20000

// COLOUR CHANGE
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



const palette_pigments = {

  "horizon, sunshine, grapefruit": {

  "Otti":             ["#a3d3ff", "#fefaee", "#ff855f", "#ffe550"], // light blue, white, light red, yellow - Otti Berger
  "Stölzl":           ["#c44414", "#daa211", "#255080", "#e7e7d7"], // red, yellow, blue, white - Gunta Stölzl
  "Albers":           ["#f9f0df", "#e51335", "#2a72ae", "#fbb515"], // white, red, blue, yellow - Anni Albers
  "Brandt":           ["#3bb3ff", "#feeddd", "#ffbb33", "#ff2244"], // light blue, white, orange, red - Marianne Brandt
  "Koch-Otte":        ["#ee5626", "#eebb22", "#4d9db9", "#f5f5d5", "#7cc1c1"], // red, yellow, blue, white, light blue - Benita Koch-Otte
  "Arndt":            ["#e22e82", "#efbf33", "#3555a5", "#e7e7d7"], // red, yellow, blue, white - Gertrude Arndt
  "Siedhoff-Buscher": ["#ebb707", "#e84818", "#266396", "#eecece", "#e4e4e4"], // yellow, red, blue, light lila, white - Alma Siedhoff-Buscher
  "Heymann":          ["#ee2f2f", "#f2cd22", "#1b94bb", "#faaaba", "#feeede"], // red, yellow, blue, light pink, white - Margarete Heymann
  
  },

  "night, embers, citrus": {
  
  "van der Rohe": ["#f34333", "#fdd666", "#275777", "#f3f3f3", "#090909"], // - Ludwig Mies van der Rohe
  "Breuer":       ["#ffbf0b", "#ee3e6e", "#2277a7", "#f9f0df", "#090909"], // - Marcel Breuer
  "Gropius":         ["#f9f0df", "#e51335", "#2a72ae", "#fbb515", "#090909"], // white, red, blue, yellow, black - Walter Gropius
  "Le Corbusier": ["#f24222", "#fccc0c", "#4888c8", "#f9f0df", "#090909"], // red, yellow, blue, white, black - Le Corbusier
  
  },

  "ivy, apatite, tourmaline": {
  
  "O'Keeffe":   ["#0e4a4e", "#ff9777", "#ead2a2", "#5484a8"], // green, light red, beige, blue - Georgia O'Keeffe
  "Dalí":       ["#e54545", "#f77757", "#fccc66", "#fafa66", "#1ac1ca"], // - Salvador Dalí
  "Matisse":    ["#06add6", "#066888", "#f0cc0c", "#fff1d1", "#dd1d1d"], // - Henri Matisse
  "Kandinsky":  ["#ffbf0b", "#ee3e6e", "#2277a7", "#33936d", "#f9f0df"], // - Wassily Kandinsky
  "Chagall":    ["#f6af06", "#1e66aa", "#eee7d7", "#019166", "#e74422"], // orange yellow, blue, white, green, red - Marc Chagall
  "Negreiros":  ["#f8c8de", "#f2e222", "#28b2d2", "#668833", "#ef6e7e", "#f2f2e2"], // light pink, yellow, blue, green, red, white - Almada Negreiros
  "Picasso":    ["#f33373", "#eed333", "#445e7e", "#19a199", "#ede8dd"], // red, yellow, blue, teal, white - Pablo Picasso
  "Klee":       ["#de3e1e", "#de9333", "#007555", "#eccdad", "#889979", "#7aa7a7"], // red, yellow, green, white, olive green, light green - Paul Klee
  
  },

  "sodalite, glacier, rust": {
  
  "Planck":     ["#f8f8e8", "#d83818", "#224772", "#151a1a"], // white, red, blue, black - Max Planck
  "Thomson":    ["#144b5b", "#088191", "#e5fde5", "#466994", "#f55b66"], // - Sir Joseph John Thomson
  "Einstein":   ["#ebe0ce", "#c5c5bb", "#242d44", "#e4042e"], // light gray, gray, dark blue, red - Albert Einstein
  "Heisenberg": ["#f9f9f0", "#e11e21", "#e7007e", "#005aa5", "#5ec5ee"], // white, red, pink, blue, light blue - Werner Heisenberg
  "Bohr":       ["#f999a9", "#044499", "#1a88c1", "#77aee7", "#a6d6d6", "#f9f9f0"], // light pink, blue, light blue, super light blue, light teal, white - Niels Bohr
  "Feynman":    ["#004999", "#557baa", "#ff4f44", "#ffbcbc", "#fff8e8"], // deep blue, blue, red, light lila, white - Richard Feynman
  "Dirac":      ["#db4545", "#d0e0e0", "#3a6a93", "#2e3855", "#a3c6d3"], // red, white, blue, dark blue, light blue - Paul Dirac
  
  },

  "ocean, lapis, sulphur": {
  
  "Babbage":  ["#1a3daa", "#244888", "#2277d7", "#62aad6", "#f2d552"], // - Charles Babbage
  "Lovelace": ["#dafaff", "#00bbfb", "#005995", "#002044"], // - Ada Lovelace
  "Leibniz":  ["#fff8f8", "#a3e3dd", "#1c6dd6", "#2c2c44", "#ffd525"], // white, light teal, blue, dark gray, yellow - Gottfried Wilhelm Leibniz
  "Boole":    ["#070c0c", "#1d5581", "#fece3c", "#f8e288", "#9fc999"], // - George Boole
  
  },

  "moss, cedar, algae": {
  
  "Zancan":  ["#445522", "#788c33", "#b5be5e", "#242414", "#f2f2f2"], // - Zancan
  "Muir":    ["#cec09c", "#505e3e", "#374727", "#2a3322"], // light brown, light olive, dark green, dark olive - John Muir
  "Thoreau": ["#144b5b", "#1a966a", "#88d899", "#cadaba", "#f9e9d9"], // - Henry David Thoreau
  
  },

  "ink, steel, salt": {
  
  "Hokusai":   ["#7d9aa7", "#c0b8a8", "#ddd4c4", "#10244a", "#444b4e"], // - Katsushika Hokusai
  "Hiroshige": ["#ebe0ce", "#20335c", "#1c2244", "#1d1f2d"], // light gray, blue, dark blue, black - Utagawa Hiroshige
  
  },

  "charcoal, papyrus, marble": {
  
  "Charcoal":       ["#090909", "#1a1a1a", "#1d1d1d", "#222222", "#2c2c2c", "#3c3c3c"], // black, black, black, black, dark gray, gray
  "Marble":         ["#cac5b5", "#ebe0ce", "#f9f0df", "#eee7d7", "#fff8f8", "#feeddd"], // gray, light gray, white, white, white
  "Adams":          ["#ebe0ce", "#2a2b2c", "#1e1e1e"], // light gray, dark gray, black - Ansel Adams
  "New York Times": ["#ebe0ce", "#cac5b5", "#1e1e1e"], // light gray, gray, black
  
  },

  "murex, rhodochrosite, marshmallow": {
  
  "Minsky":      ["#c5e5f5", "#fd5d9d", "#fccce0", "#feefef"], // - Marvin Minsky
  "Newell":      ["#8d00d8", "#d722b7", "#f288c2", "#f9c66c", "#e2e2e2"], // - Allen Newell
  "Simon":       ["#1f336f", "#553773", "#8b3b7b", "#f7447f", "#f9f0df"], // - Herbert A. Simon
  "McCarthy":    ["#3fb3aa", "#7cc7ac", "#dadaaa", "#fe9e9e", "#ff3f7f"], // - John McCarthy
  "Solomonoff":  ["#e77e99", "#6cc6dd", "#866686", "#f9f9f0"], // light pink, light blue, light purple, white - Ray Solomonoff
  "Shannon":     ["#665d8d", "#7799aa", "#d885a5", "#fccebb"], // purple, teal, pink, beige - Claude Shannon
  "von Neumann": ["#4a0020", "#550533", "#750555", "#990f5f", "#f9f0df"], // dark maroon, maroon, light maroon, maroon purple, white - John von Neumann
  "Turing":      ["#e40422", "#e33388", "#434394", "#191919", "#ece3d3"], // red, pink, blue, black, white - Alan Turing
  
  },

  "furnace, ruby, soot": {
  
  "Kapoor":   ["#900f3f", "#c70033", "#ff5333", "#ffcc00", "#f9f0df"], // maroon, red, orange, yellow, white - Anish Kapoor
  "Golid":    ["#fece44", "#ede8dd", "#ff5333", "#ff99b9"], // yellow, white, red, light pink - Kjetil Golid
  "Busia":    ["#f9f0df", "#e51335", "#090909"], // white, red, black - Kwame Bruce Busia
  "Judd":     ["#e51335", "#e4042e", "#d83818", "#ff2244", "#e74422", "#e11e21", "#faaf0f", "#fbb515", "#ff855f", "#191919"], // red, red, red, red, red, red, orange yellow, yellow, light red, black - Donald Judd
  "Malevich": ["#ece3d3", "#e51335", "#1d1d1d", "#fcc1c1"], // light gray, red, black, light pink - Kazimir Malevich

  }
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


const allel_color_gradient_quadrants = [
  ["solid sprinkled", 1],
  ["uniform", 1],
  ["vertical grading", 1],
  ["horizontal grading", 1],
  ["width stack", 1],
  ["height stack", 1],
  ["depth stack", 1]
];

const allel_quadrant_div = [
  [1.5, 1],
  [1.75, 1],
  [2.0, 1],
  [3.0, 1],
  [4.0, 1]
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
  "dense": 0,
  "tight": 1,
  "detached": 10,
  "loose": 25,
  "floating": 50
}

const cylinder_params = {
  "standard" : [0.5, 0.5, 1, 6, 1],
  "square beam" : [0.5, 0.5, 1, 4, 1], // here the side length is less than 1.0 as the first parameter is radius
  "square 1x1" : [0.7, 0.7, 1, 4, 1] // first parameter is the radius, which gives us a square with a side close to 1.0
}

// one triangle
const star_vertices = [
  0, 1, 0, // top
  1, 0, 0, // right
  -1, 0, 0 // left
];

const star_face = [ 2, 1, 0 ]; // one face
const star_radius = 0.30;


var triptych = $fx.getParam("triptych_id"); // type of triptych, default is "middle"

var pigments = $fx.getParam("pigments_id"); // pigments are chosen using fxhash params
var palette_name = gene_pick_key(palette_pigments[pigments]); // choose palette name at random from a palette pigment list
var chosen_palette = palette_pigments[pigments][palette_name].slice(0); // make a copy of the chosen color palette
shuffleArray(chosen_palette); // randomly shuffle the colors in the palette - this way we can keep the order of probabilities the same in the loop below

var pattern = $fx.getParam("pattern_id"); // pattern is chosen using fxhash params
if (pattern == "noisy") {var color_gradient_default = "uniform";}
if (pattern == "graded") {var color_gradient_default = gene() < 0.5 ? "vertical grading" : "horizontal grading";}
if (pattern == "layered") {var color_gradient_default = gene() < 0.5 ? "solid sprinkled" : "depth stack";}
if (pattern == "stacked") {var color_gradient_default = "height stack";}
if (pattern == "composed") {var color_gradient_default = "solid sprinkled";} // this one is just a placeholder, patterns for quadrants will be determined separately

var quadrants = pattern == "composed" ? true : false; // if the color gradient is "composed", quadrants will be triggered
var quadrant_div_x = gene_weighted_choice(allel_quadrant_div); // 1.5 - 4.0, controls the vertical division line with QUADRANTS
var quadrant_div_y = gene_weighted_choice(allel_quadrant_div); // 1.5 - 4.0, controls the horizontal division line with QUADRANTS
// determines the color grading for each segment of the QUADRANT
var color_gradient_quadrants = [gene_weighted_choice(allel_color_gradient_quadrants),
                                gene_weighted_choice(allel_color_gradient_quadrants),
                                gene_weighted_choice(allel_color_gradient_quadrants),
                                gene_weighted_choice(allel_color_gradient_quadrants)];

var noise_feature = $fx.getParam("noise_feature_id"); // noise feature is chosen using fxhash params
var noise_form = $fx.getParam("noise_form_id"); // noise form is chosen using fxhash params
var noise_form_scales = noise_form == "expressive" ? [1.0, 1.0] : [0.1, 0.25]; // factors which will scale noise sampling dimensions
var noise_cull_rule = $fx.getParam("noise_cull_id"); // noise cull rule is chosen using fxhash params
var dimension_type = $fx.getParam("dimension_id"); // element dimensions are chosen using fxhash params
var jitter_reduction = (dimension_type == "voxel" || dimension_type == "needle") ? 0.5 : 1.0; // if dimension type is "voxel" or "needle" there will be less random jitter of the elements
if (dimension_type == "wire") {jitter_reduction = 0.75}; // for dimension type "wire" random jitter is set to medium value between min and max
var attachment_type = $fx.getParam("attachment_id"); // attachment type is chosen using fxhash params
var exploded = $fx.getParam("explosion_id"); // explosion is chosen using fxhash params
var explosion_power = $fx.getParam("power_id"); // explosion is chosen using fxhash params

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

var grid_offset_x = -(grid_nr_x * (c_xy_scale + x_gap)) / 2.0;
var grid_offset_y = extra_offset -(grid_nr_y * (c_length + y_gap)) / 2.0;
var grid_offset_z = -(grid_nr_z * (c_xy_scale + x_gap)) / 2.0;
var total_elements_existing = 0; // will be calculated later
var total_possible_elements = grid_nr_x * grid_nr_y * grid_nr_z;



// additional color features appearing
var color_features_vert = gene_weighted_choice(allel_color_features_vert);
var color_features_horiz = gene_weighted_choice(allel_color_features_horiz);
var color_features = [color_features_vert, color_features_horiz];

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



// NOISE PARAMETERS

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


// EXPLOSION PARAMETERS

var explosion_center_a = new THREE.Vector3(gene_range(-200, 200), gene_range(-200, 200), 0);
var explosion_strength = 200000 * explosion_power; //200k - 1M when, falls with the square of distance
var explosion_rot_range = Math.PI/2;
var explosion_rot_factor = 0.1;
