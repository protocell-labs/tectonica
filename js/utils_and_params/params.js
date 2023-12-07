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



// color palettes inspirations

// "horizon, sunshine, grapefruit": Otti Berger, Gunta Stölzl, Anni Albers, Marianne Brandt, Benita Koch-Otte, Gertrude Arndt, Alma Siedhoff-Buscher, Margarete Heymann
// "night, embers, citrus": Ludwig Mies van der Rohe, Marcel Breuer, Walter Gropius, Le Corbusier
// "ivy, apatite, tourmaline": Georgia O'Keeffe, Salvador Dalí, Henri Matisse, Wassily Kandinsky, Marc Chagall, Almada Negreiros, Pablo Picasso, Paul Klee
// "sodalite, glacier, rust": Max Planck, Sir Joseph John Thomson, Albert Einstein, Werner Heisenberg, Niels Bohr, Richard Feynman, Paul Dirac
// "ocean, lapis, sulphur": Charles Babbage, Ada Lovelace, Gottfried Wilhelm Leibniz, George Boole
// "moss, cedar, algae": Zancan, John Muir, Henry David Thoreau
// "ink, steel, salt": Katsushika Hokusai, Utagawa Hiroshige
// "charcoal, papyrus, marble": charcoal, marble, Ansel Adams, New York Times
// "murex, rhodochrosite, marshmallow": Marvin Minsky, Allen Newell, Herbert A. Simon, John McCarthy, Ray Solomonoff, Claude Shannon, John von Neumann, Alan Turing
// "furnace, ruby, soot": Anish Kapoor, Kjetil Golid, Kwame Bruce Busia, Donald Judd, Kazimir Malevich

// palette encoding based on "Code-golfing color palettes in JavaScript"
// from: https://gist.github.com/mattdesl/58b806478f4d33e8b91ed9c51c39014d

const pigment_codes = {
  "horizon, sunshine, grapefruit":      ["૟࿾྅࿥:ుඡɘ໭:࿽ณɺྱ:ο࿭ླ༤:๒າқ࿽ߌ:ศຳ͚໭:ະแɩ໌໮:ย࿂ƛྫ࿭", ["Otti", "Stölzl", "Albers", "Brandt", "Koch-Otte", "Arndt", "Siedhoff-Buscher", "Heymann"]],
  "night, embers, citrus":              ["གྷ࿖ɗ࿿đ:ྰึɺ࿽đ:࿽ณɺྱđ:ག࿀Ҍ࿽đ", ["van der Rohe", "Breuer", "Gropius", "Le Corbusier"]],
  "ivy, apatite, tourmaline":           ["Dྗ໚֊:ไཱུ࿆࿶ǌ:­h࿀࿽഑:ྰึɺΖ࿽:ྠŪ໭โ:࿍࿢ʽڃ๧࿾:༷໓їƩ໭:റඓu໊ࢗު", ["O'Keeffe", "Dalí", "Matisse", "Kandinsky", "Chagall", "Negreiros", "Picasso", "Klee"]],
  "sodalite, glacier, rust":            ["࿾റɇđ:Ņ໾ѩབ:໬ೋȤข:࿿ฒงZ׎:ྚIƌޮ૝࿿:Iպངྻ࿾:ൄ෮ͩȵ્", ["Planck", "Thomson", "Einstein", "Heisenberg", "Bohr", "Feynman", "Dirac"]],
  "ocean, lapis, sulphur":              ["ĺɈɽڭ࿕:෿¿Y$:࿿૭ŭȤ࿒:đŘ࿃࿨৉", ["Babbage", "Lovelace", "Leibniz", "Boole" ]],
  "moss, cedar, algae":                 ["ђރவȡ࿿:೉Փ͂Ȳ:ŅƖࣙ೛࿭", ["Zancan", "Muir", "Thoreau"]],
  "ink, steel, salt":                   ["ޚ಺ොĤф:໬ȵĤĒ", ["Hokusai", "Hiroshige"]],
  "charcoal, papyrus, marble":          ["đđȢȢ̳:ೋ໬࿽໭࿿࿭:໬Ȣđ:໬ೋđ", ["Charcoal", "Marble", "Adams", "New York Times"]],
  "murex, rhodochrosite, marshmallow":  ["೯ཙ࿎࿮:ࠍഫྌ࿆໮:ĶԷ࠷ཇ࿽:κߊේྙ༷:๹ۍࡨ࿿:٘ޚඊ࿋:Ђԃ܅अ࿽:ขุщđ໭", ["Minsky", "Newell", "Simon", "McCarthy", "Solomonoff", "Shannon", "von Neumann", "Turing"]],
  "furnace, ruby, soot":                ["ःఃན࿀࿽:࿄໭ནྛ:࿽ณđ:ณขറ༤โฒྠྱ྅đ:໭ณđ࿌", ["Kapoor", "Golid", "Busia", "Judd", "Malevich"]]
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
var chosen_code = pigment_codes[pigments][0]; // palette code is picked based on the pigment name
var decoded_palettes = chosen_code.split(":").map(s=>s.split("").map(k=>'#'+`00${k.charCodeAt(0).toString(16)}`.slice(-3))); // decode pigment code into a set of palettes
var palette_idx = gene_rand_int(0, decoded_palettes.length); // choose random number as a palette index - equal probability
var chosen_palette = decoded_palettes[palette_idx]; // choose palette based on the index number
var palette_name =  pigment_codes[pigments][1][palette_idx]; // choose corresponding palette name from a list (matched with a palette through ordering)
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
