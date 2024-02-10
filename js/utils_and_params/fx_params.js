//////FXHASH PARAMS//////
// we can use $fx.getParam("param_id") to get the selected param in the code

$fx.params([
    {
      id: "seed_id",
      name: "seed",
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
      name: "triptych",
      type: "select",
      update: "page-reload",
      default: "middle",
      options: {
        options: ["left",
                  "middle",
                  "right"],
      }
    },
  ]);