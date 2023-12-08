//////UTILS//////

function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

// rand functions for random generator. Assumes generator producing float point between 0 and 1

function gene_rand_int_proto(gene){
  function gene_rand_int(min,max){
    return Math.floor((gene() * (max-min)) + min);
  }
  return gene_rand_int;
}

function gene_range_proto(gene){
  function gene_range(min, max){
    return (gene() * (max - min)) + min;
  }
  return gene_range;
}

function gene_pick_n_proto(gene){
  function gene_pick_n(min, max, n){
    var unique_list = [];
    for (var i = 0; i < n; i++) {
      unique_list.push(Math.floor((gene() * (max-min)) + min));
    }
    return unique_list;
  }
  return gene_pick_n;
}

function gene_weighted_choice_proto(gene){
  function gene_weighted_choice(data){
    let total = 0;
    for (let i = 0; i < data.length; ++i) {
        total += data[i][1];
    }
    const threshold = gene() * total;
    total = 0;
    for (let i = 0; i < data.length - 1; ++i) {
        total += data[i][1];
        if (total >= threshold) {
            return data[i][0];
        }
    }
    return data[data.length - 1][0];
  }
return gene_weighted_choice;
}

// choose a random property name (key) from an object
function gene_pick_key_proto(gene) {
  function gene_pick_key(obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * gene() << 0];
  }
  return gene_pick_key;
}

// choose a random property from an object
function gene_pick_property_proto(gene) {
  function gene_pick_property(obj) {
    var keys = Object.keys(obj);
    return obj[keys[keys.length * gene() << 0]];
  }
  return gene_pick_property;
}

// randomize array in-place using Durstenfeld shuffle algorithm, an optimized version of Fisher-Yates
function shuffleArray_proto(gene) {
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(gene() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  }
return shuffleArray;
}


// random functions for specific implementation
//var gene = $fx.rand; // fxhash version of Math.random(), uses the unique hash injected into the code as a seed
let seed = $fx.getParam("seed_id");
let artwork_seed = $fx.minter + "_seed_" + seed.toString(); // artwork seed is composed of minter wallet address and chosen effect number
const gene = new Math.seedrandom(artwork_seed); // seeded PRNG for general use
const gene_t_l = new Math.seedrandom(artwork_seed + "_triptych_left"); // seeded PRNG for random stars - triptych left
const gene_t_r = new Math.seedrandom(artwork_seed + "_triptych_right"); // seeded PRNG for random stars - triptych right

// random functions seeded with artwork_seed
const gene_rand_int = gene_rand_int_proto(gene);
const gene_range = gene_range_proto(gene);
const gene_pick_n = gene_pick_n_proto(gene);
const gene_weighted_choice = gene_weighted_choice_proto(gene);
const gene_pick_key = gene_pick_key_proto(gene);
const gene_pick_property = gene_pick_property_proto(gene);
const shuffleArray = shuffleArray_proto(gene)

function sigmoid(z, k) {
  return 1 / (1 + Math.exp(-z/k));
}

// calculates a number between two numbers at a specific increment
// noise culling is working differently if we remove this function !!! (leave it in for tectonica)
function lerp(start, end, amt){
  return (1 - amt) * start + amt * end;
}

function shiftArrayCopy(arr){
  arrCopy = [...arr];
  let last = arrCopy.pop();
  arrCopy.unshift(last);
  return arrCopy;
}
