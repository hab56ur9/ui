import { test } from "node:test";
import assert from "node:assert/strict";
import { bytes, clock, clockTicks, duration, durationMs, milliseconds, percentOf } from "../src/lib/format.ts";

test("percentOf gives the share of max", () => {
  assert.equal(percentOf(3, 5), "60%");
});

test("percentOf clamps a value above max to full", () => {
  assert.equal(percentOf(7, 5), "100%");
});

test("percentOf draws nothing when max is zero", () => {
  assert.equal(percentOf(0, 0), "0%");
  assert.equal(percentOf(3, 0), "0%");
});

test("percentOf draws nothing when max is negative", () => {
  assert.equal(percentOf(3, -5), "0%");
});

test("bytes keeps small sizes in bytes", () => {
  assert.equal(bytes(0), "0 B");
  assert.equal(bytes(1023), "1023 B");
});

test("bytes shows one decimal below ten units", () => {
  assert.equal(bytes(1536), "1.5 KB");
  assert.equal(bytes(2.4 * 1024 * 1024), "2.4 MB");
});

test("bytes rounds from ten units up", () => {
  assert.equal(bytes(50 * 1024 * 1024), "50 MB");
  assert.equal(bytes(5 * 1024 ** 5), "5120 TB");
});

test("bytes moves to the next unit when rounding reaches it", () => {
  assert.equal(bytes(10239), "10 KB");
  assert.equal(bytes(1048575), "1.0 MB");
  assert.equal(bytes(1023.6), "1.0 KB");
});

test("milliseconds reads both units a minified stylesheet may use", () => {
  assert.equal(milliseconds("240ms"), 240);
  assert.equal(milliseconds(".24s"), 240);
  assert.equal(milliseconds("1.2s"), 1200);
  assert.equal(milliseconds("0s"), 0);
});

test("durationMs keeps a zero duration instead of the fallback", () => {
  assert.equal(durationMs("0s", 200), 0);
  assert.equal(durationMs("0ms", 200), 0);
});

test("durationMs falls back only when the token is missing", () => {
  assert.equal(durationMs("", 200), 200);
  assert.equal(durationMs("  ", 120, "0.5"), 60);
});

test("durationMs scales the token by motion intensity", () => {
  assert.equal(durationMs(" .24s ", 200, "0.5"), 120);
  assert.equal(durationMs("120ms", 200, "2"), 240);
  assert.equal(durationMs(".4s", 200, "0"), 0);
  assert.equal(durationMs(".4s", 200, ""), 400);
});

const at = (hour, minute = 0) => new Date(2026, 10, 14, hour, minute).getTime();
const KO = { h: "시간", m: "분", s: "초" };

test("clock shows local hours and minutes", () => {
  assert.equal(clock(at(9, 5)), "09:05");
});

test("clockTicks lands on round local times inside the range", () => {
  assert.deepEqual(clockTicks(at(9, 7), at(10, 7), 4).map(clock), ["09:15", "09:30", "09:45", "10:00"]);
  assert.deepEqual(clockTicks(at(8), at(20), 6).map(clock), ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]);
});

test("duration keeps the two largest units a person reads", () => {
  assert.equal(duration(45e3, KO), "45초");
  assert.equal(duration(27 * 6e4, KO), "27분");
  assert.equal(duration(60 * 6e4, KO), "1시간");
  assert.equal(duration(65 * 6e4, { h: "h", m: "m", s: "s" }), "1h 5m");
  assert.equal(duration(-5, KO), "0초");
});
