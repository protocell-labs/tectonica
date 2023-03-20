//////PARAMS//////


//////FXHASH PARAMS//////
// we can use $fx.getParam("param_id") to get the selected param in the code

$fx.params([
  {
    id: "pigments_id",
    name: "Pigments",
    type: "select",
    options: {
      options: ["horizon, sunshine, grapefruit",
                "night, embers, citrus",
                "ivy, apatite, tourmaline",
                "sodalite, glacier, rust",
                "ocean, lapis, sulphur",
                "moss, cedar, algae",
                "ink, steel, salt",
                "charcoal, papyrus, marble",
                "murex, rhodochrosite, marshmallow",
                "furnace, ruby, soot"],
    }
  },
  {
    id: "noise_feature_id",
    name: "Structure",
    type: "select",
    options: {
      options: ["cracks", "bands", "sheets", "unbiased"],
    }
  },
  {
    id: "noise_form_id",
    name: "Form",
    type: "select",
    default: "expressive",
    options: {
      options: ["expressive", "monolithic"],
    }
  },
  {
    id: "noise_cull_id",
    name: "Dissipation",
    type: "select",
    options: {
      options: ["clean", "fuzzy"],
    }
  },
  {
    id: "dimension_id",
    name: "Dimension",
    type: "select",
    options: {
      options: ["pixel", "pin", "stick", "beam", "straw"],
      //options: ["pixel"],
    }
  },
  {
    id: "attachment_id",
    name: "Attachment",
    type: "select",
    default: "tight",
    options: {
      options: ["dense", "tight", "detached", "loose", "floating"],
    }
  },
]);


// examples of params from the fxhash boilerplate
/*
$fx.params([
  {
    id: "number_id",
    name: "A number/float64",
    type: "number",
    //default: Math.PI,
    options: {
      min: 1,
      max: 10,
      step: 0.00000000000001,
    },
  },
  {
    id: "bigint_id",
    name: "A bigint",
    type: "bigint",
    //default: BigInt(Number.MAX_SAFE_INTEGER * 2),
    options: {
      min: Number.MIN_SAFE_INTEGER * 4,
      max: Number.MAX_SAFE_INTEGER * 4,
      step: 1,
    },
  },
  {
    id: "select_id",
    name: "A selection",
    type: "select",
    //default: "pear",
    options: {
      options: ["apple", "orange", "pear"],
    }
  },
  {
    id: "color_id",
    name: "A color",
    type: "color",
    //default: "ff0000",
  },
  {
    id: "boolean_id",
    name: "A boolean",
    type: "boolean",
    //default: true,
  },
  {
    id: "string_id",
    name: "A string",
    type: "string",
    //default: "hello",
    options: {
      minLength: 1,
      maxLength: 64
    }
  },
]);
*/


//////SETTINGS//////
var dynamic_track = false;
var linewidth_scale = 0.00001; // 0.00001, line width to line length ratio
var loading_start_time = new Date().getTime();
var min_loading_time = 1000; // this is the minimum that the loading screen will be shown, in miliseconds
var debug = true;
var cam_factor = 4; //controls the "zoom" when using orthographic camera, default was 4
var cam_factor_mod;
var aspect_ratio = '0.75'; ////OVERRIDE//// 0.75 - portrait
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

/*const allel_noise_cull_rule = [
  ["clean", 65],
  ["fuzzy", 35]
];*/

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

/*const allel_noise_features = [
  ["cracks", 20],
  ["bands", 20],
  ["sheets", 30],
  ["unbiased", 30]
];*/

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
  "pixel": ['square 1x1', 5, 5, 110, 130, 30],
  "pin": ['square 1x1', 5, 25, 110, 31, 30],
  "stick": ['square 1x1', 5, 50, 110, 16, 30],
  "beam": ['square 1x1', 5, 100, 110, 9, 30],
  "straw": ['square 1x1', 2, 100, 180, 9, 30]
}

const attachment_values = {
  "dense": 0,
  "tight": 1,
  "detached": 10,
  "loose": 25,
  "floating": 50
}

