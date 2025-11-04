import fs from "fs";
import path from "path";

const srcDir = path.resolve("src/utils/assets");
const destDir = path.resolve("dist/utils/assets");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyEntry(src, dest) {
  if (typeof fs.cpSync === "function") {
    fs.cpSync(src, dest, { recursive: true, force: true });
    return;
  }
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) {
      copyEntry(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  }
}

ensureDir(destDir);

if (!fs.existsSync(srcDir)) {
  process.exit(0);
}

for (const entry of fs.readdirSync(srcDir)) {
  const srcPath = path.join(srcDir, entry);
  const destPath = path.join(destDir, entry);
  copyEntry(srcPath, destPath);
}

console.log(`[copy:assets] Copied assets from ${srcDir} to ${destDir}`);
