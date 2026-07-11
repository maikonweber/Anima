const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];
// npm nests some Expo deps under workspace packages (React version skew with
// the Next.js app). Hierarchical lookup is required so Metro can find them.
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
