/**
 * Expo CLI (nested under root node_modules/expo) requires expo-router via
 * Node resolution. In this monorepo, React version skew keeps expo-router
 * nested under apps/mobile/node_modules, so typedRoutes crashes on start.
 * Junction/symlink it to the root node_modules when needed.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const target = path.join(root, "apps", "mobile", "node_modules", "expo-router");
const link = path.join(root, "node_modules", "expo-router");

function canResolveFromRoot() {
  try {
    require.resolve("expo-router/_ctx-shared", { paths: [root] });
    return true;
  } catch {
    return false;
  }
}

if (!fs.existsSync(target)) {
  process.exit(0);
}

if (canResolveFromRoot()) {
  process.exit(0);
}

if (fs.existsSync(link)) {
  fs.rmSync(link, { recursive: true, force: true });
}

const type = process.platform === "win32" ? "junction" : "dir";
fs.symlinkSync(target, link, type);
console.log(`linked expo-router -> ${path.relative(root, target)}`);
