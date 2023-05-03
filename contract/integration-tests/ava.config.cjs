require("util").inspect.defaultOptions.depth = 5; // increase AVA printing depth

module.exports = {
  files: ["**/*.ava.ts"],
  failWithoutAssertions: false,
  extensions: ["ts"],
  require: ["ts-node/register"],
};
