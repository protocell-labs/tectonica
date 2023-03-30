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
      id: "pattern_id",
      name: "Pattern",
      type: "select",
      options: {
        options: ["noisy", "graded", "layered", "stacked", "composed"],
      }
    },
    {
      id: "dimension_id",
      name: "Dimension",
      type: "select",
      options: {
        options: ["voxel", "pin", "stick", "needle", "wire"],
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
      id: "attachment_id",
      name: "Attachment",
      type: "select",
      default: "tight",
      options: {
        options: ["dense", "tight", "detached", "loose", "floating"],
      }
    },
    {
      id: "explosion_id",
      name: "Exploded",
      type: "boolean",
      default: false,
    },
    {
      id: "power_id",
      name: "Power",
      type: "number",
      default: 2,
      options: {
        min: 0, // 1
        max: 5, // 5
        step: 0.1, // 1
      },
    },
    {
      id: "coordinates_id",
      name: "Coordinates",
      type: "string",
      //default: "hello",
      options: {
        minLength: 64,
        maxLength: 64
      }
    },
  ]);


/*
  const allel_color_gradient = [
    ["solid sprinkled", "uniform", "vertical grading", "horizontal grading", "height stack", "depth stack"]
  ];
  */