const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'open-city-rise-safe.html');
const mainPath = path.join(__dirname, 'main.cjs');
const preloadPath = path.join(__dirname, 'preload.cjs');
const assetPath = path.join(root, 'vendor', 'three.min.js');
const packagePath = path.join(root, 'package.json');

for (const target of [htmlPath, mainPath, preloadPath, assetPath, packagePath]) {
  assert.ok(fs.existsSync(target), 'Required app file is missing: ' + target);
}
const html = fs.readFileSync(htmlPath, 'utf8');
const gamePackage = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
assert.ok(html.includes('window.openCityDesktop?.isDesktop'), 'Desktop bridge is not used by the game');
assert.ok(html.includes("'./vendor/three.min.js'"), 'Game does not attempt to load its packaged Three.js file first');
assert.ok(html.includes('function gameKeyCode(e)'), 'The WASD keyboard fix is missing');
assert.ok(html.includes('配送任務完成'), 'City delivery missions are missing');
assert.ok(html.includes('開始警車追逐挑戰'), 'Police pursuit challenge is missing');
assert.ok(!/function\s+attack\s*\(/.test(html), 'Combat attack function must not be present');
assert.ok(!html.includes('makeGunModel('), 'Hand-held weapon models must not be present');
assert.ok(!html.includes('搶劫成功'), 'Crime robbery event must not be present');
assert.ok(!html.includes('case\'Digit1\':setWeapon'), 'Weapon key switching must not be present');
assert.ok(gamePackage.build.files.includes('open-city-rise-safe.html'), 'Safe app entry page is not packaged');
assert.ok(html.includes('KeyW') && html.includes('KeyA') && html.includes('KeyS') && html.includes('KeyD'), 'WASD key mappings are incomplete');
assert.equal(gamePackage.main, 'desktop-app/main.cjs');
assert.ok(gamePackage.build.win.target.some(t => (typeof t === 'string' ? t : t.target) === 'nsis'), 'Windows installer target is missing');
assert.ok(gamePackage.build.win.target.some(t => (typeof t === 'string' ? t : t.target) === 'portable'), 'Portable Windows target is missing');

let inlineScripts = 0;
for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
  const code = match[1].trim();
  if (!code) continue;
  new vm.Script(code, { filename: 'open-city-rise-inline-' + (++inlineScripts) + '.js' });
}
assert.ok(inlineScripts > 0, 'No inline game script was found');
const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
assert.deepEqual(duplicateIds, [], 'Duplicate HTML IDs found: ' + duplicateIds.join(', '));
const asset = fs.readFileSync(assetPath, 'utf8');
assert.ok(asset.includes('REVISION') || asset.includes('THREE'), 'The packaged Three.js asset does not look valid');
console.log('PASS: desktop app files, local Three.js, Windows targets, inline JS syntax and WASD mappings verified.');
