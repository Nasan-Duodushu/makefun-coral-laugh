// One Line, One Laugh — a single hilarious line, at most 200 characters.
// The program writes exactly one line to /output/entry.txt (UTF-8).
import { mkdirSync, writeFileSync, chmodSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const MAX_CHARS = 200;

const LINE =
  "I told my AI assistant I was lonely. It scheduled a meeting with myself and declined it on my behalf.";

function main(): void {
  // Normalise whitespace first so a stray double space can never slip in.
  const line = LINE.split(/\s+/).join(" ").trim();
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`line must be 1-${MAX_CHARS} chars, got ${line.length}`);
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry must be a single line");
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const target = join(OUTPUT_DIR, "entry.txt");
  writeFileSync(target, line + "\n", "utf8");
  chmodSync(target, 0o644);
  console.log(`${line.length} chars: ${line}`);
}

main();
