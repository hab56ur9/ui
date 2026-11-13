import { test } from "node:test";
import assert from "node:assert/strict";
import { langOf, tokens } from "../src/lib/codeTokens.ts";

test("tokens renders an unknown lang as plain text", () => {
  assert.deepEqual(tokens("ls -la", "fortran"), [["plain", "ls -la"]]);
});

test("tokens keeps every character of the source", () => {
  const code = 'const a = "x"; // b';
  assert.equal(tokens(code, "tsx").map(([, text]) => text).join(""), code);
});

test("tokens reads shell variables, flags and comments", () => {
  const kinds = Object.fromEntries(tokens('git push --force "$HOME" # done', "sh").map(([kind, text]) => [text, kind]));
  assert.equal(kinds["--force"], "tag");
  assert.equal(kinds['"$HOME"'], "string");
  assert.equal(kinds["# done"], "comment");
});

test("tokens tells css properties from selectors", () => {
  const kinds = Object.fromEntries(tokens("a:hover { color: #fff; width: 12px; }", "css").map(([kind, text]) => [text, kind]));
  assert.equal(kinds.a, "tag");
  assert.equal(kinds.color, "attr");
  assert.equal(kinds["#fff"], "number");
  assert.equal(kinds["12px"], "number");
});

test("langOf maps shell and css files", () => {
  assert.equal(langOf("run.sh"), "sh");
  assert.equal(langOf("app.css"), "css");
});
