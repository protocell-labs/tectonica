//////FXHASH PARAMS//////
// we can use $fx.getParam("param_id") to get the selected param in the code

$fx.params([
    {
      id: "seed_id",
      name: "Seed",
      type: "number",
      update: "page-reload",
      default: 0,
      options: {
        min: 0,
        max: 999,
        step: 1,
      },
    },
    {
      id: "triptych_id",
      name: "Triptych",
      type: "select",
      update: "page-reload",
      default: "middle",
      options: {
        options: ["left",
                  "middle",
                  "right"],
      }
    },
    {
      id: "pigments_id",
      name: "Pigments",
      type: "select",
      update: "page-reload",
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
      update: "page-reload",
      options: {
        options: ["noisy", "graded", "layered", "stacked", "composed"],
      }
    },
    {
      id: "dimension_id",
      name: "Dimension",
      type: "select",
      update: "page-reload",
      options: {
        options: ["voxel", "pin", "stick", "needle", "wire"],
      }
    },
    {
      id: "noise_feature_id",
      name: "Structure",
      type: "select",
      update: "page-reload",
      options: {
        options: ["cracks", "bands", "sheets", "unbiased"],
      }
    },
    {
      id: "noise_form_id",
      name: "Form",
      type: "select",
      update: "page-reload",
      default: "expressive",
      options: {
        options: ["expressive", "monolithic"],
      }
    },
    {
      id: "noise_cull_id",
      name: "Dissipation",
      type: "select",
      update: "page-reload",
      options: {
        options: ["clean", "fuzzy"],
      }
    },
    {
      id: "attachment_id",
      name: "Attachment",
      type: "select",
      update: "page-reload",
      default: "tight",
      options: {
        options: ["dense", "tight", "detached", "loose", "floating"],
      }
    },
    {
      id: "explosion_id",
      name: "Exploded",
      type: "boolean",
      update: "page-reload",
      default: false,
    },
    {
      id: "power_id",
      name: "Power",
      type: "number",
      update: "page-reload",
      default: 2,
      options: {
        min: 0, // 1
        max: 5, // 5
        step: 0.1, // 1
      },
    },
  ]);