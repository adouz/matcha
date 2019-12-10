module.exports = {
  presets: [
    ["@babel/preset-env"]
  ],plugins: [
    [
      "babel-plugin-transform-builtin-extend",
      {
        globals: ["Error", "Array"]
      }
    ],
    ["@babel/plugin-transform-new-target"]
  ]
}
