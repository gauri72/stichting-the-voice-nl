/**
 * Normalizes font-size declarations across client/src/styles to the V.O.I.C.E. typography scale.
 * Run: node scripts/normalize-typography.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STYLES_DIR = path.join(__dirname, "../src/styles");

const HEADING_HINT =
  /hero|__title|section-title|page-title|page-heading|heading|subtitle|display|banner|impact-title|impact-subtitle|breadcrumb.*title|-title\b|__name\b|__label\b.*uppercase/i;

const SKIP_FILES = new Set(["typography.css", "poppins.css"]);

function isHeadingContext(line) {
  return HEADING_HINT.test(line) || /font-size:\s*clamp\(/.test(line);
}

function normalizeLine(line) {
  if (!line.includes("font-size:")) return line;

  let next = line;

  // px → rem scale
  const pxMap = [
    [/\bfont-size:\s*16px\b/g, "font-size: var(--font-body)"],
    [/\bfont-size:\s*15px\b/g, "font-size: var(--font-body)"],
    [/\bfont-size:\s*14px\b/g, "font-size: var(--font-small)"],
    [/\bfont-size:\s*13px\b/g, "font-size: var(--font-small)"],
    [/\bfont-size:\s*12px\b/g, "font-size: var(--font-small)"],
    [/\bfont-size:\s*11px\b/g, "font-size: var(--font-small)"],
    [/\bfont-size:\s*10px\b/g, "font-size: var(--font-small)"],
    [/\bfont-size:\s*9px\b/g, "font-size: var(--font-small)"],
    [/\bfont-size:\s*8px\b/g, "font-size: var(--font-small)"],
    [/\bfont-size:\s*7px\b/g, "font-size: var(--font-small)"],
    [/\bfont-size:\s*18px\b/g, "font-size: var(--font-card-title)"],
    [/\bfont-size:\s*17px\b/g, "font-size: var(--font-body)"],
    [/\bfont-size:\s*20px\b/g, "font-size: var(--font-section-title)"],
    [/\bfont-size:\s*21px\b/g, "font-size: var(--font-section-title)"],
    [/\bfont-size:\s*22px\b/g, "font-size: var(--font-section-title)"],
    [/\bfont-size:\s*24px\b/g, "font-size: var(--font-section-title)"],
    [/\bfont-size:\s*28px\b/g, "font-size: var(--font-page-title)"],
    [/\bfont-size:\s*30px\b/g, "font-size: var(--font-page-title)"],
    [/\bfont-size:\s*32px\b/g, "font-size: var(--font-page-title)"],
  ];

  for (const [pattern, replacement] of pxMap) {
    next = next.replace(pattern, replacement);
  }

  if (isHeadingContext(line)) {
    return next;
  }

  // rem values below minimum readable (0.875rem)
  next = next.replace(/font-size:\s*(0\.(?:[0-6]\d|7[0-4])\d*)rem/g, (match, size) => {
    const val = parseFloat(size);
    if (val < 0.875) return "font-size: var(--font-small)";
    return match;
  });

  // Normalize common body rem sizes to tokens
  next = next.replace(/\bfont-size:\s*1rem\b/g, "font-size: var(--font-body)");
  next = next.replace(/\bfont-size:\s*0\.875rem\b/g, "font-size: var(--font-small)");

  return next;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  const lines = original.split("\n");
  let changes = 0;
  const updated = lines.map((line) => {
    const normalized = normalizeLine(line);
    if (normalized !== line) changes += 1;
    return normalized;
  });

  if (changes > 0) {
    fs.writeFileSync(filePath, updated.join("\n"), "utf8");
  }

  return changes;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.name.endsWith(".css") && !SKIP_FILES.has(entry.name)) results.push(full);
  }

  return results;
}

const files = walk(STYLES_DIR);
const report = [];

for (const file of files) {
  const changes = processFile(file);
  if (changes > 0) {
    report.push({ file: path.relative(path.join(__dirname, ".."), file), changes });
  }
}

console.log(JSON.stringify({ filesUpdated: report.length, details: report }, null, 2));
