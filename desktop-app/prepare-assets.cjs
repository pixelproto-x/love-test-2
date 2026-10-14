const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'node_modules', 'three', 'build', 'three.min.js');
const vendor = path.join(root, 'vendor');
const target = path.join(vendor, 'three.min.js');

if (!fs.existsSync(source)) {
  console.error('Three.js asset is missing. Run npm install before preparing the app.');
  process.exit(1);
}
fs.mkdirSync(vendor, { recursive: true });
fs.copyFileSync(source, target);
const bytes = fs.statSync(target).size;
if (bytes < 100000) {
  console.error('The copied Three.js file is unexpectedly small; refusing to package it.');
  process.exit(1);
}
console.log('Prepared local Three.js asset:', target, '(' + bytes.toLocaleString() + ' bytes)');
