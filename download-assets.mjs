/*
 * Pulls the 58 images still served by Mocha into ./assets, then points the
 * four pages at that local copy. Run it once, from this folder, while the
 * Mocha CDN is still up:
 *
 *     node download-assets.mjs
 *
 * Afterwards the app has no dependency on Mocha at all and you can cancel
 * the subscription.
 */

import fs from "fs";
import path from "path";

const CDN = "https://019beba1-942b-7e71-8d2c-d730501e122b.mochausercontent.com";
const PAGES = ["index.html", "categories.html", "offers.html", "contact.html"];
const OUT = "assets";

const files = JSON.parse(fs.readFileSync("assets-list.json", "utf-8"));
fs.mkdirSync(OUT, { recursive: true });

let ok = 0;
const failed = [];

for (const name of files) {
  const dest = path.join(OUT, name);
  if (fs.existsSync(dest)) {
    ok++;
    console.log(`· ${name} (already here)`);
    continue;
  }
  try {
    const res = await fetch(`${CDN}/${encodeURIComponent(name)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
    console.log(`✓ ${name}`);
  } catch (err) {
    failed.push(name);
    console.error(`✗ ${name} — ${err.message}`);
  }
}

console.log(`\n${ok}/${files.length} images saved to ./${OUT}`);

if (failed.length) {
  console.log(
    `\n${failed.length} could not be fetched. The pages are left pointing at\n` +
      `Mocha so nothing breaks; re-run once you sort those out:\n` +
      failed.map((f) => "  - " + f).join("\n")
  );
  process.exit(1);
}

/* Every image is local now, so switch the pages over. */
for (const page of PAGES) {
  const before = fs.readFileSync(page, "utf-8");
  const after = before.replace(
    'window.__IMG_BASE__ = ""',
    'window.__IMG_BASE__ = "./assets"'
  );
  if (before === after) {
    console.log(`· ${page} already points at ./assets`);
    continue;
  }
  fs.writeFileSync(page, after);
  console.log(`✓ ${page} now loads images from ./assets`);
}

console.log("\nDone. The app no longer needs Mocha.");
