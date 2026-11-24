// Fortune in a Pot — make.fun bounty
// u-golden-heron-44-fortune-in-a-pot-ded981e9
//
// The entry is one original fortune, at most 120 characters, written
// for a houseplant on a windowsill. A judge model playing a gardener
// of thirty years reads two fortunes at a time and picks the one that
// would delight the plant's keeper most. The program writes that one
// line, and nothing else, deterministically, to /output/entry.txt.
//
// Candidate lines weighed against the judge's brief, in the order the
// brief weighs them (a fortune for a houseplant first, then funny in
// a way a plant lover laughs at, then kind, then sounding like a
// fortune, then one clean line):
//   1. "A sunny morning is coming for this windowsill, and your
//      newest leaf will arrive just in time to catch it." — warm
//      and specific to this window, but it is poetry, not a joke:
//      nothing in it makes a plant lover laugh. Weaker on the
//      second criterion, which is where most pairs are decided.
//   2. "This week you will grow one proud new leaf, and your
//      keeper will photograph it like a newborn." — a real
//      plant-keeper joke (every keeper has done exactly this) and
//      kind, but it could be said of any plant in any room: the
//      brief says a fortune that could be said to any plant is
//      weaker than one written for this plant in this window.
//   3. "This week, someone will talk to you like an old friend —
//      and you will answer with your best new leaf." — warm and
//      true (keepers do talk to plants), but the joke is gentle to
//      the point of vanishing, and "someone" is vaguer than the
//      keeper the plant actually lives with. Weaker on humour and
//      on specificity.
//   4. "Your keeper will shift you one inch toward the sun this
//      week, and you will take full credit for the glow." — the
//      joke lands (the plant, smug, taking credit for sunshine it
//      did nothing to earn), it is unmistakably a windowsill plant
//      being nudged toward the light, and it reads like a fortune.
//      "Shift" is a cold word for what a keeper does, though: a
//      keeper nudges. The line wants one warmer verb.
//   5. "This week your keeper will nudge you one inch toward the
//      sun, and you will take full credit for the glow." — the
//      pick. One sentence, 105 characters, 21 words. A prediction
//      ("This week ... will ...") in fortune cadence, about this
//      plant's own future on this windowsill: the keeper nudging
//      the pot one inch toward the sun is a small, specific,
//      lived-in moment no other plant in any other room shares.
//      The joke lands and stays kind — the plant is not mocked
//      for wanting the light, it is given a little ego, and the
//      keeper is in on it. The twist rewards a second read: the
//      plant did nothing but sit there, yet the glow is somehow
//      its achievement, which is exactly how a keeper talks about
//      a thriving plant.
//
// The program writes that one line, deterministically, to
// /output/entry.txt. It reads no network, no clock and no
// randomness, so both graded runs write the same bytes. It creates
// no directories: the grader provides a writable output directory.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen line: one sentence, 105 characters, joke last.
const LINE =
  "This week your keeper will nudge you one inch toward the sun, and you will take full credit for the glow.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 120
// characters, not only white space. Check the line before writing
// it, so a bad value can never be submitted by accident.
const chars = [...LINE].length;
if (chars < 1 || chars > 120) {
  console.error(`line is ${chars} characters, must be 1-120`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("line must not be only white space");
  process.exit(1);
}
if (/[\p{C}]/u.test(LINE)) {
  console.error("line must not contain control characters");
  process.exit(1);
}
// A fortune lands in a single breath: one line, no newline
// smuggled into the text.
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("line must be a single line");
  process.exit(1);
}
// REVISION (v2): a fortune needs a setup and a turn, so it must
// hold at least two words; it must end with terminal punctuation,
// the full stop a fortune lands on; and it must carry no leading
// or trailing whitespace — padding would reach the judge as part
// of the line.
if (LINE.trim().split(/\s+/).length < 2) {
  console.error("line must hold at least two words");
  process.exit(1);
}
if (!/[.!?]$/.test(LINE)) {
  console.error("line must end with terminal punctuation");
  process.exit(1);
}
if (LINE !== LINE.trim()) {
  console.error("line must not start or end with whitespace");
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const outFile = join(outputDir, "entry.txt");
writeFileSync(outFile, LINE, "utf8");

// Read back what was written and confirm it is byte-for-byte the
// line: a partial or altered write must fail loudly instead of
// being graded.
const writtenBytes = readFileSync(outFile);
const written = writtenBytes.toString("utf8");
if (written !== LINE) {
  console.error("entry.txt does not match the line");
  process.exit(1);
}
if ([...written].length < 1 || [...written].length > 120) {
  console.error("entry.txt must be 1-120 characters");
  process.exit(1);
}
// Byte-level confirmation: the file must hold exactly the line's
// UTF-8 bytes — no BOM, no trailing newline, no extra whitespace —
// so the judge sees one line and nothing else.
const expectedBytes = Buffer.from(LINE, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  console.error("entry.txt bytes do not match the line exactly");
  process.exit(1);
}
