import { test } from "node:test";
import assert from "node:assert/strict";
import { tokens } from "../src/lib/codeTokens.ts";

test("tokens renders an unknown lang as plain text", () => {
  assert.deepEqual(tokens("ls -la", "fortran"), [["plain", "ls -la"]]);
});

test("tokens keeps every character of the source", () => {
  const code = 'const a = "x"; // b';
  assert.equal(tokens(code, "tsx").map(([, text]) => text).join(""), code);
});
