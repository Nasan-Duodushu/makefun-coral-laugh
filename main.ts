// One Line, One Laugh — one hilarious line, at most 200 characters.
// Emits exactly one line to /output/entry.txt (UTF-8).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LIMIT = 200;

// The joke, kept as one literal: the assistant's "help" is the punchline.
const JOKE =
  "I told my AI assistant I was lonely. It scheduled a meeting with myself and declined it on my behalf.";

function problems(line: string): string[] {
  const found: string[] = [];
  if (line.length === 0) found.push("empty line");
  if (line.length > LIMIT) found.push(`too long: ${line.length} > ${LIMIT}`);
  if (line.includes("\n") || line.includes("\r")) {
    found.push("must stay on one line");
  }
  if (line !== line.trim()) found.push("leading or trailing space");
  return found;
}

async function main(): Promise<void> {
  const line = JOKE.replace(/[ \t]+/g, " ");
  const issues = problems(line);
  if (issues.length > 0) {
    throw new Error(`invalid entry: ${issues.join("; ")}`);
  }
  await mkdir(OUTPUT_DIR, { recursive: true });
  const target = join(OUTPUT_DIR, "entry.txt");
  await writeFile(target, `${line}\n`, { encoding: "utf8" });
  // Read it back: the file on disk must be exactly the line we validated.
  const written = await readFile(target, "utf8");
  if (written !== `${line}\n`) {
    throw new Error("written file does not match the validated entry");
  }
  console.log(`wrote ${line.length} chars to ${target}`);
  console.log(line);
}

await main();
