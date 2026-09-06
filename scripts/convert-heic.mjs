import heicConvert from 'heic-convert';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const BASE = '/home/nr/Downloads/Screen Grabs - segregated-20260802T092239Z-1-001/Screen Grabs - segregated';

function walk(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (extname(entry).toLowerCase() === '.heic') {
      convertFile(full);
    }
  }
}

async function convertFile(filePath) {
  const outPath = filePath.replace(/\.heic$/i, '.jpg');
  try {
    const input = readFileSync(filePath);
    const output = await heicConvert({ buffer: input, format: 'JPEG', quality: 0.92 });
    writeFileSync(outPath, output);
    console.log(`OK  ${basename(filePath)}`);
  } catch (e) {
    console.error(`ERR ${basename(filePath)}: ${e.message}`);
  }
}

walk(BASE);
