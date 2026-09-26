/*
 * Copies the 58 photos still served by Mocha into ./img/content and points
 * the app at that local copy. Run it once from this folder, while the Mocha
 * link still works:
 *
 *     node download-assets.mjs
 *
 * Afterwards the app no longer needs Mocha and the subscription can go.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// work from this file's folder, wherever the command is typed from
process.chdir(path.dirname(fileURLToPath(import.meta.url)));

const CDN = "https://019beba1-942b-7e71-8d2c-d730501e122b.mochausercontent.com";
const OUT = path.join("img", "content");
const CONFIG = path.join("js", "config.js");

const files = JSON.parse(fs.readFileSync("assets-list.json", "utf-8"));
fs.mkdirSync(OUT, { recursive: true });

let ok = 0;
const failed = [];
for (const name of files) {
  const dest = path.join(OUT, name);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
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

console.log(`\n${ok}/${files.length} photos saved to ./${OUT.replace(/\\/g, "/")}`);
if (failed.length) {
  console.log(`\n${failed.length} could not be fetched; the app keeps using Mocha until they are:\n` + failed.map((f) => "  - " + f).join("\n"));
  process.exit(1);
}

const before = fs.readFileSync(CONFIG, "utf-8");
const after = before.replace(/export const IMG_BASE = "[^"]*";/, 'export const IMG_BASE = "/img/content";');
if (after !== before) {
  fs.writeFileSync(CONFIG, after);
  console.log("✓ js/config.js now loads photos from /img/content");
} else {
  console.log("· js/config.js already points at /img/content");
}
console.log("\nDone. Deploy again, then the Mocha subscription can be cancelled.");
