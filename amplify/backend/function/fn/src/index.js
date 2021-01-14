require("ts-node").register({
  project: "tsconfig.json",
  transpileOnly: true,
})
module.exports = require("./src/index")
