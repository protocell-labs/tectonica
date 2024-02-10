//////PARAMS//////


// settings
var loading_start_time = new Date().getTime();
var min_loading_time = 7000; // this is the minimum that the loading screen will be shown, in miliseconds, 5000
var debug = true;
var cam_factor = 4; // controls the "zoom" when using orthographic camera, default was 4
var cam_factor_mod;
var aspect_ratio = "0.5625"; //// 0.5625 - 16:9 aspect ratio, 0.75 - portrait (used in O B S C V R V M)
var global_rot_x = -Math.PI/16; // global rotation of the model around the X axis
var global_rot_y = Math.PI/16; // global rotation of the model around the Y axis

// color change
const flickerInterval = 100; // ms
const flickerDuration = 2000; // ms
const cycleDuration = 5000; // ms

// background rotation
const cycleBackground = 1000000; // modify for spin cycle rv: 1000000
const cycleBackgroundUpdate = 100; // modify for spin refresh rv: 100
const rotThetaDelta = Math.PI*2*cycleBackgroundUpdate/cycleBackground;
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

const allel_pigments = [
  ["horizon, sunshine, grapefruit", 8],
  ["night, embers, citrus", 4],
  ["ivy, apatite, tourmaline", 8],
  ["sodalite, glacier, rust", 7],
  ["ocean, lapis, sulphur", 4],
  ["moss, cedar, algae", 3],
  ["ink, steel, salt", 2],
  ["charcoal, papyrus, marble", 4],
  ["murex, rhodochrosite, marshmallow", 8],
  ["furnace, ruby, soot", 5]
];

const allel_pattern = [
  ["noisy", 2],
  ["graded", 3],
  ["layered", 3], 
  ["stacked", 1], 
  ["composed", 2]
];

const allel_dimension = [
  ["voxel", 2],
  ["pin", 3],
  ["stick", 3],
  ["needle", 3],
  ["wire", 1]
];

const allel_structure = [
  ["cracks", 1],
  ["bands", 1],
  ["sheets", 1],
  ["unbiased", 3]
];

const allel_form = [
  ["expressive", 9],
  ["monolithic", 1]
];

const allel_dissipation = [
  ["clean", 3],
  ["fuzzy", 1]
];

const allel_attachment = [
  ["tight", 80],
  ["detached", 10],
  ["loose", 5],
  ["floating", 5]
];


// global parameters
var triptych = $fx.getParam("triptych_id"); // type of triptych, default is "middle"
var pigments = gene_weighted_choice(allel_pigments); // choose pigments with probability proportional to the number of palettes in them (so each color palette has an equal probability of being chosen later)
var chosen_code = pigment_codes[pigments][0]; // palette code is picked based on the pigment name
var decoded_palettes = chosen_code.split(":").map(s=>s.split("").map(k=>'#'+`00${k.charCodeAt(0).toString(16)}`.slice(-3))); // decode pigment code into a set of palettes
var palette_idx = gene_rand_int(0, decoded_palettes.length); // choose random number as a palette index - equal probability
var chosen_palette = decoded_palettes[palette_idx]; // choose palette based on the index number
var palette_name =  pigment_codes[pigments][1][palette_idx]; // choose corresponding palette name from a list (matched with a palette through ordering)
shuffleArray(chosen_palette); // randomly shuffle the colors in the palette - this way we can keep the order of probabilities the same in the loop below

var pattern = gene_weighted_choice(allel_pattern);
var noise_feature = gene_weighted_choice(allel_structure); // overall structure of elements determined by non-uniform scaling of noise
var noise_form = gene_weighted_choice(allel_form); // expressive vs monolithic
var noise_cull_rule = gene_weighted_choice(allel_dissipation); // clean vs fuzzy edges
var dimension_type = gene_weighted_choice(allel_dimension); // size of elements
var attachment_type = gene_weighted_choice(allel_attachment); // gap between the vertical layers
var explosion_power = gene_range(5, 15); // explosion strength

// explosion parameters
var explosion_center_a = new THREE.Vector3(gene_range(-200, 200), gene_range(-200, 200), 0);
var explosion_strength = 150000 * explosion_power; // 200k - 1M when, falls with the square of distance - 200000 * explosion_power
var explosion_rot_range = Math.PI/2;
var explosion_rot_factor = 20.0;
