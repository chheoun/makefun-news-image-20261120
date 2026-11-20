// Reproducible news-image entry: validate and copy the fixed PNG to the grader output.
import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const input = new URL('./entry.png', import.meta.url);
const image = readFileSync(input);
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
if (!image.subarray(0, 8).equals(signature)) throw new Error('entry.png must be a PNG');
if (image.readUInt32BE(16) > 1024 || image.readUInt32BE(20) > 1024) {
  throw new Error('entry.png must be at most 1024×1024');
}
if (statSync(input).size > 1024 * 1024) throw new Error('entry.png exceeds 1 MiB');

const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(output, { recursive: true });
copyFileSync(input, join(output, 'entry.png'));