const cylinder_params = {
  'standard' : [0.5, 0.5, 1, 6, 1],
  'square beam' : [0.5, 0.5, 1, 4, 1],
  'square 1x1' : [0.7, 0.7, 1, 4, 1] // first parameter is the radius, which gives us a square with a side close to 1.0
}






var pigments = $fx.getParam("pigments_id"); // pigments are chosen using fxhash params
var palette_name = gene_pick_key(palette_pigments[pigments]); // choose palette name at random from a palette pigment list
var chosen_palette = palette_pigments[pigments][palette_name].slice(0); // make a copy of the chosen color palette
shuffleArray(chosen_palette); // randomly shuffle the colors in the palette - this way we can keep the order of probabilities the same in the loop below

var noise_feature = $fx.getParam("noise_feature_id"); // noise feature is chosen using fxhash params
var noise_form = $fx.getParam("noise_form_id"); // noise form is chosen using fxhash params
var noise_form_scales = noise_form == "expressive" ? [1.0, 1.0] : [0.1, 0.25]; // factors which will scale noise sampling dimensions
var noise_cull_rule = $fx.getParam("noise_cull_id"); // noise cull rule is chosen using fxhash params
var dimension_type = $fx.getParam("dimension_id"); // element dimensions are chosen using fxhash params
var attachment_type = $fx.getParam("attachment_id"); // attachment type is chosen using fxhash params

var c_type = dimensions[dimension_type][0]; // profile type
var c_xy_scale = dimensions[dimension_type][1]; // element thickness
var c_length = dimensions[dimension_type][2]; // element length
var grid_nr_x = dimensions[dimension_type][3]; // number in x (width)
var grid_nr_y = dimensions[dimension_type][4]; // number in y (height)
var grid_nr_z = dimensions[dimension_type][5]; // number in z (depth)


var y_gap = attachment_values[attachment_type]; // y_gap will depend on the attachment type
var x_gap = dimension_type == "pixel" ? 0 : 1; // x_gap is 0 for pixel dimension, otherwise it's always 1


var grid_offset_x = -(grid_nr_x * (c_xy_scale + x_gap)) / 2.0;
var grid_offset_y = -(grid_nr_y * (c_length + y_gap)) / 2.0;
var grid_offset_z = -(grid_nr_z * (c_xy_scale + x_gap)) / 2.0;
var total_elements_existing = 0; // will be calculated later
var total_possible_elements = grid_nr_x * grid_nr_y * grid_nr_z;



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

//var noise_cull_rule = gene_weighted_choice(allel_noise_cull_rule); // rule for culling elements using noise
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


//var noise_feature = gene_weighted_choice(allel_noise_features); // "cracks", "bands", "sheets", "unbiased"
//var noise_feature = "unbiased";

var noise_height_f = c_length/c_xy_scale; // noise height factor

var noise_scale_x, noise_scale_y, noise_scale_z;
if (noise_feature == "cracks") {
  noise_scale_x = gene_weighted_choice(allel_noise_scale_x) * noise_form_scales[1];
  noise_scale_y = 0.01 * noise_form_scales[0]; //0.01
  noise_scale_z = 0.025; //0.025

} else if (noise_feature == "bands") {
  noise_scale_x = 0.01 * noise_form_scales[0]; //0.01
  noise_scale_y = gene_weighted_choice(allel_noise_scale_y);
  noise_scale_z = 0.05 * noise_form_scales[0]; //0.05

} else if (noise_feature == "sheets") {
  noise_scale_x = 0.01 * noise_form_scales[0]; //0.01
  noise_scale_y = 0.01 * noise_form_scales[0]; //0.01
  noise_scale_z = gene_weighted_choice(allel_noise_scale_z);

} else { // in any other case, noise_feature == "unbiased"
  noise_scale_x = 0.01 * noise_form_scales[0]; //0.01
  noise_scale_y = 0.01 * noise_form_scales[0]; //0.01
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



// how much is thickness of the member scaled for every stage
const thickness_scale_per_stage = {
  'getting_thinner' : [1.2, 1.1, 1.0, 0.9, 0.8, 0.7, 0.6, 0.6, 0.6],
  'moderate_constant' : [5, 5, 5, 5, 5, 5, 5, 5, 5],
  'thick_constant' : [20, 20, 20, 20, 20, 20, 20, 20, 20]
}



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


